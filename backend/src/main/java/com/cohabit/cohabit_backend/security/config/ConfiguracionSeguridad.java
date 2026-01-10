package com.cohabit.cohabit_backend.security.config;

import com.cohabit.cohabit_backend.security.auth.service.DetallesUsuarioService;
import com.cohabit.cohabit_backend.security.jwt.FiltroAutenticacionJwt;
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

                    // Actuator: sólo administradores pueden acceder a los endpoints de gestión
                    .requestMatchers("/actuator/**").hasRole("ADMIN")

                    // Gestión de usuarios sólo para administradores
                    .requestMatchers(HttpMethod.POST, "/api/usuarios/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/usuarios/**").hasRole("ADMIN")
                        
                    // Todas las rutas /api/** requieren autenticación
                    .requestMatchers("/api/**").authenticated()

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

                            String mensaje = authException != null && authException.getMessage() != null
                                    ? authException.getMessage()
                                    : "Se requiere autenticación";

                            if (mensaje.contains("Full authentication is required")) {
                                mensaje = "Es necesario autenticarse para acceder a este recurso";
                            } else if (mensaje.toLowerCase().contains("bad credentials")) {
                                mensaje = "Credenciales incorrectas";
                            }

                            response.getWriter().write("{\"error\":\"No autorizado\",\"mensaje\":\"" + mensaje + "\"}");
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.setContentType("application/json");

                            String mensaje = accessDeniedException != null && accessDeniedException.getMessage() != null
                                    ? accessDeniedException.getMessage()
                                    : "Acceso denegado";

                            if (mensaje.contains("Access is denied") || mensaje.contains("Denied")) {
                                mensaje = "No tienes permisos para acceder a este recurso";
                            }

                            response.getWriter().write("{\"error\":\"Acceso denegado\",\"mensaje\":\"" + mensaje + "\"}");
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
