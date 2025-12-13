package com.cohabit.cohabit_backend.controller;

import com.cohabit.cohabit_backend.dto.*;
import com.cohabit.cohabit_backend.entity.EstadoRecurso;
import com.cohabit.cohabit_backend.entity.TipoRecurso;
import com.cohabit.cohabit_backend.entity.TipoRegla;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD) // Marca el ApplicationContext como sucio y fuerza su recreación después de cada test (aisla el estado entre tests y evita contaminación por datos compartidos)
class ReglaRecursoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private ReglaRecursoRequestDTO reglaRecursoRequestDTO;
    private Long recursoId;

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

        RecursoRequestDTO recursoDTO = RecursoRequestDTO.builder()
                .nombre("nombre")
                .descripcion("descripcion")
                .capacidad(1)
                .ubicacion("ubicacion")
                .tipo(TipoRecurso.HABITACION)
                .estadoActual(EstadoRecurso.DISPONIBLE)
                .grupoId(grupo.getId())
                .creadorId(1L)
                .build();

        MvcResult recursoResult = mockMvc.perform(post("/api/recursos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(recursoDTO)))
                .andExpect(status().isCreated())
                .andReturn();

        RecursoResponseDTO recurso = objectMapper.readValue(recursoResult.getResponse().getContentAsString(), RecursoResponseDTO.class);
        recursoId = recurso.getId();

        reglaRecursoRequestDTO = ReglaRecursoRequestDTO.builder()
                .tipoRegla(TipoRegla.DURACION_MAX)
                .valor("valor")
                .descripcion("descripcion")
                .recursoId(recursoId)
                .build();
    }

        @Test
        void testCrearRegla_DeberiaDevolverReglaCreada() throws Exception {
        mockMvc.perform(post("/api/reglas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reglaRecursoRequestDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.tipoRegla").value("DURACION_MAX"))
                .andExpect(jsonPath("$.valor").value("valor"))
                .andExpect(jsonPath("$.descripcion").value("descripcion"));
    }

        @Test
        void testObtenerReglaPorId_DeberiaDevolverRegla() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/reglas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reglaRecursoRequestDTO)))
                .andExpect(status().isCreated())
                .andReturn();

        ReglaRecursoResponseDTO creada = objectMapper.readValue(result.getResponse().getContentAsString(), ReglaRecursoResponseDTO.class);

        mockMvc.perform(get("/api/reglas/" + creada.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(creada.getId()))
                .andExpect(jsonPath("$.tipoRegla").value("DURACION_MAX"));
    }

        @Test
        void testActualizarRegla_DeberiaDevolverReglaActualizada() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/reglas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reglaRecursoRequestDTO)))
                .andExpect(status().isCreated())
                .andReturn();

        ReglaRecursoResponseDTO creada = objectMapper.readValue(result.getResponse().getContentAsString(), ReglaRecursoResponseDTO.class);

        ReglaRecursoRequestDTO actualizacion = ReglaRecursoRequestDTO.builder()
                .tipoRegla(TipoRegla.HORARIO_APERTURA)
                .valor("valor2")
                .descripcion("descripcion2")
                .recursoId(recursoId)
                .build();

        mockMvc.perform(put("/api/reglas/" + creada.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(actualizacion)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tipoRegla").value("HORARIO_APERTURA"))
                .andExpect(jsonPath("$.valor").value("valor2"));
    }

        @Test
        void testEliminarRegla_DeberiaEliminarReglaYNoEncontrarla() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/reglas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reglaRecursoRequestDTO)))
                .andExpect(status().isCreated())
                .andReturn();

        ReglaRecursoResponseDTO creada = objectMapper.readValue(result.getResponse().getContentAsString(), ReglaRecursoResponseDTO.class);

        mockMvc.perform(delete("/api/reglas/" + creada.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/reglas/" + creada.getId()))
                .andExpect(status().isNotFound());
    }

        @Test
        void testObtenerTodasLasReglas_DeberiaDevolverListaDeReglas() throws Exception {
        mockMvc.perform(post("/api/reglas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reglaRecursoRequestDTO)))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/reglas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].tipoRegla").value("DURACION_MAX"));
    }
}
