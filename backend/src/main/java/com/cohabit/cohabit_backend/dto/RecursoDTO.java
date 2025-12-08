package com.cohabit.cohabit_backend.dto;

import com.cohabit.cohabit_backend.entity.EstadoRecurso;
import com.cohabit.cohabit_backend.entity.TipoRecurso;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecursoDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private String fotoRecurso;
    private Integer capacidad;
    private String ubicacion;
    private TipoRecurso tipo;
    private EstadoRecurso estadoActual;
    private Long grupoId;
    private Long creadorId;
    private List<Long> reservasIds;
    private List<Long> reglasIds;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
}
