package com.cohabit.cohabit_backend.controller;

import com.cohabit.cohabit_backend.dto.GrupoRequestDTO;
import com.cohabit.cohabit_backend.dto.GrupoResponseDTO;
import com.cohabit.cohabit_backend.dto.UsuarioRequestDTO;
import com.cohabit.cohabit_backend.dto.UsuarioResponseDTO;
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
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD) // Recrea el contexto de la aplicación después de cada test para aislar el estado de la base de datos
class GrupoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private GrupoRequestDTO grupoRequestDTO;
    private Long creadorId;

    @BeforeEach
    void inicializar() throws Exception {
        UsuarioRequestDTO usuarioDTO = UsuarioRequestDTO.builder()
                .nombre("nombre")
                .apellidos("apellidos")
                .email("email@email.com")
                .password("password")
                .build();

        MvcResult result = mockMvc.perform(post("/api/usuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(usuarioDTO)))
                .andExpect(status().isCreated())
                .andReturn();

        UsuarioResponseDTO usuario = objectMapper.readValue(result.getResponse().getContentAsString(), UsuarioResponseDTO.class);
        creadorId = usuario.getId();

        grupoRequestDTO = GrupoRequestDTO.builder()
                .nombre("nombre")
                .direccion("direccion")
                .descripcion("descripcion")
                .creadorId(creadorId)
                .build();
    }

        @Test
        void testCrearGrupo_DeberiaDevolverGrupoCreado() throws Exception {
        mockMvc.perform(post("/api/grupos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(grupoRequestDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nombre").value("nombre"))
                .andExpect(jsonPath("$.direccion").value("direccion"))
                .andExpect(jsonPath("$.descripcion").value("descripcion"));
    }

        @Test
        void testObtenerGrupoPorId_DeberiaDevolverGrupo() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/grupos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(grupoRequestDTO)))
                .andExpect(status().isCreated())
                .andReturn();

        GrupoResponseDTO creado = objectMapper.readValue(result.getResponse().getContentAsString(), GrupoResponseDTO.class);

        mockMvc.perform(get("/api/grupos/" + creado.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(creado.getId()))
                .andExpect(jsonPath("$.nombre").value("nombre"));
    }

        @Test
        void testActualizarGrupo_DeberiaDevolverGrupoActualizado() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/grupos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(grupoRequestDTO)))
                .andExpect(status().isCreated())
                .andReturn();

        GrupoResponseDTO creado = objectMapper.readValue(result.getResponse().getContentAsString(), GrupoResponseDTO.class);

        GrupoRequestDTO actualizacion = GrupoRequestDTO.builder()
                .nombre("nombre2")
                .direccion("direccion2")
                .descripcion("descripcion2")
                .creadorId(creadorId)
                .build();

        mockMvc.perform(put("/api/grupos/" + creado.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(actualizacion)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("nombre2"))
                .andExpect(jsonPath("$.direccion").value("direccion2"));
    }

        @Test
        void testEliminarGrupo_DeberiaEliminarGrupoYNoEncontrarlo() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/grupos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(grupoRequestDTO)))
                .andExpect(status().isCreated())
                .andReturn();

        GrupoResponseDTO creado = objectMapper.readValue(result.getResponse().getContentAsString(), GrupoResponseDTO.class);

        mockMvc.perform(delete("/api/grupos/" + creado.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/grupos/" + creado.getId()))
                .andExpect(status().isNotFound());
    }

        @Test
        void testObtenerTodosLosGrupos_DeberiaDevolverListaDeGrupos() throws Exception {
        mockMvc.perform(post("/api/grupos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(grupoRequestDTO)))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/grupos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].nombre").value("nombre"));
    }

            @Test
            void testBuscarGrupos_PorNombre_DeberiaDevolverResultados() throws Exception {
                MvcResult result = mockMvc.perform(post("/api/grupos")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(grupoRequestDTO)))
                        .andExpect(status().isCreated())
                        .andReturn();

                GrupoResponseDTO creado = objectMapper.readValue(result.getResponse().getContentAsString(), GrupoResponseDTO.class);

                mockMvc.perform(get("/api/grupos/buscar?nombre=nombre"))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.content").isArray())
                        .andExpect(jsonPath("$.content[0].id").value(creado.getId()));
            }
}
