package com.cohabit.cohabit_backend.dto;

import com.cohabit.cohabit_backend.entity.EstadoReserva;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservaUpdateDTO {
    private LocalDate fecha;

    private LocalTime horaInicio;

    private LocalTime horaFin;

    @Size(max = 1000, message = "Las notas no pueden exceder 1000 caracteres")
    private String notas;

    @Min(value = 1, message = "El número de personas debe ser al menos 1")
    private Integer numPersonas;

    private EstadoReserva estado;
}
