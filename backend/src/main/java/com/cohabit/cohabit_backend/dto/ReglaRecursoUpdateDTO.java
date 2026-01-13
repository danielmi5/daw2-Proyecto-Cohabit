package com.cohabit.cohabit_backend.dto;

import com.cohabit.cohabit_backend.entity.TipoRegla;
import jakarta.validation.constraints.Size;
import lombok.*;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Campos para actualizar una regla de recurso (opcionales)")
public class ReglaRecursoUpdateDTO {
    @Schema(description = "Tipo de regla")
    private TipoRegla tipoRegla;

    @Size(max = 255, message = "El valor no puede exceder 255 caracteres")
    @Schema(description = "Valor de la regla")
    private String valor;

    @Size(max = 1000, message = "La descripción no puede exceder 1000 caracteres")
    @Schema(description = "Descripción de la regla")
    private String descripcion;
}
