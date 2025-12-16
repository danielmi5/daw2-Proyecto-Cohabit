package com.cohabit.cohabit_backend.config;

import com.cohabit.cohabit_backend.security.auth.dto.AuthResponseDTO;
import com.cohabit.cohabit_backend.security.auth.dto.RegisterRequestDTO;
import com.cohabit.cohabit_backend.entity.RolUsuario;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Helper para configuración de autenticación en tests
 */
@Component
public class AutenticadorTests {

    /**
     * Registra y autentica un usuario ADMIN para tests
     * @return Token JWT del usuario ADMIN
     */
    public static String obtenerTokenAdmin(MockMvc mockMvc, ObjectMapper objectMapper) throws Exception {
        // Registrar usuario admin
        RegisterRequestDTO registro = new RegisterRequestDTO();
        registro.setNombre("Admin");
        registro.setApellidos("Test");
        registro.setEmail("admin_test_" + System.currentTimeMillis() + "@test.com");
        registro.setPassword("password123");
        registro.setRol(RolUsuario.ADMIN);  // Asignar rol ADMIN

        String responseRegistro = mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registro)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        AuthResponseDTO authResponse = objectMapper.readValue(responseRegistro, AuthResponseDTO.class);
        return authResponse.getToken();
    }

    /**
     * Registra y autentica un usuario USUARIO (rol normal) para tests
     * @return Token JWT del usuario USUARIO
     */
    public static String obtenerTokenUsuario(MockMvc mockMvc, ObjectMapper objectMapper) throws Exception {
        // Registrar usuario normal
        RegisterRequestDTO registro = new RegisterRequestDTO();
        registro.setNombre("Usuario");
        registro.setApellidos("Test");
        registro.setEmail("usuario_test_" + System.currentTimeMillis() + "@test.com");
        registro.setPassword("password123");
        registro.setRol(RolUsuario.USUARIO);  // Asignar rol USUARIO explícitamente

        String responseRegistro = mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registro)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        AuthResponseDTO authResponse = objectMapper.readValue(responseRegistro, AuthResponseDTO.class);
        return authResponse.getToken();
    }

    /**
     * Construye el header de autorización con el token
     */
    public static String construirHeaderAutorizacion(String token) {
        return "Bearer " + token;
    }
}
