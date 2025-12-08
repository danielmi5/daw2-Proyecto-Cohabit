package com.cohabit.cohabit_backend.dto;

import com.cohabit.cohabit_backend.entity.EstadoReserva;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservaResponseDTO {
    private Long id;
    private LocalDate fecha;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private String notas;
    private Integer numPersonas;
    private EstadoReserva estado;
    private Long miembroGrupoId;
    private Long recursoId;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
}
