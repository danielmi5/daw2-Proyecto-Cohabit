package com.cohabit.cohabit_backend.mapper;

import com.cohabit.cohabit_backend.dto.ReservaRequestDTO;
import com.cohabit.cohabit_backend.dto.ReservaResponseDTO;
import com.cohabit.cohabit_backend.entity.MiembroGrupo;
import com.cohabit.cohabit_backend.entity.Recurso;
import com.cohabit.cohabit_backend.entity.Reserva;
 
public final class ReservaMapper {

    private ReservaMapper() {}

    public static ReservaResponseDTO reservaEntidadAReservaDto(Reserva reserva) {
        if (reserva == null) {
            return null;
        }

        return ReservaResponseDTO.builder()
                .id(reserva.getId())
                .fecha(reserva.getFecha())
                .horaInicio(reserva.getHoraInicio())
                .horaFin(reserva.getHoraFin())
                .notas(reserva.getNotas())
                .numPersonas(reserva.getNumPersonas())
                .estado(reserva.getEstado())
                .miembroGrupoId(reserva.getMiembroGrupo() != null ? reserva.getMiembroGrupo().getId() : null)
                .recursoId(reserva.getRecurso() != null ? reserva.getRecurso().getId() : null)
                .numero(reserva.getNumero())
                .fechaCreacion(reserva.getFechaCreacion())
                .fechaActualizacion(reserva.getFechaActualizacion())
                .build();
    }

    public static Reserva reservaRequestAReservaEntidad(ReservaRequestDTO reservaRequestDTO, MiembroGrupo miembroGrupo, Recurso recurso) {
        if (reservaRequestDTO == null) {
            return null;
        }

        return Reserva.builder()
                .fecha(reservaRequestDTO.getFecha())
                .horaInicio(reservaRequestDTO.getHoraInicio())
                .horaFin(reservaRequestDTO.getHoraFin())
                .notas(reservaRequestDTO.getNotas())
                .numPersonas(reservaRequestDTO.getNumPersonas())
                .estado(reservaRequestDTO.getEstado())
                .miembroGrupo(miembroGrupo)
                .recurso(recurso)
                .build();
    }
}
