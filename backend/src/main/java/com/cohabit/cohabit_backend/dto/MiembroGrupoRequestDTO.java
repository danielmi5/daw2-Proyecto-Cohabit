package com.cohabit.cohabit_backend.dto;

import com.cohabit.cohabit_backend.entity.RolGrupo;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Datos para añadir un miembro a un grupo")
public class MiembroGrupoRequestDTO {
    
    @NotNull(message = "El ID del usuario es obligatorio")
    @Schema(description = "ID del usuario", required = true, example = "1")
    private Long usuarioId;
    
    @NotNull(message = "El ID del grupo es obligatorio")
    @Schema(description = "ID del grupo", required = true, example = "1")
    private Long grupoId;
    
    @Schema(description = "Rol dentro del grupo", example = "ROL")
    private RolGrupo rol;
    
    @Schema(description = "Indica si el miembro está activo")
    private boolean activo;
}
