package com.cohabit.cohabit_backend.dto;

import com.cohabit.cohabit_backend.entity.TipoRegla;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReglaRecursoRequestDTO {
    
    @NotNull(message = "El tipo de regla es obligatorio")
    private TipoRegla tipoRegla;
    
    @NotBlank(message = "El valor de la regla es obligatorio")
    @Size(max = 255, message = "El valor no puede exceder 255 caracteres")
    private String valor;
    
    @Size(max = 1000, message = "La descripción no puede exceder 1000 caracteres")
    private String descripcion;
    
    @NotNull(message = "El ID del recurso es obligatorio")
    private Long recursoId;
}
