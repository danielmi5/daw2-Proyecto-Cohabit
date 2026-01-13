package com.cohabit.cohabit_backend.dto;

import com.cohabit.cohabit_backend.entity.EstadoReserva;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Datos para crear o actualizar una reserva")
public class ReservaRequestDTO {
    
    @NotNull(message = "La fecha es obligatoria")
    @Schema(description = "Fecha de la reserva", required = true, format = "date", example = "2026-01-20")
    private LocalDate fecha;
    
    @NotNull(message = "La hora de inicio es obligatoria")
    @Schema(description = "Hora de inicio", required = true, format = "time", example = "09:00:00")
    private LocalTime horaInicio;
    
    @NotNull(message = "La hora de fin es obligatoria")
    @Schema(description = "Hora de fin", required = true, format = "time", example = "10:00:00")
    private LocalTime horaFin;
    
    @Size(max = 1000, message = "Las notas no pueden exceder 1000 caracteres")
    @Schema(description = "Notas de la reserva (opcional)")
    private String notas;
    
    @Min(value = 1, message = "El número de personas debe ser al menos 1")
    @Schema(description = "Número de personas", example = "1")
    private Integer numPersonas;
    
    @NotNull(message = "El estado de la reserva es obligatorio")
    @Schema(description = "Estado de la reserva", required = true, example = "PENDIENTE")
    private EstadoReserva estado;
    
    @NotNull(message = "El ID del miembro del grupo es obligatorio")
    @Schema(description = "ID del miembro del grupo que realiza la reserva", required = true, example = "10")
    private Long miembroGrupoId;
    
    @NotNull(message = "El ID del recurso es obligatorio")
    @Schema(description = "ID del recurso a reservar", required = true, example = "5")
    private Long recursoId;
}
