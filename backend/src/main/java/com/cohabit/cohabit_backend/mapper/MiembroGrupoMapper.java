package com.cohabit.cohabit_backend.mapper;

import com.cohabit.cohabit_backend.dto.MiembroGrupoRequestDTO;
import com.cohabit.cohabit_backend.dto.MiembroGrupoResponseDTO;
import com.cohabit.cohabit_backend.entity.Grupo;
import com.cohabit.cohabit_backend.entity.MiembroGrupo;
import com.cohabit.cohabit_backend.entity.Recurso;
import com.cohabit.cohabit_backend.entity.Reserva;
import com.cohabit.cohabit_backend.entity.Usuario;
 
import java.util.List;

public final class MiembroGrupoMapper {

    private MiembroGrupoMapper() {}

    public static MiembroGrupoResponseDTO miembroGrupoEntidadAMiembroGrupoDto(MiembroGrupo miembroGrupo) {
        if (miembroGrupo == null) {
            return null;
        }

        return MiembroGrupoResponseDTO.builder()
                .id(miembroGrupo.getId())
                .usuarioId(miembroGrupo.getUsuario() != null ? miembroGrupo.getUsuario().getId() : null)
                .grupoId(miembroGrupo.getGrupo() != null ? miembroGrupo.getGrupo().getId() : null)
                .rol(miembroGrupo.getRol())
                .fechaUnion(miembroGrupo.getFechaUnion())
                .recursosIds(miembroGrupo.getRecursos() != null ? miembroGrupo.getRecursos().stream().map(Recurso::getId).toList() : List.of())
                .reservasIds(miembroGrupo.getReservas() != null ? miembroGrupo.getReservas().stream().map(Reserva::getId).toList() : List.of())
                .activo(miembroGrupo.isActivo())
                .build();
    }


    public static MiembroGrupo miembroGrupoRequestAMiembroGrupoEntidad(MiembroGrupoRequestDTO miembroGrupoRequestDTO,  Usuario usuario, Grupo grupo) {
        if (miembroGrupoRequestDTO == null) {
            return null;
        }

        return MiembroGrupo.builder()
                .usuario(usuario)
                .grupo(grupo)
                .rol(miembroGrupoRequestDTO.getRol())
                .activo(miembroGrupoRequestDTO.isActivo())
                .build();
    }

}

