package com.cohabit.cohabit_backend.dto;

import com.cohabit.cohabit_backend.entity.EstadoRecurso;
import com.cohabit.cohabit_backend.entity.TipoRecurso;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.*;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Campos para actualizar un recurso (opcionales)")
public class RecursoUpdateDTO {
    @Size(max = 255, message = "El nombre no puede exceder 255 caracteres")
    @Schema(description = "Nombre del recurso", example = "nombre")
    private String nombre;

    @Size(max = 1000, message = "La descripción no puede exceder 1000 caracteres")
    @Schema(description = "Descripción del recurso")
    private String descripcion;

    @Schema(description = "URL de la foto del recurso")
    private String fotoRecurso;

    @Min(value = 1, message = "La capacidad debe ser al menos 1")
    @Schema(description = "Capacidad del recurso", example = "4")
    private Integer capacidad;

    @Size(max = 255, message = "La ubicación no puede exceder 255 caracteres")
    @Schema(description = "Ubicación dentro del grupo")
    private String ubicacion;

    @Schema(description = "Tipo de recurso")
    private TipoRecurso tipo;

    @Schema(description = "Estado actual del recurso")
    private EstadoRecurso estadoActual;

    
}
