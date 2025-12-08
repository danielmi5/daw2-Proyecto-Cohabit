package com.cohabit.cohabit_backend.mapper;

import com.cohabit.cohabit_backend.dto.ReglaRecursoRequestDTO;
import com.cohabit.cohabit_backend.dto.ReglaRecursoResponseDTO;
import com.cohabit.cohabit_backend.entity.Recurso;
import com.cohabit.cohabit_backend.entity.ReglaRecurso;
 
public final class ReglaRecursoMapper {

    private ReglaRecursoMapper() {}


    public static ReglaRecursoResponseDTO reglaRecursoEntidadAReglaRecursoDto(ReglaRecurso reglaRecurso) {
        if (reglaRecurso == null) {
            return null;
        }

        return ReglaRecursoResponseDTO.builder()
            .id(reglaRecurso.getId())
            .tipoRegla(reglaRecurso.getTipoRegla())
            .valor(reglaRecurso.getValor())
            .descripcion(reglaRecurso.getDescripcion())
            .recursoId(reglaRecurso.getRecurso() != null ? reglaRecurso.getRecurso().getId() : null)
            .fechaCreacion(reglaRecurso.getFechaCreacion())
            .fechaActualizacion(reglaRecurso.getFechaActualizacion())
            .build();
    }

    public static ReglaRecurso reglaRecursoRequestAReglaRecursoEntidad(ReglaRecursoRequestDTO reglaRecursoRequestDTO, Recurso recurso) {
        if (reglaRecursoRequestDTO == null) {
            return null;
        }

        return ReglaRecurso.builder()
                .tipoRegla(reglaRecursoRequestDTO.getTipoRegla())
                .valor(reglaRecursoRequestDTO.getValor())
                .descripcion(reglaRecursoRequestDTO.getDescripcion())
                .recurso(recurso)
                .build();
    }
}
