package com.cohabit.cohabit_backend.dto;

import lombok.*;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Información de grupo devuelta por la API")
public class GrupoResponseDTO {
    @Schema(description = "Identificador del grupo", example = "3")
    private Long id;

    @Schema(description = "Nombre del grupo", example = "nombre")
    private String nombre;

    @Schema(description = "Dirección del grupo")
    private String direccion;

    @Schema(description = "Descripción del grupo")
    private String descripcion;

    @Schema(description = "URL de la foto del grupo")
    private String fotoGrupo;

    @Schema(description = "Código de invitación al grupo")
    private String codigoInvitacion;

    @Schema(description = "Fecha de creación", format = "date-time")
    private LocalDateTime fechaCreacion;

    @Schema(description = "Fecha de última actualización", format = "date-time")
    private LocalDateTime fechaActualizacion;

    @Schema(description = "IDs de los miembros del grupo")
    private List<Long> miembrosIds;

    @Schema(description = "IDs de los recursos del grupo")
    private List<Long> recursosIds;

    @Schema(description = "ID del usuario creador del grupo")
    private Long creadorId;
}
