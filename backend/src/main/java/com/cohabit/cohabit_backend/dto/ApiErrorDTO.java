package com.cohabit.cohabit_backend.dto;

import lombok.*;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Estructura de error devuelta por la API")
public class ApiErrorDTO {
    @Schema(description = "Marca temporal del error", format = "date-time")
    private LocalDateTime timestamp;

    @Schema(description = "Código de estado HTTP", example = "XXX")
    private int numEstado;

    @Schema(description = "Nombre corto del error", example = "error")
    private String error;

    @Schema(description = "Mensaje más técnico o detallado")
    private String mensaje;

    @Schema(description = "Descripción adicional")
    private String descripcion;

    @Schema(description = "Ruta del endpoint que produjo el error")
    private String path;
}