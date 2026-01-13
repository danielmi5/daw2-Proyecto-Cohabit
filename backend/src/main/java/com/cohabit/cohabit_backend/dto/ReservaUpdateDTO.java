package com.cohabit.cohabit_backend.dto;

import com.cohabit.cohabit_backend.entity.EstadoReserva;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.*;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Campos para actualizar una reserva (opcionales)")
public class ReservaUpdateDTO {
    @Schema(description = "Fecha de la reserva", format = "date")
    private LocalDate fecha;

    @Schema(description = "Hora de inicio", format = "time")
    private LocalTime horaInicio;

    @Schema(description = "Hora de fin", format = "time")
    private LocalTime horaFin;

    @Size(max = 1000, message = "Las notas no pueden exceder 1000 caracteres")
    @Schema(description = "Notas de la reserva")
    private String notas;

    @Min(value = 1, message = "El número de personas debe ser al menos 1")
    @Schema(description = "Número de personas")
    private Integer numPersonas;

    @Schema(description = "Estado de la reserva")
    private EstadoReserva estado;
}
