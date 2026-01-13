package com.cohabit.cohabit_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Datos para crear un grupo")
public class GrupoRequestDTO {
    
    @NotBlank(message = "El nombre del grupo es obligatorio")
    @Size(max = 255, message = "El nombre no puede exceder 255 caracteres")
    @Schema(description = "Nombre del grupo", example = "nombre")
    private String nombre;
    
    @Size(max = 255, message = "La dirección no puede exceder 255 caracteres")
    @Schema(description = "Dirección del grupo")
    private String direccion;
    
    @Size(max = 1000, message = "La descripción no puede exceder 1000 caracteres")
    @Schema(description = "Descripción del grupo")
    private String descripcion;
    
    @Schema(description = "URL de la foto del grupo")
    private String fotoGrupo;

    @NotNull(message = "El ID del creador es obligatorio")
    @Schema(description = "ID del usuario creador del grupo", required = true, example = "7")
    private Long creadorId;
}
