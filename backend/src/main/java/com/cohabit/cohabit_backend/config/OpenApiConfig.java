package com.cohabit.cohabit_backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Configuración de OpenAPI/Swagger para la documentación de la API
 */
@Configuration
public class OpenApiConfig {

    @Value("${spring.application.name:cohabit-backend}")
    private String applicationName;

    @Bean
    public OpenAPI configuracionOpenAPI() {
        
        return new OpenAPI()
                .info(new Info()
                        .title("API Cohabit - Gestor de Recursos Compartidos")
                        .description("API REST para la gestión de recursos compartidos en grupos. " +
                                "Permite administrar usuarios, grupos, recursos, reglas y reservas. " +
                                "La autenticación se realiza mediante JWT (JSON Web Tokens).")
                        .version("1.0.0"));
    }
}
