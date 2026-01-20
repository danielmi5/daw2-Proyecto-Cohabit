package com.cohabit.cohabit_backend.service;

import com.cohabit.cohabit_backend.dto.RecursoRequestDTO;
import com.cohabit.cohabit_backend.dto.RecursoUpdateDTO;
import com.cohabit.cohabit_backend.dto.RecursoResponseDTO;
import com.cohabit.cohabit_backend.entity.MiembroGrupo;
import com.cohabit.cohabit_backend.entity.Grupo;
import com.cohabit.cohabit_backend.entity.Recurso;
import com.cohabit.cohabit_backend.exception.EntidadNoEncontradaException;
import com.cohabit.cohabit_backend.exception.ParametroNuloException;
import com.cohabit.cohabit_backend.mapper.RecursoMapper;
import com.cohabit.cohabit_backend.repository.MiembroGrupoRepository;
import com.cohabit.cohabit_backend.repository.RecursoRepository;
import com.cohabit.cohabit_backend.repository.GrupoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.time.LocalDate;
import java.time.LocalTime;
import com.cohabit.cohabit_backend.entity.TipoRecurso;
import com.cohabit.cohabit_backend.entity.EstadoRecurso;

@Service
public class RecursoService {

    private final RecursoRepository recursoRepo;
    private final GrupoRepository grupoRepo;
    private final MiembroGrupoRepository miembroRepo;

    public RecursoService(RecursoRepository recursoRepo, GrupoRepository grupoRepo, MiembroGrupoRepository miembroRepo) {
        this.recursoRepo = recursoRepo;
        this.grupoRepo = grupoRepo;
        this.miembroRepo = miembroRepo;
    }

    @Transactional(readOnly = true)
    public RecursoResponseDTO obtenerPorId(Long id) {
        Recurso recurso = recursoRepo.findById(id).orElseThrow(() -> new EntidadNoEncontradaException("Recurso no encontrado: " + id));
        return RecursoMapper.recursoEntidadARecursoDto(recurso);
    }

    public Page<RecursoResponseDTO> obtenerTodos(Pageable pageable) {
        var paginaRecursos = recursoRepo.findAll(pageable);
        List<RecursoResponseDTO> dtos = paginaRecursos.getContent().stream().map(recursoEntidad -> RecursoMapper.recursoEntidadARecursoDto(recursoEntidad)).toList();
        return new PageImpl<>(dtos, pageable, paginaRecursos.getTotalElements());
    }

    @Transactional
    public RecursoResponseDTO crear(RecursoRequestDTO dto) {
        if (dto == null) throw new ParametroNuloException("RecursoRequestDTO es null");
        // Obtiene y bloquea la fila del Grupo para evitar concurrencia durante la asignación del número local (SELECT MAX + PESSIMISTIC_WRITE).
        Grupo grupo = grupoRepo.findByIdWithLock(dto.getGrupoId()).orElseThrow(() -> new EntidadNoEncontradaException("Grupo no encontrado: " + dto.getGrupoId()));
        MiembroGrupo creador = null;
        if (dto.getCreadorId() != null) {
            creador = miembroRepo.findById(dto.getCreadorId()).orElseThrow(() -> new EntidadNoEncontradaException("Miembro creador no encontrado: " + dto.getCreadorId()));
            // Valida que el miembro creador pertenece al grupo indicado
            if (creador.getGrupo() == null || !creador.getGrupo().getId().equals(grupo.getId())) {
                throw new EntidadNoEncontradaException("El miembro especificado no pertenece al grupo: " + dto.getGrupoId());
            }
        }

        if (dto.getCapacidad() != null && dto.getCapacidad() < 1) {
            throw new ParametroNuloException("La capacidad debe ser al menos 1");
        }

        Recurso entidad = RecursoMapper.recursoRequestARecursoEntidad(dto, grupo, creador);

        // Asigna número local para la regla dentro del recurso: MAX(numero) + 1
        Integer maxNumero = recursoRepo.findMaxNumeroByGrupoId(grupo.getId());
        entidad.setNumero(maxNumero + 1);

        Recurso recursoGuardado = recursoRepo.save(entidad);
        return RecursoMapper.recursoEntidadARecursoDto(recursoGuardado);
    }

    @Transactional
    public RecursoResponseDTO actualizar(Long id, RecursoUpdateDTO dto) {
        if (dto == null) throw new ParametroNuloException("RecursoUpdateDTO es nulo");
        Recurso recursoExistente = recursoRepo.findById(id).orElseThrow(() -> new EntidadNoEncontradaException("Recurso no encontrado: " + id));

        if (dto.getNombre() != null) recursoExistente.setNombre(dto.getNombre());
        if (dto.getDescripcion() != null) recursoExistente.setDescripcion(dto.getDescripcion());
        if (dto.getFotoRecurso() != null) recursoExistente.setFotoRecurso(dto.getFotoRecurso());
        if (dto.getCapacidad() != null) {
            if (dto.getCapacidad() < 1) throw new ParametroNuloException("La capacidad debe ser al menos 1");
            recursoExistente.setCapacidad(dto.getCapacidad());
        }
        if (dto.getUbicacion() != null) recursoExistente.setUbicacion(dto.getUbicacion());
        if (dto.getTipo() != null) recursoExistente.setTipo(dto.getTipo());
        if (dto.getEstadoActual() != null) recursoExistente.setEstadoActual(dto.getEstadoActual());

        Recurso recursoGuardado = recursoRepo.save(recursoExistente);
        return RecursoMapper.recursoEntidadARecursoDto(recursoGuardado);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!recursoRepo.existsById(id)) throw new EntidadNoEncontradaException("Recurso no encontrado: " + id);
        recursoRepo.deleteById(id);
    }

    

    public Page<RecursoResponseDTO> buscarPorFiltros(Long grupoId, TipoRecurso tipo, EstadoRecurso estado, LocalDate fecha, LocalTime horaInicio, LocalTime horaFin, Pageable pageable) {
        var pagina = recursoRepo.findByFilters(grupoId, tipo, estado, fecha, horaInicio, horaFin, pageable);
        List<RecursoResponseDTO> dtos = pagina.getContent().stream().map(RecursoMapper::recursoEntidadARecursoDto).toList();
        return new PageImpl<>(dtos, pageable, pagina.getTotalElements());
    }
}
