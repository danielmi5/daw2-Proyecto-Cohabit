package com.cohabit.cohabit_backend.dto;

import com.cohabit.cohabit_backend.entity.EstadoReserva;
import lombok.*;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Información de una reserva")
public class ReservaResponseDTO {
    @Schema(description = "Identificador de la reserva", example = "1")
    private Long id;

    @Schema(description = "Fecha de la reserva", format = "date")
    private LocalDate fecha;

    @Schema(description = "Hora de inicio", format = "time")
    private LocalTime horaInicio;

    @Schema(description = "Hora de fin", format = "time")
    private LocalTime horaFin;

    @Schema(description = "Notas de la reserva")
    private String notas;

    @Schema(description = "Número de personas")
    private Integer numPersonas;

    @Schema(description = "Estado de la reserva")
    private EstadoReserva estado;

    @Schema(description = "ID del miembro del grupo que hizo la reserva")
    private Long miembroGrupoId;

    @Schema(description = "ID del recurso reservado")
    private Long recursoId;

    @Schema(description = "Número de reserva dentro del recurso")
    private Integer numero;

    @Schema(description = "Fecha de creación", format = "date-time")
    private LocalDateTime fechaCreacion;

    @Schema(description = "Fecha de última actualización", format = "date-time")
    private LocalDateTime fechaActualizacion;
}
