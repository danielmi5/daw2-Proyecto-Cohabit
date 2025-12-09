package com.cohabit.cohabit_backend.service;

import com.cohabit.cohabit_backend.dto.GrupoRequestDTO;
import com.cohabit.cohabit_backend.dto.GrupoResponseDTO;
import com.cohabit.cohabit_backend.entity.Grupo;
import com.cohabit.cohabit_backend.exception.EntidadNoEncontradaException;
import com.cohabit.cohabit_backend.exception.ParametroNuloException;
import com.cohabit.cohabit_backend.mapper.GrupoMapper;
import com.cohabit.cohabit_backend.repository.GrupoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class GrupoService {

    private final GrupoRepository grupoRepository;

    public GrupoService(GrupoRepository grupoRepository) {
        this.grupoRepository = grupoRepository;
    }

    public GrupoResponseDTO obtenerPorId(Long id) {
        Grupo grupo = grupoRepository.findById(id)
                .orElseThrow(() -> new EntidadNoEncontradaException("Grupo no encontrado: " + id));
        return GrupoMapper.grupoEntidadAGrupoDto(grupo);
    }

    public Page<GrupoResponseDTO> obtenerTodos(Pageable pageable) {
        var paginaGrupos = grupoRepository.findAll(pageable);
        List<GrupoResponseDTO> dtos = paginaGrupos.getContent().stream().map(grupoEntidad -> GrupoMapper.grupoEntidadAGrupoDto(grupoEntidad)).toList();
        return new PageImpl<>(dtos, pageable, paginaGrupos.getTotalElements());
    }

    @Transactional
    public GrupoResponseDTO crear(GrupoRequestDTO dto) {
        if (dto == null) throw new ParametroNuloException("GrupoRequestDTO es null");

        Grupo entidad = GrupoMapper.grupoRequestAGrupoEntidad(dto);
        // Genera el código
        if (entidad.getCodigoInvitacion() == null || entidad.getCodigoInvitacion().isBlank()) {
            String codigoGenerado = generarCodigoInvitacionUnico(8);
            entidad.setCodigoInvitacion(codigoGenerado);
        }
        Grupo grupoGuardado = grupoRepository.save(entidad);
        return GrupoMapper.grupoEntidadAGrupoDto(grupoGuardado);
    }

    @Transactional
    public GrupoResponseDTO actualizar(Long id, GrupoRequestDTO dto) {
        Grupo grupoExistente = grupoRepository.findById(id)
                .orElseThrow(() -> new EntidadNoEncontradaException("Grupo no encontrado: " + id));


        if (dto.getNombre() != null) grupoExistente.setNombre(dto.getNombre());
        if (dto.getDireccion() != null) grupoExistente.setDireccion(dto.getDireccion());
        if (dto.getDescripcion() != null) grupoExistente.setDescripcion(dto.getDescripcion());
        if (dto.getFotoGrupo() != null) grupoExistente.setFotoGrupo(dto.getFotoGrupo());

        Grupo grupoGuardado = grupoRepository.save(grupoExistente);
        return GrupoMapper.grupoEntidadAGrupoDto(grupoGuardado);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!grupoRepository.existsById(id)) {
            throw new EntidadNoEncontradaException("Grupo no encontrado: " + id);
        }
        grupoRepository.deleteById(id);
    }

    /**
     * Genera un código de invitación único comprobado contra la base de datos.
     * @param intentosMaximos número máximo de intentos antes de lanzar excepción
     * @return código único
     */
    private String generarCodigoInvitacionUnico(int intentosMaximos) {
        if (intentosMaximos < 1) intentosMaximos = 8;
        String codigo;
        int contadorIntentos = 0;
        do {
            codigo = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
            contadorIntentos++;
            if (contadorIntentos > intentosMaximos) {
                throw new IllegalStateException("No se ha podido generar un código de invitación único tras " + intentosMaximos + " intentos");
            }
        } while (grupoRepository.existsByCodigoInvitacion(codigo));
        return codigo;
    }
}
