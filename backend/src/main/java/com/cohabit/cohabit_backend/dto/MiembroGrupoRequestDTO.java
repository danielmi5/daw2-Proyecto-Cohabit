package com.cohabit.cohabit_backend.dto;

import com.cohabit.cohabit_backend.entity.RolGrupo;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MiembroGrupoRequestDTO {
    
    @NotNull(message = "El ID del usuario es obligatorio")
    private Long usuarioId;
    
    @NotNull(message = "El ID del grupo es obligatorio")
    private Long grupoId;
    
    @NotNull(message = "El rol es obligatorio")
    private RolGrupo rol;
    
    private boolean activo;
}
