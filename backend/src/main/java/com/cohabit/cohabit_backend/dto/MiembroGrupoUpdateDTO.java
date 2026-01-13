package com.cohabit.cohabit_backend.dto;

import com.cohabit.cohabit_backend.entity.RolGrupo;
import lombok.*;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Campos para actualizar un miembro de grupo (opcionales)")
public class MiembroGrupoUpdateDTO {
    @Schema(description = "Nuevo rol del miembro", example = "MEMBER")
    private RolGrupo rol;
    @Schema(description = "Indica si el miembro está activo")
    private Boolean activo;
}
