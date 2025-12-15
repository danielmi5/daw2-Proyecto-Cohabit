package com.cohabit.cohabit_backend.security;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Configuración de seguridad de Spring Security con JWT
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class ConfiguracionSeguridad {
    
    private final FiltroAutenticacionJwt filtroAutenticacionJwt;
    private final DetallesUsuarioService detallesUsuarioService;
    
    /**
     * Configura la cadena de filtros de seguridad
     */
    @Bean
    public SecurityFilterChain cadenaDeFiltrosDeSeguridad(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(peticiones -> peticiones
                        // Endpoints públicos (no requieren autenticación)
                        .requestMatchers(
                                "/auth/login",
                                "/auth/register"
                        ).permitAll()
                        
                        // Consultas GET accesibles a usuarios autenticados (cualquier rol)
                        .requestMatchers(HttpMethod.GET, "/api/**").authenticated()
                        
                        // Todos los demás endpoints requieren autenticación
                        .anyRequest().authenticated()
                )
                .sessionManagement(sesion -> sesion
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .exceptionHandling(excepciones -> excepciones
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\":\"No autorizado\",\"mensaje\":\"" + authException.getMessage() + "\"}");
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\":\"Acceso denegado\",\"mensaje\":\"" + accessDeniedException.getMessage() + "\"}");
                        })
                )
                .authenticationProvider(proveedorDeAutenticacion())
                .addFilterBefore(filtroAutenticacionJwt, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    /**
     * Proveedor de autenticación que usa el DetallesUsuarioService y el PasswordEncoder
     */
    @Bean
    public AuthenticationProvider proveedorDeAutenticacion() {
        DaoAuthenticationProvider proveedorDeAutenticacion = new DaoAuthenticationProvider(detallesUsuarioService);
        proveedorDeAutenticacion.setPasswordEncoder(codificadorDeContrasenia());
        return proveedorDeAutenticacion;
    }
    
    /**
     * Gestor de autenticación
     */
    @Bean
    public AuthenticationManager gestorDeAutenticacion(AuthenticationConfiguration configuracion) throws Exception {
        return configuracion.getAuthenticationManager();
    }
    
    /**
     * Codificador de contraseñas usando BCrypt
     */
    @Bean
    public PasswordEncoder codificadorDeContrasenia() {
        return new BCryptPasswordEncoder();
    }
}
