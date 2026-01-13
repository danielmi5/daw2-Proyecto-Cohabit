package com.cohabit.cohabit_backend.security.auth.dto;

import com.cohabit.cohabit_backend.entity.RolUsuario;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "Datos de registro de nuevo usuario")
public class RegisterRequestDTO {
    @NotBlank(message = "El nombre es obligatorio")
    @Schema(description = "Nombre del usuario", example = "nombre", required = true)
    private String nombre;

    @NotBlank(message = "Los apellidos son obligatorios")
    @Schema(description = "Apellidos del usuario", example = "apellidos", required = true)
    private String apellidos;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email no tiene un formato válido")
    @Schema(description = "Email del usuario (debe ser único)", example = "email@example.com", required = true)
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    @Schema(description = "Contraseña del usuario", example = "••••••••", required = true)
    private String password;
    
    @Schema(description = "Rol del usuario (opcional, por defecto USER)", example = "USER")
    private RolUsuario rol;
}
