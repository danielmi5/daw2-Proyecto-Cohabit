package com.cohabit.cohabit_backend.dto;

import com.cohabit.cohabit_backend.entity.TipoRegla;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Datos para crear una regla de recurso")
public class ReglaRecursoRequestDTO {
    
    @NotNull(message = "El tipo de regla es obligatorio")
    @Schema(description = "Tipo de regla", required = true, example = "TIPO")
    private TipoRegla tipoRegla;
    
    @NotBlank(message = "El valor de la regla es obligatorio")
    @Size(max = 255, message = "El valor no puede exceder 255 caracteres")
    @Schema(description = "Valor de la regla", example = "09:00-18:00", required = true)
    private String valor;
    
    @Size(max = 1000, message = "La descripción no puede exceder 1000 caracteres")
    @Schema(description = "Descripción de la regla")
    private String descripcion;
    
    @NotNull(message = "El ID del recurso es obligatorio")
    @Schema(description = "ID del recurso al que aplica la regla", required = true)
    private Long recursoId;
    
    @NotNull(message = "El ID del miembro creador es obligatorio")
    @Schema(description = "ID del miembro que creó la regla", required = true)
    private Long miembroId;
}
