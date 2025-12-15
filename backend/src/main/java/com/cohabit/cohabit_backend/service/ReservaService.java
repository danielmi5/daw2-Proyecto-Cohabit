package com.cohabit.cohabit_backend.service;

import com.cohabit.cohabit_backend.dto.ReservaRequestDTO;
import com.cohabit.cohabit_backend.dto.ReservaResponseDTO;
import com.cohabit.cohabit_backend.entity.EstadoReserva;
import com.cohabit.cohabit_backend.entity.MiembroGrupo;
import com.cohabit.cohabit_backend.entity.Recurso;
import com.cohabit.cohabit_backend.entity.Reserva;
import com.cohabit.cohabit_backend.exception.EntidadNoEncontradaException;
import com.cohabit.cohabit_backend.exception.ParametroNuloException;
import com.cohabit.cohabit_backend.mapper.ReservaMapper;
import com.cohabit.cohabit_backend.repository.MiembroGrupoRepository;
import com.cohabit.cohabit_backend.repository.ReservaRepository;
import com.cohabit.cohabit_backend.repository.RecursoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.time.LocalDate;
import java.util.List;

@Service
public class ReservaService {

    private final ReservaRepository reservaRepo;
    private final RecursoRepository recursoRepo;
    private final MiembroGrupoRepository miembroRepo;

    // límite ejemplo: número máximo de reservas activas por miembro
    

    public ReservaService(ReservaRepository reservaRepo, RecursoRepository recursoRepo, MiembroGrupoRepository miembroRepo) {
        this.reservaRepo = reservaRepo;
        this.recursoRepo = recursoRepo;
        this.miembroRepo = miembroRepo;
    }

    public Page<ReservaResponseDTO> buscarPorFiltros(Long recursoId, Long usuarioId, LocalDate fecha, EstadoReserva estado, Pageable pageable) {
        var pagina = reservaRepo.findByFilters(recursoId, usuarioId, fecha, estado, pageable);
        List<ReservaResponseDTO> dtos = pagina.getContent().stream().map(ReservaMapper::reservaEntidadAReservaDto).toList();
        return new PageImpl<>(dtos, pageable, pagina.getTotalElements());
    }

    public ReservaResponseDTO obtenerPorId(Long id) {
        Reserva reserva = reservaRepo.findById(id).orElseThrow(() -> new EntidadNoEncontradaException("Reserva no encontrada: " + id));
        return ReservaMapper.reservaEntidadAReservaDto(reserva);
    }

    public Page<ReservaResponseDTO> obtenerTodos(Pageable pageable) {
        var paginaReservas = reservaRepo.findAll(pageable);
        List<ReservaResponseDTO> dtos = paginaReservas.getContent().stream().map(reservaEntidad -> ReservaMapper.reservaEntidadAReservaDto(reservaEntidad)).toList();
        return new PageImpl<>(dtos, pageable, paginaReservas.getTotalElements());
    }

    @Transactional
    public ReservaResponseDTO crear(ReservaRequestDTO dto) {
        if (dto == null) throw new ParametroNuloException("ReservaRequestDTO es null");
        MiembroGrupo miembro = miembroRepo.findById(dto.getMiembroGrupoId()).orElseThrow(() -> new EntidadNoEncontradaException("Miembro no encontrado: " + dto.getMiembroGrupoId()));
        Recurso recurso = recursoRepo.findById(dto.getRecursoId()).orElseThrow(() -> new EntidadNoEncontradaException("Recurso no encontrado: " + dto.getRecursoId()));

        if (!miembro.isActivo()) {
            throw new IllegalStateException("Miembro no activo no puede crear reservas");
        }

        LocalDate fechaReserva = dto.getFecha();
        LocalTime horaInicio = dto.getHoraInicio();
        LocalTime horaFin = dto.getHoraFin();
        // validar usando id del recurso (evita cargas innecesarias de la entidad)
        validarHorarioReserva(fechaReserva, horaInicio, horaFin, recurso.getId(), null);

        Reserva entidad = ReservaMapper.reservaRequestAReservaEntidad(dto, miembro, recurso);
        Reserva reservaGuardada = reservaRepo.save(entidad);
        return ReservaMapper.reservaEntidadAReservaDto(reservaGuardada);
    }

