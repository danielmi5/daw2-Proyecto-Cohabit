package com.cohabit.cohabit_backend.controller;

import com.cohabit.cohabit_backend.config.AutenticadorTests;
import com.cohabit.cohabit_backend.dto.*;
import com.cohabit.cohabit_backend.entity.EstadoRecurso;
import com.cohabit.cohabit_backend.entity.TipoRecurso;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD) // Marca el ApplicationContext como sucio y fuerza su recreación después de cada test (aisla el estado entre tests y evita contaminación por datos compartidos)
class RecursoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String tokenAdmin;
    private RecursoRequestDTO recursoRequestDTO;
    private Long grupoId;
    private Long creadorId;

    @BeforeEach
    void inicializar() throws Exception {
        tokenAdmin = AutenticadorTests.obtenerTokenAdmin(mockMvc, objectMapper);

        UsuarioRequestDTO usuarioDTO = UsuarioRequestDTO.builder()
                .nombre("nombre")
                .apellidos("apellidos")
                .email("email@email.com")
                .password("password")
                .build();

        MvcResult userResult = mockMvc.perform(post("/api/usuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(usuarioDTO))
                        .header(HttpHeaders.AUTHORIZATION, AutenticadorTests.construirHeaderAutorizacion(tokenAdmin)))
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
                        .content(objectMapper.writeValueAsString(grupoDTO))
                        .header(HttpHeaders.AUTHORIZATION, AutenticadorTests.construirHeaderAutorizacion(tokenAdmin)))
                .andExpect(status().isCreated())
                .andReturn();

        GrupoResponseDTO grupo = objectMapper.readValue(grupoResult.getResponse().getContentAsString(), GrupoResponseDTO.class);
        grupoId = grupo.getId();
        creadorId = 1L;

        recursoRequestDTO = RecursoRequestDTO.builder()
                .nombre("nombre")
                .descripcion("descripcion")
                .capacidad(1)
                .ubicacion("ubicacion")
                .tipo(TipoRecurso.HABITACION)
                .estadoActual(EstadoRecurso.DISPONIBLE)
                .grupoId(grupoId)
                .creadorId(creadorId)
                .build();
    }

        @Test
        void testCrearRecurso_DeberiaDevolverRecursoCreado() throws Exception {
        mockMvc.perform(post("/api/recursos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(recursoRequestDTO))
                        .header(HttpHeaders.AUTHORIZATION, AutenticadorTests.construirHeaderAutorizacion(tokenAdmin)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nombre").value("nombre"))
                .andExpect(jsonPath("$.descripcion").value("descripcion"))
                .andExpect(jsonPath("$.capacidad").value(1))
                        .andExpect(jsonPath("$.numero").value(1));
    }

        @Test
        void testObtenerRecursoPorId_DeberiaDevolverRecurso() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/recursos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(recursoRequestDTO))
                        .header(HttpHeaders.AUTHORIZATION, AutenticadorTests.construirHeaderAutorizacion(tokenAdmin)))
                .andExpect(status().isCreated())
                .andReturn();

        RecursoResponseDTO creado = objectMapper.readValue(result.getResponse().getContentAsString(), RecursoResponseDTO.class);

        mockMvc.perform(get("/api/recursos/" + creado.getId())
                        .header(HttpHeaders.AUTHORIZATION, AutenticadorTests.construirHeaderAutorizacion(tokenAdmin)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(creado.getId()))
                .andExpect(jsonPath("$.nombre").value("nombre"))
                        .andExpect(jsonPath("$.numero").value(creado.getNumero()));
    }

        @Test
        void testActualizarRecurso_DeberiaDevolverRecursoActualizado() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/recursos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(recursoRequestDTO))
                        .header(HttpHeaders.AUTHORIZATION, AutenticadorTests.construirHeaderAutorizacion(tokenAdmin)))
                .andExpect(status().isCreated())
                .andReturn();

        RecursoResponseDTO creado = objectMapper.readValue(result.getResponse().getContentAsString(), RecursoResponseDTO.class);

        RecursoRequestDTO actualizacion = RecursoRequestDTO.builder()
                .nombre("nombre2")
                .descripcion("descripcion2")
                .capacidad(2)
                .ubicacion("ubicacion2")
                .tipo(TipoRecurso.HABITACION)
                .estadoActual(EstadoRecurso.DISPONIBLE)
                .grupoId(grupoId)
                .creadorId(creadorId)
                .build();

        mockMvc.perform(put("/api/recursos/" + creado.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(actualizacion))
                        .header(HttpHeaders.AUTHORIZATION, AutenticadorTests.construirHeaderAutorizacion(tokenAdmin)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("nombre2"))
                .andExpect(jsonPath("$.descripcion").value("descripcion2"))
                        .andExpect(jsonPath("$.numero").value(creado.getNumero()));
    }

        @Test
        void testEliminarRecurso_DeberiaEliminarRecursoYNoEncontrarlo() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/recursos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(recursoRequestDTO))
                        .header(HttpHeaders.AUTHORIZATION, AutenticadorTests.construirHeaderAutorizacion(tokenAdmin)))
                .andExpect(status().isCreated())
                .andReturn();

        RecursoResponseDTO creado = objectMapper.readValue(result.getResponse().getContentAsString(), RecursoResponseDTO.class);

        mockMvc.perform(delete("/api/recursos/" + creado.getId())
                        .header(HttpHeaders.AUTHORIZATION, AutenticadorTests.construirHeaderAutorizacion(tokenAdmin)))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/recursos/" + creado.getId())
                        .header(HttpHeaders.AUTHORIZATION, AutenticadorTests.construirHeaderAutorizacion(tokenAdmin)))
                .andExpect(status().isNotFound());
    }

        @Test
        void testObtenerTodosLosRecursos_DeberiaDevolverListaDeRecursos() throws Exception {
        mockMvc.perform(post("/api/recursos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(recursoRequestDTO))
                        .header(HttpHeaders.AUTHORIZATION, AutenticadorTests.construirHeaderAutorizacion(tokenAdmin)))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/recursos")
                        .header(HttpHeaders.AUTHORIZATION, AutenticadorTests.construirHeaderAutorizacion(tokenAdmin)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].nombre").value("nombre"))
                        .andExpect(jsonPath("$.content[0].numero").value(1));
    }

            @Test
            void testBuscarRecursos_PorGrupo_DeberiaDevolverResultados() throws Exception {
                MvcResult result = mockMvc.perform(post("/api/recursos")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(recursoRequestDTO))
                                .header(HttpHeaders.AUTHORIZATION, AutenticadorTests.construirHeaderAutorizacion(tokenAdmin)))
                        .andExpect(status().isCreated())
                        .andReturn();

                RecursoResponseDTO creado = objectMapper.readValue(result.getResponse().getContentAsString(), RecursoResponseDTO.class);

                mockMvc.perform(get("/api/recursos/buscar?grupoId=" + creado.getGrupoId())
                                .header(HttpHeaders.AUTHORIZATION, AutenticadorTests.construirHeaderAutorizacion(tokenAdmin)))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.content").isArray())
                        .andExpect(jsonPath("$.content[0].id").value(creado.getId()))
                                .andExpect(jsonPath("$.content[0].numero").value(creado.getNumero()));
            }
}
