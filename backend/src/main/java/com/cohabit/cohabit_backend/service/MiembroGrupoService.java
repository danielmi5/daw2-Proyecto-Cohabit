package com.cohabit.cohabit_backend.service;

import com.cohabit.cohabit_backend.dto.MiembroGrupoRequestDTO;
import com.cohabit.cohabit_backend.dto.MiembroGrupoResponseDTO;
import com.cohabit.cohabit_backend.entity.Grupo;
import com.cohabit.cohabit_backend.entity.MiembroGrupo;
import com.cohabit.cohabit_backend.entity.Usuario;
import com.cohabit.cohabit_backend.exception.EntidadNoEncontradaException;
import com.cohabit.cohabit_backend.exception.EntidadYaExisteException;
import com.cohabit.cohabit_backend.exception.ParametroNuloException;
import com.cohabit.cohabit_backend.mapper.MiembroGrupoMapper;
import com.cohabit.cohabit_backend.repository.GrupoRepository;
import com.cohabit.cohabit_backend.repository.MiembroGrupoRepository;
import com.cohabit.cohabit_backend.repository.UsuarioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MiembroGrupoService {

    private final MiembroGrupoRepository miembroRepo;
    private final GrupoRepository grupoRepo;
    private final UsuarioRepository usuarioRepo;

    public MiembroGrupoService(MiembroGrupoRepository miembroRepo, GrupoRepository grupoRepo, UsuarioRepository usuarioRepo) {
        this.miembroRepo = miembroRepo;
        this.grupoRepo = grupoRepo;
        this.usuarioRepo = usuarioRepo;
    }

    public MiembroGrupoResponseDTO obtenerPorId(Long id) {
        MiembroGrupo miembro = miembroRepo.findById(id).orElseThrow(() -> new EntidadNoEncontradaException("Miembro no encontrado: " + id));
        return MiembroGrupoMapper.miembroGrupoEntidadAMiembroGrupoDto(miembro);
    }

    public Page<MiembroGrupoResponseDTO> obtenerTodos(Pageable pageable) {
        var paginaMiembros = miembroRepo.findAll(pageable);
        List<MiembroGrupoResponseDTO> dtos = paginaMiembros.getContent().stream().map(miembroEntidad -> MiembroGrupoMapper.miembroGrupoEntidadAMiembroGrupoDto(miembroEntidad)).toList();
        return new PageImpl<>(dtos, pageable, paginaMiembros.getTotalElements());
    }

    @Transactional
    public MiembroGrupoResponseDTO crear(MiembroGrupoRequestDTO dto) {
        if (dto == null) throw new ParametroNuloException("MiembroGrupoRequestDTO es null");

        Grupo grupo = grupoRepo.findById(dto.getGrupoId()).orElseThrow(() -> new EntidadNoEncontradaException("Grupo no encontrado: " + dto.getGrupoId()));
        Usuario usuario = usuarioRepo.findById(dto.getUsuarioId()).orElseThrow(() -> new EntidadNoEncontradaException("Usuario no encontrado: " + dto.getUsuarioId()));

        if (miembroRepo.existsByUsuarioIdAndGrupoId(usuario.getId(), grupo.getId())) {
            throw new EntidadYaExisteException("El usuario ya es miembro de este grupo");
        }

        MiembroGrupo entidad = MiembroGrupoMapper.miembroGrupoRequestAMiembroGrupoEntidad(dto, usuario, grupo);
        MiembroGrupo miembroGuardado = miembroRepo.save(entidad);
        return MiembroGrupoMapper.miembroGrupoEntidadAMiembroGrupoDto(miembroGuardado);
    }

    @Transactional
    public MiembroGrupoResponseDTO actualizar(Long id, MiembroGrupoRequestDTO dto) {
        MiembroGrupo miembroExistente = miembroRepo.findById(id).orElseThrow(() -> new EntidadNoEncontradaException("Miembro no encontrado: " + id));

        if (dto.getRol() != null) miembroExistente.setRol(dto.getRol());
        miembroExistente.setActivo(dto.isActivo());
        
        MiembroGrupo miembroGuardado = miembroRepo.save(miembroExistente);
        return MiembroGrupoMapper.miembroGrupoEntidadAMiembroGrupoDto(miembroGuardado);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!miembroRepo.existsById(id)) throw new EntidadNoEncontradaException("Miembro no encontrado: " + id);
        miembroRepo.deleteById(id);
    }
}
