package com.cohabit.cohabit_backend.dto;

import com.cohabit.cohabit_backend.entity.RolGrupo;
import lombok.*;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Información de un miembro de grupo")
public class MiembroGrupoResponseDTO {
    @Schema(description = "Identificador del miembro", example = "1")
    private Long id;

    @Schema(description = "ID del usuario asociado")
    private Long usuarioId;

    @Schema(description = "ID del grupo asociado")
    private Long grupoId;

    @Schema(description = "Rol del miembro en el grupo")
    private RolGrupo rol;

    @Schema(description = "Fecha de unión", format = "date-time")
    private LocalDateTime fechaUnion;

    @Schema(description = "IDs de recursos asociados")
    private List<Long> recursosIds;

    @Schema(description = "IDs de reservas realizadas")
    private List<Long> reservasIds;

    @Schema(description = "Indica si el miembro está activo")
    private boolean activo;
}
