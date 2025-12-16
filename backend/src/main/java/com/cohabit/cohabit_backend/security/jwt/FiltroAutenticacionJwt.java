package com.cohabit.cohabit_backend.security.jwt;

import com.cohabit.cohabit_backend.security.auth.service.DetallesUsuarioService;
import com.cohabit.cohabit_backend.security.jwt.TokenInvalidadoService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtro que intercepta cada petición HTTP para validar el token JWT y establecer la autenticación en el contexto de seguridad
 */
@Component
@RequiredArgsConstructor
public class FiltroAutenticacionJwt extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final DetallesUsuarioService detallesUsuarioService;
    private final TokenInvalidadoService tokenInvalidadoService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest peticion,
            @NonNull HttpServletResponse respuesta,
            @NonNull FilterChain cadenaDeFiltros
    ) throws ServletException, IOException {

        final String cabeceraAutorizacion = peticion.getHeader("Authorization");
        final String jwt;
        final String email;

        // Verifica si existe el header Authorization y empieza con "Bearer "
        if (cabeceraAutorizacion == null || !cabeceraAutorizacion.startsWith("Bearer ")) {
            cadenaDeFiltros.doFilter(peticion, respuesta);
            return;
        }

        // Extrae el token JWT 
        jwt = cabeceraAutorizacion.substring(7);

        try {
            // Extrae el JTI del token
            String jti = jwtService.extraerJti(jwt);

            // Verifica si el token ha sido invalidado
            if (tokenInvalidadoService.esTokenInvalidado(jti)) {
                cadenaDeFiltros.doFilter(peticion, respuesta);
                return;
            }

            // Extrae el email del usuario del token
            email = jwtService.extraerEmail(jwt);

            // Si el usuario no está ya autenticado, validar y autenticar
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails detallesUsuario = detallesUsuarioService.loadUserByUsername(email);

                // Valida el token (firma, expiración)
                if (jwtService.esTokenValido(jwt, detallesUsuario)) {
                    UsernamePasswordAuthenticationToken tokenAutenticacion = new UsernamePasswordAuthenticationToken(
                            detallesUsuario,
                            null,
                            detallesUsuario.getAuthorities()
                    );

                    tokenAutenticacion.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(peticion)
                    );

                    // Establece la autenticación en el contexto de seguridad
                    SecurityContextHolder.getContext().setAuthentication(tokenAutenticacion);
                }
            }
        } catch (Exception e) {
            // Si hay error al procesar el token no autentica
            logger.error("Error al procesar el token JWT: " + e.getMessage());
        }

        cadenaDeFiltros.doFilter(peticion, respuesta);
    }
}
