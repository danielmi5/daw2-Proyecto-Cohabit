package com.cohabit.cohabit_backend.security.auth.service;

import com.cohabit.cohabit_backend.entity.Usuario;
import com.cohabit.cohabit_backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import com.cohabit.cohabit_backend.exception.UsuarioNoEncontradoException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;

/**
 * Servicio personalizado para cargar detalles del usuario desde la base de datos
 */
@Service
@RequiredArgsConstructor
public class DetallesUsuarioService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email);

        if (usuario == null) {
            throw new UsuarioNoEncontradoException("Usuario no encontrado: " + email);
        }

        return new User(
            usuario.getEmail(),
            usuario.getPassword(),
            obtenerAutoridades(usuario)
        );
    }

    /**
     * Convierte el rol del usuario en una autoridad de Spring Security
     */
    private Collection<? extends GrantedAuthority> obtenerAutoridades(Usuario usuario) {
        return Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + usuario.getRol().name())
        );
    }
}
