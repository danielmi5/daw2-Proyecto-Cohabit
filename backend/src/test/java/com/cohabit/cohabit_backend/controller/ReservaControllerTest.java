package com.cohabit.cohabit_backend.controller;

import com.cohabit.cohabit_backend.dto.*;
import com.cohabit.cohabit_backend.entity.EstadoRecurso;
import com.cohabit.cohabit_backend.entity.EstadoReserva;
import com.cohabit.cohabit_backend.entity.TipoRecurso;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD) // Marca el ApplicationContext como sucio y fuerza su recreación después de cada test (aisla el estado entre tests y evita contaminación por datos compartidos)
class ReservaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private ReservaRequestDTO reservaRequestDTO;
    private Long recursoId;
    private Long miembroGrupoId;

    @BeforeEach
    void inicializar() throws Exception {
        UsuarioRequestDTO usuarioDTO = UsuarioRequestDTO.builder()
                .nombre("nombre")
                .apellidos("apellidos")
                .email("email@email.com")
                .password("password")
                .build();

        MvcResult userResult = mockMvc.perform(post("/api/usuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(usuarioDTO)))
                .andExpect(status().isCreated())
                .andReturn();

        UsuarioResponseDTO usuario = objectMapper.readValue(userResult.getResponse().getContentAsString(), UsuarioResponseDTO.class);

        GrupoRequestDTO grupoDTO = GrupoRequestDTO.builder()
                .nombre("nombre")
                .direccion("direccion")
                .descripcion("descripcion")
                .creadorId(usuario.getId())
                .build();

        MvcResult grupoResult = mockMvc.perform(post("/api/grupos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(grupoDTO)))
                .andExpect(status().isCreated())
                .andReturn();

        GrupoResponseDTO grupo = objectMapper.readValue(grupoResult.getResponse().getContentAsString(), GrupoResponseDTO.class);
        miembroGrupoId = 1L;

        RecursoRequestDTO recursoDTO = RecursoRequestDTO.builder()
                .nombre("nombre")
                .descripcion("descripcion")
                .capacidad(1)
                .ubicacion("ubicacion")
                .tipo(TipoRecurso.HABITACION)
                .estadoActual(EstadoRecurso.DISPONIBLE)
                .grupoId(grupo.getId())
                .creadorId(miembroGrupoId)
                .build();

        MvcResult recursoResult = mockMvc.perform(post("/api/recursos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(recursoDTO)))
                .andExpect(status().isCreated())
                .andReturn();

        RecursoResponseDTO recurso = objectMapper.readValue(recursoResult.getResponse().getContentAsString(), RecursoResponseDTO.class);
        recursoId = recurso.getId();

        reservaRequestDTO = ReservaRequestDTO.builder()
                .fecha(LocalDate.of(2025, 12, 15))
                .horaInicio(LocalTime.of(10, 0))
                .horaFin(LocalTime.of(11, 0))
                .notas("notas")
                .numPersonas(1)
                .estado(EstadoReserva.CONFIRMADA)
                .recursoId(recursoId)
                .miembroGrupoId(miembroGrupoId)
                .build();
    }

        @Test
        void testCrearReserva_DeberiaDevolverReservaCreada() throws Exception {
        mockMvc.perform(post("/api/reservas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reservaRequestDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.fecha").value("2025-12-15"))
                .andExpect(jsonPath("$.horaInicio").value("10:00:00"))
                .andExpect(jsonPath("$.horaFin").value("11:00:00"))
                .andExpect(jsonPath("$.estado").value("CONFIRMADA"));
    }

        @Test
        void testObtenerReservaPorId_DeberiaDevolverReserva() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/reservas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reservaRequestDTO)))
                .andExpect(status().isCreated())
                .andReturn();

        ReservaResponseDTO creada = objectMapper.readValue(result.getResponse().getContentAsString(), ReservaResponseDTO.class);

        mockMvc.perform(get("/api/reservas/" + creada.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(creada.getId()))
                .andExpect(jsonPath("$.estado").value("CONFIRMADA"));
    }

        @Test
        void testActualizarReserva_DeberiaDevolverReservaActualizada() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/reservas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reservaRequestDTO)))
                .andExpect(status().isCreated())
                .andReturn();

        ReservaResponseDTO creada = objectMapper.readValue(result.getResponse().getContentAsString(), ReservaResponseDTO.class);

        ReservaRequestDTO actualizacion = ReservaRequestDTO.builder()
                .fecha(LocalDate.of(2025, 12, 16))
                .horaInicio(LocalTime.of(14, 0))
                .horaFin(LocalTime.of(15, 0))
                .notas("notas2")
                .numPersonas(2)
                .estado(EstadoReserva.CANCELADA)
                .miembroGrupoId(miembroGrupoId)
                .recursoId(recursoId)
                .build();

        mockMvc.perform(put("/api/reservas/" + creada.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(actualizacion)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.notas").value("notas2"))
                .andExpect(jsonPath("$.estado").value("CANCELADA"));
    }

        @Test
        void testEliminarReserva_DeberiaEliminarReservaYNoEncontrarla() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/reservas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reservaRequestDTO)))
                .andExpect(status().isCreated())
                .andReturn();

        ReservaResponseDTO creada = objectMapper.readValue(result.getResponse().getContentAsString(), ReservaResponseDTO.class);

        mockMvc.perform(delete("/api/reservas/" + creada.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/reservas/" + creada.getId()))
                .andExpect(status().isNotFound());
    }

        @Test
        void testObtenerTodasLasReservas_DeberiaDevolverListaDeReservas() throws Exception {
        mockMvc.perform(post("/api/reservas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reservaRequestDTO)))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/reservas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].estado").value("CONFIRMADA"));
    }
}
