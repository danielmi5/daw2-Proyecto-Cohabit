package com.cohabit.cohabit_backend.dto;

import com.cohabit.cohabit_backend.entity.EstadoRecurso;
import com.cohabit.cohabit_backend.entity.TipoRecurso;
import lombok.*;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Información de un recurso")
public class RecursoResponseDTO {
    @Schema(description = "Identificador del recurso", example = "5")
    private Long id;

    @Schema(description = "Nombre del recurso", example = "nombre")
    private String nombre;

    @Schema(description = "Descripción del recurso")
    private String descripcion;

    @Schema(description = "URL de la foto del recurso")
    private String fotoRecurso;

    @Schema(description = "Capacidad del recurso", example = "6")
    private Integer capacidad;

    @Schema(description = "Ubicación dentro del grupo")
    private String ubicacion;

    @Schema(description = "Tipo de recurso")
    private TipoRecurso tipo;

    @Schema(description = "Estado actual del recurso")
    private EstadoRecurso estadoActual;

    @Schema(description = "ID del grupo al que pertenece")
    private Long grupoId;

    @Schema(description = "Número del recurso dentro del grupo")
    private Integer numero;

    @Schema(description = "ID del usuario creador")
    private Long creadorId;

    @Schema(description = "IDs de reservas asociadas")
    private List<Long> reservasIds;

    @Schema(description = "IDs de reglas asociadas")
    private List<Long> reglasIds;

    @Schema(description = "Fecha de creación", format = "date-time")
    private LocalDateTime fechaCreacion;

    @Schema(description = "Fecha de última actualización", format = "date-time")
    private LocalDateTime fechaActualizacion;
}
