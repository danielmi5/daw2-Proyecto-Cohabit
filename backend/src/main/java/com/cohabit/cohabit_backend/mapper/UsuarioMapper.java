package com.cohabit.cohabit_backend.mapper;

import com.cohabit.cohabit_backend.dto.UsuarioRequestDTO;
import com.cohabit.cohabit_backend.dto.UsuarioResponseDTO;
import com.cohabit.cohabit_backend.entity.Usuario;
 
public final class UsuarioMapper {

    private UsuarioMapper() {}

    public static UsuarioResponseDTO usuarioEntidadAUsuarioDto(Usuario usuario) {
        if (usuario == null) {
            return null;
        }

        return UsuarioResponseDTO.builder()
            .id(usuario.getId())
            .nombre(usuario.getNombre())
            .apellidos(usuario.getApellidos())
            .email(usuario.getEmail())
            .fotoPerfil(usuario.getFotoPerfil())
            .pais(usuario.getPais())
            .ciudad(usuario.getCiudad())
            .telefono(usuario.getTelefono())
            .fechaRegistro(usuario.getFechaRegistro())
            .miembroGrupoId(usuario.getMiembroGrupo() != null ? usuario.getMiembroGrupo().getId() : null)
            .build();
    }

    public static Usuario usuarioRequestAUsuarioEntidad(UsuarioRequestDTO usuarioRequestDTO) {
        if (usuarioRequestDTO == null) {
            return null;
        }

        return Usuario.builder()
                .nombre(usuarioRequestDTO.getNombre())
                .apellidos(usuarioRequestDTO.getApellidos())
                .email(usuarioRequestDTO.getEmail())
                .password(usuarioRequestDTO.getPassword())
                .fotoPerfil(usuarioRequestDTO.getFotoPerfil())
                .pais(usuarioRequestDTO.getPais())
                .ciudad(usuarioRequestDTO.getCiudad())
                .telefono(usuarioRequestDTO.getTelefono())
                .build();
    }
}
