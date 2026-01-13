package com.cohabit.cohabit_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.*;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Campos para actualizar un usuario (todos opcionales)")
public class UsuarioUpdateDTO {
    @Size(max = 255, message = "El nombre no puede exceder 255 caracteres")
    @Schema(description = "Nombre del usuario", example = "nombre")
    private String nombre;

    @Size(max = 255, message = "Los apellidos no pueden exceder 255 caracteres")
    @Schema(description = "Apellidos del usuario", example = "apellidos")
    private String apellidos;

    @Email(message = "El email debe tener un formato válido")
    @Size(max = 255, message = "El email no puede exceder 255 caracteres")
    @Schema(description = "Email del usuario", example = "email@example.com", format = "email")
    private String email;

    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    @Schema(description = "Contraseña (si se actualiza)", format = "password", minLength = 6, example = "••••••••")
    private String password;

    @Schema(description = "URL de la foto de perfil")
    private String fotoPerfil;

    @Size(max = 100, message = "El país no puede exceder 100 caracteres")
    @Schema(description = "País del usuario", example = "pais")
    private String pais;

    @Size(max = 100, message = "La ciudad no puede exceder 100 caracteres")
    @Schema(description = "Ciudad del usuario", example = "ciudad")
    private String ciudad;

    @Size(max = 20, message = "El teléfono no puede exceder 20 caracteres")
    @Schema(description = "Teléfono de contacto", example = "+34 600 000 000")
    private String telefono;
}
