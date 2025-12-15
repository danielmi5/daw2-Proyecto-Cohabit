package com.cohabit.cohabit_backend.dto;

import com.cohabit.cohabit_backend.entity.EstadoRecurso;
import com.cohabit.cohabit_backend.entity.TipoRecurso;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecursoUpdateDTO {
    @Size(max = 255, message = "El nombre no puede exceder 255 caracteres")
    private String nombre;

    @Size(max = 1000, message = "La descripción no puede exceder 1000 caracteres")
    private String descripcion;

    private String fotoRecurso;

    @Min(value = 1, message = "La capacidad debe ser al menos 1")
    private Integer capacidad;

    @Size(max = 255, message = "La ubicación no puede exceder 255 caracteres")
    private String ubicacion;

    private TipoRecurso tipo;

    private EstadoRecurso estadoActual;

    
}
