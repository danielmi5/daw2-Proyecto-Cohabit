package com.cohabit.cohabit_backend.security.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@Schema(description = "Respuesta de autenticación con token JWT")
public class AuthResponseDTO {
    @Schema(description = "Token JWT para autenticación", example = "jwt-token")
    private String token;
}
