package com.cohabit.cohabit_backend.controller;

import com.cohabit.cohabit_backend.dto.*;
import com.cohabit.cohabit_backend.entity.RolGrupo;
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
class MiembroGrupoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private MiembroGrupoRequestDTO miembroGrupoRequestDTO;
    private Long usuarioId;
    private Long grupoId;

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
        usuarioId = usuario.getId();

        GrupoRequestDTO grupoDTO = GrupoRequestDTO.builder()
                .nombre("nombre")
                .direccion("direccion")
                .descripcion("descripcion")
                .creadorId(usuarioId)
                .build();

        MvcResult grupoResult = mockMvc.perform(post("/api/grupos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(grupoDTO)))
                .andExpect(status().isCreated())
                .andReturn();

        GrupoResponseDTO grupo = objectMapper.readValue(grupoResult.getResponse().getContentAsString(), GrupoResponseDTO.class);
        grupoId = grupo.getId();

        miembroGrupoRequestDTO = MiembroGrupoRequestDTO.builder()
                .usuarioId(usuarioId)
                .grupoId(grupoId)
                .rol(RolGrupo.MIEMBRO)
                .activo(true)
                .build();
    }

        @Test
        void testObtenerMiembroPorId_DeberiaDevolverMiembro() throws Exception {
        mockMvc.perform(get("/api/miembros/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.rol").value("CREADOR"));
    }

        @Test
        void testActualizarMiembro_DeberiaDevolverMiembroActualizado() throws Exception {
        MiembroGrupoRequestDTO actualizacion = MiembroGrupoRequestDTO.builder()
                .usuarioId(usuarioId)
                .grupoId(grupoId)
                .rol(RolGrupo.ADMIN)
                .activo(false)
                .build();

        mockMvc.perform(put("/api/miembros/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(actualizacion)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.rol").value("ADMIN"))
                .andExpect(jsonPath("$.activo").value(false));
    }

        @Test
        void testEliminarMiembro_DeberiaEliminarMiembroYNoEncontrarlo() throws Exception {
        mockMvc.perform(delete("/api/miembros/1"))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/miembros/1"))
                .andExpect(status().isNotFound());
    }

        @Test
        void testObtenerTodosLosMiembros_DeberiaDevolverListaDeMiembros() throws Exception {
        mockMvc.perform(get("/api/miembros"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

        @Test
        void testValidarRolRequerido_DeberiaRetornarBadRequest() throws Exception {
        MiembroGrupoRequestDTO invalido = MiembroGrupoRequestDTO.builder()
                .usuarioId(usuarioId)
                .grupoId(grupoId)
                .activo(true)
                .build();

        mockMvc.perform(post("/api/miembros")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalido)))
                .andExpect(status().isBadRequest());
    }
}
