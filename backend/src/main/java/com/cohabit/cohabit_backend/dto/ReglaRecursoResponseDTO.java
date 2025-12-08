package com.cohabit.cohabit_backend.dto;

import com.cohabit.cohabit_backend.entity.TipoRegla;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReglaRecursoResponseDTO {
    private Long id;
    private TipoRegla tipoRegla;
    private String valor;
    private String descripcion;
    private Long recursoId;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
}
