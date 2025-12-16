package com.cohabit.cohabit_backend.controller;

import com.cohabit.cohabit_backend.config.AutenticadorTests;
import com.cohabit.cohabit_backend.dto.UsuarioRequestDTO;
import com.cohabit.cohabit_backend.dto.UsuarioResponseDTO;
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
class UsuarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private UsuarioRequestDTO usuarioRequestDTO;
    private String tokenAdmin;

    @BeforeEach
    void inicializar() throws Exception {
        tokenAdmin = AutenticadorTests.obtenerTokenAdmin(mockMvc, objectMapper);
        usuarioRequestDTO = UsuarioRequestDTO.builder()
                .nombre("nombre")
                .apellidos("apellidos")
                .email("email@email.com")
                .password("password")
                .fotoPerfil("fotoPerfil")
                .build();
    }

        @Test
        void testCrearUsuario_DeberiaDevolverUsuarioCreado() throws Exception {
        mockMvc.perform(post("/api/usuarios")
                        .header(HttpHeaders.AUTHORIZATION, AutenticadorTests.construirHeaderAutorizacion(tokenAdmin))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(usuarioRequestDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nombre").value("nombre"))
                .andExpect(jsonPath("$.apellidos").value("apellidos"))
                .andExpect(jsonPath("$.email").value("email@email.com"));
    }

        @Test
        void testObtenerUsuarioPorId_DeberiaDevolverUsuario() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/usuarios")
                        .header(HttpHeaders.AUTHORIZATION, AutenticadorTests.construirHeaderAutorizacion(tokenAdmin))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(usuarioRequestDTO)))
                .andExpect(status().isCreated())
                .andReturn();

        UsuarioResponseDTO creado = objectMapper.readValue(result.getResponse().getContentAsString(), UsuarioResponseDTO.class);

        mockMvc.perform(get("/api/usuarios/" + creado.getId())
                        .header(HttpHeaders.AUTHORIZATION, AutenticadorTests.construirHeaderAutorizacion(tokenAdmin)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(creado.getId()))
                .andExpect(jsonPath("$.nombre").value("nombre"));
    }

        @Test
        void testActualizarUsuario_DeberiaDevolverUsuarioActualizado() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/usuarios")
                        .header(HttpHeaders.AUTHORIZATION, AutenticadorTests.construirHeaderAutorizacion(tokenAdmin))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(usuarioRequestDTO)))
                .andExpect(status().isCreated())
                .andReturn();

        UsuarioResponseDTO creado = objectMapper.readValue(result.getResponse().getContentAsString(), UsuarioResponseDTO.class);

        UsuarioRequestDTO actualizacion = UsuarioRequestDTO.builder()
                .nombre("nombre2")
                .apellidos("apellidos2")
                .email("email2@email.com")
                .password("password2")
                .build();

        mockMvc.perform(put("/api/usuarios/" + creado.getId())
                        .header(HttpHeaders.AUTHORIZATION, AutenticadorTests.construirHeaderAutorizacion(tokenAdmin))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(actualizacion)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("nombre2"))
                .andExpect(jsonPath("$.apellidos").value("apellidos2"));
    }

        @Test
        void testEliminarUsuario_DeberiaEliminarUsuarioYNoEncontrarlo() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/usuarios")
                        .header(HttpHeaders.AUTHORIZATION, AutenticadorTests.construirHeaderAutorizacion(tokenAdmin))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(usuarioRequestDTO)))
                .andExpect(status().isCreated())
                .andReturn();

        UsuarioResponseDTO creado = objectMapper.readValue(result.getResponse().getContentAsString(), UsuarioResponseDTO.class);

        mockMvc.perform(delete("/api/usuarios/" + creado.getId())
                        .header(HttpHeaders.AUTHORIZATION, AutenticadorTests.construirHeaderAutorizacion(tokenAdmin)))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/usuarios/" + creado.getId())
                        .header(HttpHeaders.AUTHORIZATION, AutenticadorTests.construirHeaderAutorizacion(tokenAdmin)))
                .andExpect(status().isNotFound());
    }

        @Test
        void testObtenerTodosLosUsuarios_DeberiaDevolverListaDeUsuarios() throws Exception {
        mockMvc.perform(post("/api/usuarios")
                        .header(HttpHeaders.AUTHORIZATION, AutenticadorTests.construirHeaderAutorizacion(tokenAdmin))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(usuarioRequestDTO)))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/usuarios")
                        .header(HttpHeaders.AUTHORIZATION, AutenticadorTests.construirHeaderAutorizacion(tokenAdmin)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[1].nombre").value("nombre"));
    }
}
