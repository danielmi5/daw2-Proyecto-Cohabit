package com.cohabit.cohabit_backend.config;


import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración de OpenAPI/Swagger para la documentación de la API
 */
@Configuration
public class OpenApiConfig {

    @Value("${spring.application.name:cohabit-backend}")
    private String applicationName;

    @Bean
    public OpenAPI configuracionOpenAPI() {
        // Nombre del esquema de seguridad referenciado por los controladores
        final String nombreEsquemaSeguridad = "esquemaCohabitJWT";

        // Información básica y metadatos
        Info info = new Info()
            .title("API Cohabit - Gestor de Recursos Compartidos")
            .description("API REST para la gestión de recursos compartidos en grupos. Permite administrar usuarios, grupos, recursos, reglas y reservas. La autenticación se realiza mediante JWT.")
            .version("1.0.0")
            .license(new License().name("MIT").url("https://opensource.org/licenses/MIT"));

        // Servidores
        Server servidorLocal = new Server().url("http://localhost:8080").description("Local (development)");
        Server servidorProduccion = new Server().url("https://api.example.com").description("Production API");

        // Define el esquema de seguridad bearer (JWT) para que los controladores que usan `@SecurityRequirement(name = "esquemaCohabitJWT")` funcionen
        SecurityScheme esquemaSeguridad = new SecurityScheme()
            .type(SecurityScheme.Type.HTTP)
            .scheme("bearer")
            .bearerFormat("JWT")
            .in(SecurityScheme.In.HEADER)
            .name("Authorization");

        Components componentes = new Components()
            .addSecuritySchemes(nombreEsquemaSeguridad, esquemaSeguridad);

        // Requisito de seguridad global (se aplica a las operaciones que no lo sobreescriben)
        SecurityRequirement requisitoSeguridad = new SecurityRequirement().addList(nombreEsquemaSeguridad);

        return new OpenAPI()
            .components(componentes)
            .addSecurityItem(requisitoSeguridad)
            .addServersItem(servidorLocal)
            .addServersItem(servidorProduccion)
            .info(info);
    }
}
