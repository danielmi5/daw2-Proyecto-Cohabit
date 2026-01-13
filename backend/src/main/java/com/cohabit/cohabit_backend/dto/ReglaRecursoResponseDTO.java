package com.cohabit.cohabit_backend.dto;

import com.cohabit.cohabit_backend.entity.TipoRegla;
import lombok.*;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Información sobre una regla de recurso")
public class ReglaRecursoResponseDTO {
    @Schema(description = "ID de la regla", example = "1")
    private Long id;
    @Schema(description = "Tipo de regla")
    private TipoRegla tipoRegla;
    @Schema(description = "Valor de la regla")
    private String valor;
    @Schema(description = "Descripción de la regla")
    private String descripcion;
    @Schema(description = "ID del recurso asociado")
    private Long recursoId;
    @Schema(description = "ID del miembro creador")
    private Long miembroCreadorId;
    @Schema(description = "Número secuencial de la regla dentro del recurso")
    private Integer numero;
    @Schema(description = "Fecha de creación", format = "date-time")
    private LocalDateTime fechaCreacion;
    @Schema(description = "Fecha de última actualización", format = "date-time")
    private LocalDateTime fechaActualizacion;
}
