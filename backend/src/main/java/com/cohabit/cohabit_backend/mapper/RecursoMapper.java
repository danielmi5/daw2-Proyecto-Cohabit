package com.cohabit.cohabit_backend.mapper;

import com.cohabit.cohabit_backend.dto.RecursoRequestDTO;
import com.cohabit.cohabit_backend.dto.RecursoResponseDTO;
import com.cohabit.cohabit_backend.entity.Grupo;
import com.cohabit.cohabit_backend.entity.MiembroGrupo;
import com.cohabit.cohabit_backend.entity.Recurso;
import com.cohabit.cohabit_backend.entity.ReglaRecurso;
import com.cohabit.cohabit_backend.entity.Reserva;
 
import java.util.List;

public final class RecursoMapper {

    private RecursoMapper() {}

    public static RecursoResponseDTO recursoEntidadARecursoDto(Recurso recurso) {
        if (recurso == null) {
            return null;
        }

        return RecursoResponseDTO.builder()
                .id(recurso.getId())
                .nombre(recurso.getNombre())
                .descripcion(recurso.getDescripcion())
                .fotoRecurso(recurso.getFotoRecurso())
                .capacidad(recurso.getCapacidad())
                .ubicacion(recurso.getUbicacion())
                .tipo(recurso.getTipo())
                .estadoActual(recurso.getEstadoActual())
                .grupoId(recurso.getGrupo() != null ? recurso.getGrupo().getId() : null)
                .numero(recurso.getNumero())
                .creadorId(recurso.getCreador() != null ? recurso.getCreador().getId() : null)
                .reservasIds(recurso.getReservas() != null ? recurso.getReservas().stream().map(Reserva::getId).toList() : List.of())
                .reglasIds(recurso.getReglas() != null ? recurso.getReglas().stream().map(ReglaRecurso::getId).toList() : List.of())
                .fechaCreacion(recurso.getFechaCreacion())
                .fechaActualizacion(recurso.getFechaActualizacion())
                .build();
    }

    public static Recurso recursoRequestARecursoEntidad(RecursoRequestDTO recursoRequestDTO, Grupo grupo, MiembroGrupo creador) {
        if (recursoRequestDTO == null) {
            return null;
        }

        return Recurso.builder()
                .nombre(recursoRequestDTO.getNombre())
                .descripcion(recursoRequestDTO.getDescripcion())
                .fotoRecurso(recursoRequestDTO.getFotoRecurso())
                .capacidad(recursoRequestDTO.getCapacidad())
                .ubicacion(recursoRequestDTO.getUbicacion())
                .tipo(recursoRequestDTO.getTipo())
                .estadoActual(recursoRequestDTO.getEstadoActual())
                .grupo(grupo)
                .creador(creador)
                .build();
    }
}
