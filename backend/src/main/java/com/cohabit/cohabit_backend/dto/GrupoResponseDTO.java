package com.cohabit.cohabit_backend.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GrupoResponseDTO {
    private Long id;
    private String nombre;
    private String direccion;
    private String descripcion;
    private String fotoGrupo;
    private String codigoInvitacion;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
    private List<Long> miembrosIds;
    private List<Long> recursosIds;
    private Long creadorId;
}