    @Transactional
    public ReservaResponseDTO actualizar(Long id, ReservaRequestDTO dto) {
        Reserva reservaExistente = reservaRepo.findById(id).orElseThrow(() -> new EntidadNoEncontradaException("Reserva no encontrada: " + id));
        
        // Valores a validar (si no vienen en DTO, usar existentes)
        LocalDate fechaReservaValidar = dto.getFecha() != null ? dto.getFecha() : reservaExistente.getFecha();
        LocalTime horaInicioValidar = dto.getHoraInicio() != null ? dto.getHoraInicio() : reservaExistente.getHoraInicio();
        LocalTime horaFinValidar = dto.getHoraFin() != null ? dto.getHoraFin() : reservaExistente.getHoraFin();
        Long idRecursoExistente = reservaExistente.getRecurso() != null ? reservaExistente.getRecurso().getId() : null;
        Long idRecursoValidar = dto.getRecursoId() != null ? dto.getRecursoId() : idRecursoExistente;

        // valida el horario excluyendo la propia reserva existente, usando id del recurso
        validarHorarioReserva(fechaReservaValidar, horaInicioValidar, horaFinValidar, idRecursoValidar, reservaExistente.getId());

        if (dto.getFecha() != null) reservaExistente.setFecha(dto.getFecha());
        if (dto.getHoraInicio() != null) reservaExistente.setHoraInicio(dto.getHoraInicio());
        if (dto.getHoraFin() != null) reservaExistente.setHoraFin(dto.getHoraFin());
        if (dto.getNotas() != null) reservaExistente.setNotas(dto.getNotas());
        if (dto.getNumPersonas() != null) reservaExistente.setNumPersonas(dto.getNumPersonas());
        if (dto.getEstado() != null) reservaExistente.setEstado(dto.getEstado());
        if (dto.getRecursoId() != null && !dto.getRecursoId().equals(idRecursoExistente)) {
            Recurso nuevoRecurso = recursoRepo.findById(idRecursoValidar).orElseThrow(() -> new EntidadNoEncontradaException("Recurso no encontrado: " + idRecursoValidar));
            reservaExistente.setRecurso(nuevoRecurso);
        }
        Reserva reservaGuardada = reservaRepo.save(reservaExistente);
        return ReservaMapper.reservaEntidadAReservaDto(reservaGuardada);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!reservaRepo.existsById(id)) throw new EntidadNoEncontradaException("Reserva no encontrada: " + id);
        reservaRepo.deleteById(id);
    }

    /**
     * Valida que el intervalo de horario para una reserva no coincida con otras reservas activas
     * del mismo recurso en la misma fecha. Lanza IllegalArgumentException o IllegalStateException
     * según el caso.
     *
     * @param fecha fecha de la reserva
     * @param inicio hora de inicio
     * @param fin hora de fin
     * @param recurso recurso sobre el que se reserva
     * @param idExcluir id de una reserva a excluir al actualizar, puede ser null
     */
    private void validarHorarioReserva(LocalDate fechaReserva, LocalTime horaInicio, LocalTime horaFin, Long idRecurso, Long idReservaExcluir) {
        if (fechaReserva == null || horaInicio == null || horaFin == null) {
            throw new ParametroNuloException("Fecha y horario son obligatorios");
        }
        if (!horaInicio.isBefore(horaFin)) {
            throw new ParametroNuloException("La hora de inicio debe ser anterior a la hora de fin");
        }

        if (idRecurso == null) {
            throw new ParametroNuloException("El recurso asociado a la reserva es obligatorio");
        }

        // Se obtienen reservas activas (estado distinto de CANCELADA) para el mismo recurso y fecha
        var reservasActivas = reservaRepo.findByRecursoIdAndFechaAndEstadoNot(idRecurso, fechaReserva, EstadoReserva.CANCELADA);
        for (Reserva reservaAComparar : reservasActivas) {
            if (idReservaExcluir != null && reservaAComparar.getId() != null && reservaAComparar.getId().equals(idReservaExcluir)) continue;
            LocalTime horaInicioExistente = reservaAComparar.getHoraInicio();
            LocalTime horaFinExistente = reservaAComparar.getHoraFin();
            boolean coinciden = horaInicio.isBefore(horaFinExistente) && horaFin.isAfter(horaInicioExistente);
            if (coinciden) {
                throw new IllegalStateException("El recurso ya está reservado en ese intervalo");
            }
        }
    }
}
