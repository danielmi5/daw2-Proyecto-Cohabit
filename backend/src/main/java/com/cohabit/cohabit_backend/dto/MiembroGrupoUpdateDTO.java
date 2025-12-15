package com.cohabit.cohabit_backend.dto;

import com.cohabit.cohabit_backend.entity.RolGrupo;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MiembroGrupoUpdateDTO {
    private RolGrupo rol;
    private Boolean activo;
}
