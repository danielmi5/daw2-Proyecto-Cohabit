package com.cohabit.cohabit_backend.service;

import com.cohabit.cohabit_backend.dto.AuthRequestDTO;
import com.cohabit.cohabit_backend.dto.AuthResponseDTO;
import com.cohabit.cohabit_backend.dto.RegisterRequestDTO;
import com.cohabit.cohabit_backend.entity.Usuario;
import com.cohabit.cohabit_backend.repository.UsuarioRepository;
import com.cohabit.cohabit_backend.security.JwtService;
import com.cohabit.cohabit_backend.security.TokenInvalidadoService;
import lombok.RequiredArgsConstructor;
import com.cohabit.cohabit_backend.exception.UsuarioNoEncontradoException;
import com.cohabit.cohabit_backend.exception.EmailYaRegistradoException;
import com.cohabit.cohabit_backend.exception.CabeceraAutorizacionInvalidaException;
import com.cohabit.cohabit_backend.exception.TokenInvalidoException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AutenticacionService {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final TokenInvalidadoService tokenInvalidadoService;

    public AuthResponseDTO iniciarSesion(AuthRequestDTO peticion) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(peticion.getEmail(), peticion.getPassword())
        );

        Usuario usuario = usuarioRepository.findByEmail(peticion.getEmail());
        if (usuario == null) throw new UsuarioNoEncontradoException("Usuario no encontrado");

        String token = jwtService.generarToken(new User(
                usuario.getEmail(), usuario.getPassword(), java.util.Collections.emptyList()
        ));

        return new AuthResponseDTO(token);
    }

    public void registrar(RegisterRequestDTO peticion) {
        if (usuarioRepository.existsByEmail(peticion.getEmail())) {
            throw new EmailYaRegistradoException("El email ya está registrado");
        }

        Usuario usuario = Usuario.builder()
                .nombre(peticion.getNombre())
                .apellidos(peticion.getApellidos())
                .email(peticion.getEmail())
                .password(passwordEncoder.encode(peticion.getPassword()))
                .build();

        usuarioRepository.save(usuario);
    }

    public void cerrarSesion(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new CabeceraAutorizacionInvalidaException("Cabecera de autorización ausente o no válida");
        }

        String token = authorizationHeader.substring(7);
        try {
            String jti = jwtService.extraerJti(token);
            java.util.Date exp = jwtService.extraerExpiracionToken(token);
            tokenInvalidadoService.invalidarToken(jti, exp);
        } catch (Exception e) {
            throw new TokenInvalidoException("Error al procesar el token JWT", e);
        }
    }

}
