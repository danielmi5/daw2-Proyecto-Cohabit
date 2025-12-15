package com.cohabit.cohabit_backend.dto;

import com.cohabit.cohabit_backend.entity.TipoRegla;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReglaRecursoUpdateDTO {
    private TipoRegla tipoRegla;

    @Size(max = 255, message = "El valor no puede exceder 255 caracteres")
    private String valor;

    @Size(max = 1000, message = "La descripción no puede exceder 1000 caracteres")
    private String descripcion;
}
