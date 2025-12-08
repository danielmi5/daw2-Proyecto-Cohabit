package com.cohabit.cohabit_backend.mapper;

import com.cohabit.cohabit_backend.dto.GrupoRequestDTO;
import com.cohabit.cohabit_backend.dto.GrupoResponseDTO;
import com.cohabit.cohabit_backend.entity.Grupo;
import com.cohabit.cohabit_backend.entity.MiembroGrupo;
import com.cohabit.cohabit_backend.entity.Recurso;
 
import java.util.List;

public final class GrupoMapper {

    private GrupoMapper() {}

    public static GrupoResponseDTO grupoEntidadAGrupoDto(Grupo grupo) {
        if (grupo == null) {
            return null;
        }

        return GrupoResponseDTO.builder()
                .id(grupo.getId())
                .nombre(grupo.getNombre())
                .direccion(grupo.getDireccion())
                .descripcion(grupo.getDescripcion())
                .fotoGrupo(grupo.getFotoGrupo())
                .codigoInvitacion(grupo.getCodigoInvitacion())
                .fechaCreacion(grupo.getFechaCreacion())
                .fechaActualizacion(grupo.getFechaActualizacion())
                .miembrosIds(grupo.getMiembros() != null ? grupo.getMiembros().stream().map(MiembroGrupo::getId).toList() : List.of())
                .recursosIds(grupo.getRecursos() != null ? grupo.getRecursos().stream().map(Recurso::getId).toList() : List.of())
                .build();
    }

    public static Grupo grupoRequestAGrupoEntidad(GrupoRequestDTO grupoRequestDTO) {
        if (grupoRequestDTO == null) {
            return null;
        }

        return Grupo.builder()
                .nombre(grupoRequestDTO.getNombre())
                .direccion(grupoRequestDTO.getDireccion())
                .descripcion(grupoRequestDTO.getDescripcion())
                .fotoGrupo(grupoRequestDTO.getFotoGrupo())
                .build();
    }
}

