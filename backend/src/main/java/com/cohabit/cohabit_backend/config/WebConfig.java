package com.cohabit.cohabit_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;



/**
 * Configuración global de CORS
 */
@Configuration
public class WebConfig {

    /**
     * Configura y registra un filtro CORS global para la aplicación.
     * Este filtro permite controlar qué dominios, headers y métodos pueden
     * interactuar con el backend.
     *
     * @return un bean de tipo CorsFilter configurado.
     */
	@Bean
	public CorsFilter corsFilter() {
		CorsConfiguration cors = new CorsConfiguration();
        cors.addAllowedOrigin("http://localhost:4200");
		cors.addAllowedHeader("*");
        cors.addAllowedMethod("*");
		cors.setAllowCredentials(true);
		cors.setMaxAge(3600L);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", cors);
		return new CorsFilter(source);
	}
}

