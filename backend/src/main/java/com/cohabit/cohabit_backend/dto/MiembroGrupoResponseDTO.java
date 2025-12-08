package com.cohabit.cohabit_backend.dto;

import com.cohabit.cohabit_backend.entity.RolGrupo;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MiembroGrupoResponseDTO {
    private Long id;
    private Long usuarioId;
    private Long grupoId;
    private RolGrupo rol;
    private LocalDateTime fechaUnion;
    private List<Long> recursosIds;
    private List<Long> reservasIds;
    private boolean activo;
}
