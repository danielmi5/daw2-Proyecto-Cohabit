package com.cohabit.cohabit_backend.dto;

import com.cohabit.cohabit_backend.entity.EstadoReserva;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservaRequestDTO {
    
    @NotNull(message = "La fecha es obligatoria")
    private LocalDate fecha;
    
    @NotNull(message = "La hora de inicio es obligatoria")
    private LocalTime horaInicio;
    
    @NotNull(message = "La hora de fin es obligatoria")
    private LocalTime horaFin;
    
    @Size(max = 1000, message = "Las notas no pueden exceder 1000 caracteres")
    private String notas;
    
    @Min(value = 1, message = "El número de personas debe ser al menos 1")
    private Integer numPersonas;
    
    @NotNull(message = "El estado de la reserva es obligatorio")
    private EstadoReserva estado;
    
    @NotNull(message = "El ID del miembro del grupo es obligatorio")
    private Long miembroGrupoId;
    
    @NotNull(message = "El ID del recurso es obligatorio")
    private Long recursoId;
}
