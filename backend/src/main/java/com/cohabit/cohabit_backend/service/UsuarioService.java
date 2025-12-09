package com.cohabit.cohabit_backend.service;

import com.cohabit.cohabit_backend.dto.UsuarioRequestDTO;
import com.cohabit.cohabit_backend.dto.UsuarioResponseDTO;
import com.cohabit.cohabit_backend.entity.Usuario;
import com.cohabit.cohabit_backend.exception.EntidadNoEncontradaException;
import com.cohabit.cohabit_backend.exception.EntidadYaExisteException;
import com.cohabit.cohabit_backend.exception.ParametroNuloException;
import com.cohabit.cohabit_backend.mapper.UsuarioMapper;
import com.cohabit.cohabit_backend.repository.UsuarioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepo;

    public UsuarioService(UsuarioRepository usuarioRepo) {
        this.usuarioRepo = usuarioRepo;
    }

    public UsuarioResponseDTO obtenerPorId(Long id) {
        Usuario usuario = usuarioRepo.findById(id).orElseThrow(() -> new EntidadNoEncontradaException("Usuario no encontrado: " + id));
        return UsuarioMapper.usuarioEntidadAUsuarioDto(usuario);
    }

    public Page<UsuarioResponseDTO> obtenerTodos(Pageable pageable) {
        var paginaUsuarios = usuarioRepo.findAll(pageable);
        List<UsuarioResponseDTO> dtos = paginaUsuarios.getContent().stream().map(usuarioEntidad -> UsuarioMapper.usuarioEntidadAUsuarioDto(usuarioEntidad)).toList();
        return new PageImpl<>(dtos, pageable, paginaUsuarios.getTotalElements());
    }

    @Transactional
    public UsuarioResponseDTO crear(UsuarioRequestDTO dto) {
        if (dto == null) throw new ParametroNuloException("UsuarioRequestDTO es null");
        if (dto.getEmail() != null && usuarioRepo.existsByEmail(dto.getEmail())) {
            throw new EntidadYaExisteException("Email ya registrado");
        }
        Usuario entidad = UsuarioMapper.usuarioRequestAUsuarioEntidad(dto);
        Usuario saved = usuarioRepo.save(entidad);
        return UsuarioMapper.usuarioEntidadAUsuarioDto(saved);
    }

    @Transactional
    public UsuarioResponseDTO actualizar(Long id, UsuarioRequestDTO dto) {
        Usuario usuarioExistente = usuarioRepo.findById(id).orElseThrow(() -> new EntidadNoEncontradaException("Usuario no encontrado: " + id));
        if (dto.getNombre() != null) usuarioExistente.setNombre(dto.getNombre());
        if (dto.getApellidos() != null) usuarioExistente.setApellidos(dto.getApellidos());
        if (dto.getEmail() != null) usuarioExistente.setEmail(dto.getEmail());
        if (dto.getFotoPerfil() != null) usuarioExistente.setFotoPerfil(dto.getFotoPerfil());
        Usuario saved = usuarioRepo.save(usuarioExistente);
        return UsuarioMapper.usuarioEntidadAUsuarioDto(saved);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!usuarioRepo.existsById(id)) throw new EntidadNoEncontradaException("Usuario no encontrado: " + id);
        usuarioRepo.deleteById(id);
    }
}
