package com.cohabit.cohabit_backend.security.auth.controller;

import com.cohabit.cohabit_backend.security.auth.dto.AuthRequestDTO;
import com.cohabit.cohabit_backend.security.auth.dto.AuthResponseDTO;
import com.cohabit.cohabit_backend.security.auth.dto.RegisterRequestDTO;
import com.cohabit.cohabit_backend.security.auth.service.AutenticacionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import com.cohabit.cohabit_backend.dto.ApiErrorDTO;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticación", description = "Endpoints para autenticación y registro de usuarios")
public class AutenticacionController {

    private final AutenticacionService autenticacionService;

    @PostMapping("/login")
    @Operation(
        summary = "Iniciar sesión",
        description = "Autenticar usuario y obtener token JWT. Credenciales de prueba: admin@cohabit.com / admin123"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Login exitoso",
            content = @Content(schema = @Schema(implementation = AuthResponseDTO.class))
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Credenciales incorrectas",
            content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))
        )
    })
    public ResponseEntity<AuthResponseDTO> iniciarSesion(@Valid @RequestBody AuthRequestDTO peticion) {
        AuthResponseDTO response = autenticacionService.iniciarSesion(peticion);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    @Operation(
        summary = "Registrar usuario",
        description = "Crear una nueva cuenta de usuario en el sistema"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Usuario registrado exitosamente",
            content = @Content(schema = @Schema(implementation = AuthResponseDTO.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Datos de registro inválidos o email ya registrado",
            content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))
        )
    })
    public ResponseEntity<AuthResponseDTO> registrar(@Valid @RequestBody RegisterRequestDTO peticion) {
        AuthResponseDTO response = autenticacionService.registrar(peticion);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/logout")
    @Operation(
        summary = "Cerrar sesión",
        description = "Invalidar el token JWT del usuario autenticado"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Sesión cerrada exitosamente"
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Token inválido o no proporcionado",
            content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))
        )
    })
        @SecurityRequirement(name = "esquemaCohabitJWT")
    public ResponseEntity<Map<String, String>> cerrarSesion(
        @Parameter(description = "Token JWT en formato: Bearer {token}", required = true)
        @RequestHeader(value = "Authorization", required = true) String authorizationHeader) {
        autenticacionService.cerrarSesion(authorizationHeader);

        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Sesión cerrada exitosamente");

        return ResponseEntity.ok(respuesta);
    }
}
