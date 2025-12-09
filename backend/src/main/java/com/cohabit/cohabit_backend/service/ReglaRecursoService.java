package com.cohabit.cohabit_backend.service;

import com.cohabit.cohabit_backend.dto.ReglaRecursoRequestDTO;
import com.cohabit.cohabit_backend.dto.ReglaRecursoResponseDTO;
import com.cohabit.cohabit_backend.entity.Recurso;
import com.cohabit.cohabit_backend.entity.ReglaRecurso;
import com.cohabit.cohabit_backend.exception.EntidadNoEncontradaException;
import com.cohabit.cohabit_backend.exception.ParametroNuloException;
import com.cohabit.cohabit_backend.mapper.ReglaRecursoMapper;
import com.cohabit.cohabit_backend.repository.RecursoRepository;
import com.cohabit.cohabit_backend.repository.ReglaRecursoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReglaRecursoService {

    private final ReglaRecursoRepository reglaRepo;
    private final RecursoRepository recursoRepo;

    public ReglaRecursoService(ReglaRecursoRepository reglaRepo, RecursoRepository recursoRepo) {
        this.reglaRepo = reglaRepo;
        this.recursoRepo = recursoRepo;
    }

    public ReglaRecursoResponseDTO obtenerPorId(Long id) {
        ReglaRecurso reglaRecurso = reglaRepo.findById(id).orElseThrow(() -> new EntidadNoEncontradaException("Regla no encontrada: " + id));
        return ReglaRecursoMapper.reglaRecursoEntidadAReglaRecursoDto(reglaRecurso);
    }

    public Page<ReglaRecursoResponseDTO> obtenerTodos(Pageable pageable) {
        var paginaReglas = reglaRepo.findAll(pageable);
        List<ReglaRecursoResponseDTO> dtos = paginaReglas.getContent().stream().map(reglaEntidad -> ReglaRecursoMapper.reglaRecursoEntidadAReglaRecursoDto(reglaEntidad)).toList();
        return new PageImpl<>(dtos, pageable, paginaReglas.getTotalElements());
    }

    @Transactional
    public ReglaRecursoResponseDTO crear(ReglaRecursoRequestDTO dto) {
        if (dto == null) throw new ParametroNuloException("ReglaRecursoRequestDTO es null");
        Recurso recurso = recursoRepo.findById(dto.getRecursoId()).orElseThrow(() -> new EntidadNoEncontradaException("Recurso no encontrado: " + dto.getRecursoId()));
        ReglaRecurso entidad = ReglaRecursoMapper.reglaRecursoRequestAReglaRecursoEntidad(dto, recurso);
        ReglaRecurso reglaGuardada = reglaRepo.save(entidad);
        return ReglaRecursoMapper.reglaRecursoEntidadAReglaRecursoDto(reglaGuardada);
    }

    @Transactional
    public ReglaRecursoResponseDTO actualizar(Long id, ReglaRecursoRequestDTO dto) {
        ReglaRecurso reglaExistente = reglaRepo.findById(id).orElseThrow(() -> new EntidadNoEncontradaException("Regla no encontrada: " + id));
        if (dto.getTipoRegla() != null) reglaExistente.setTipoRegla(dto.getTipoRegla());
        if (dto.getValor() != null) reglaExistente.setValor(dto.getValor());
        if (dto.getDescripcion() != null) reglaExistente.setDescripcion(dto.getDescripcion());
        ReglaRecurso reglaGuardada = reglaRepo.save(reglaExistente);
        return ReglaRecursoMapper.reglaRecursoEntidadAReglaRecursoDto(reglaGuardada);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!reglaRepo.existsById(id)) throw new EntidadNoEncontradaException("Regla no encontrada: " + id);
        reglaRepo.deleteById(id);
    }
}
