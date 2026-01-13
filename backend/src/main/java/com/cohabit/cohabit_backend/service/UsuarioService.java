package com.cohabit.cohabit_backend.service;

import com.cohabit.cohabit_backend.dto.UsuarioRequestDTO;
import com.cohabit.cohabit_backend.dto.UsuarioUpdateDTO;
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
    public UsuarioResponseDTO actualizar(Long id, UsuarioUpdateDTO dto) {
        if (dto == null) throw new ParametroNuloException("UsuarioUpdateDTO es nulo");
        Usuario usuarioExistente = usuarioRepo.findById(id).orElseThrow(() -> new EntidadNoEncontradaException("Usuario no encontrado: " + id));

        if (dto.getNombre() != null) usuarioExistente.setNombre(dto.getNombre());
        if (dto.getApellidos() != null) usuarioExistente.setApellidos(dto.getApellidos());

        if (dto.getEmail() != null) {
            String nuevoEmail = dto.getEmail();
            if (!nuevoEmail.equals(usuarioExistente.getEmail()) && usuarioRepo.existsByEmail(nuevoEmail)) {
                throw new EntidadYaExisteException("Email ya registrado");
            }
            usuarioExistente.setEmail(nuevoEmail);
        }

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            if (dto.getPassword().length() < 6) {
                throw new ParametroNuloException("La contraseña debe tener al menos 6 caracteres");
            }
            // si usas PasswordEncoder, aquí deberías codificar la contraseña
            usuarioExistente.setPassword(dto.getPassword());
        }

        if (dto.getFotoPerfil() != null) usuarioExistente.setFotoPerfil(dto.getFotoPerfil());
        if (dto.getPais() != null) usuarioExistente.setPais(dto.getPais());
        if (dto.getCiudad() != null) usuarioExistente.setCiudad(dto.getCiudad());
        if (dto.getTelefono() != null) usuarioExistente.setTelefono(dto.getTelefono());

        Usuario saved = usuarioRepo.save(usuarioExistente);
        return UsuarioMapper.usuarioEntidadAUsuarioDto(saved);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!usuarioRepo.existsById(id)) throw new EntidadNoEncontradaException("Usuario no encontrado: " + id);
        usuarioRepo.deleteById(id);
    }

    public boolean existePorEmail(String email) {
        if (email == null) return false;
        return usuarioRepo.existsByEmail(email);
    }
}
