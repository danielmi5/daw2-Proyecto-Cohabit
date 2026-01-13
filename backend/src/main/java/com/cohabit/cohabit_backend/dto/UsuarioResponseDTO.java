package com.cohabit.cohabit_backend.dto;

import lombok.*;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Información de usuario devuelta por la API")
public class UsuarioResponseDTO {
    @Schema(description = "Identificador del usuario", example = "123")
    private Long id;

    @Schema(description = "Nombre del usuario", example = "nombre")
    private String nombre;

    @Schema(description = "Apellidos del usuario", example = "apellidos")
    private String apellidos;

    @Schema(description = "Email del usuario", example = "email@example.com", format = "email")
    private String email;

    @Schema(description = "URL de la foto de perfil")
    private String fotoPerfil;

    @Schema(description = "País del usuario", example = "pais")
    private String pais;

    @Schema(description = "Ciudad del usuario", example = "ciudad")
    private String ciudad;

    @Schema(description = "Teléfono de contacto", example = "+34 600 000 000")
    private String telefono;

    @Schema(description = "Fecha de registro", format = "date-time")
    private LocalDateTime fechaRegistro;

    @Schema(description = "ID del miembro de grupo asociado (si aplica)")
    private Long miembroGrupoId;
}
