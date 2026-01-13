package com.cohabit.cohabit_backend.dto;

import com.cohabit.cohabit_backend.entity.EstadoRecurso;
import com.cohabit.cohabit_backend.entity.TipoRecurso;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Datos para crear o actualizar un recurso")
public class RecursoRequestDTO {
    
    @NotBlank(message = "El nombre del recurso es obligatorio")
    @Size(max = 255, message = "El nombre no puede exceder 255 caracteres")
    @Schema(description = "Nombre del recurso", example = "nombre", required = true)
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
    
    @NotNull(message = "El tipo de recurso es obligatorio")
    @Schema(description = "Tipo de recurso", required = true, example = "SALA")
    private TipoRecurso tipo;
    
    @NotNull(message = "El estado del recurso es obligatorio")
    @Schema(description = "Estado actual del recurso", required = true, example = "DISPONIBLE")
    private EstadoRecurso estadoActual;
    
    @NotNull(message = "El ID del grupo es obligatorio")
    @Schema(description = "ID del grupo al que pertenece el recurso", required = true, example = "3")
    private Long grupoId;
    
    @NotNull(message = "El ID del creador es obligatorio")
    @Schema(description = "ID del usuario creador del recurso", required = true)
    private Long creadorId;
}
