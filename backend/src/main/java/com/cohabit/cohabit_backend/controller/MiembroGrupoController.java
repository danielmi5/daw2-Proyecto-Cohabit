package com.cohabit.cohabit_backend.controller;

import com.cohabit.cohabit_backend.dto.MiembroGrupoRequestDTO;
import com.cohabit.cohabit_backend.dto.MiembroGrupoUpdateDTO;
import com.cohabit.cohabit_backend.dto.MiembroGrupoResponseDTO;
import com.cohabit.cohabit_backend.dto.ReservaResponseDTO;
import com.cohabit.cohabit_backend.service.MiembroGrupoService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.Map;
import com.cohabit.cohabit_backend.exception.ParametroNuloException;
import com.cohabit.cohabit_backend.exception.EntidadNoEncontradaException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import com.cohabit.cohabit_backend.dto.ApiErrorDTO;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/miembros")
@Tag(name = "Miembros", description = "Gestión de miembros de grupos")
@SecurityRequirement(name = "esquemaCohabitJWT")
public class MiembroGrupoController {

    private final MiembroGrupoService miembroService;

    public MiembroGrupoController(MiembroGrupoService miembroService) {
        this.miembroService = miembroService;
    }

    @GetMapping
    @Operation(summary = "Listar miembros", description = "Obtener lista paginada de miembros de grupos")
    @ApiResponse(responseCode = "200", description = "Lista de miembros obtenida exitosamente")
    public ResponseEntity<Page<MiembroGrupoResponseDTO>> list(Pageable pageable) {
        return ResponseEntity.ok(miembroService.obtenerTodos(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener miembro", description = "Obtener información detallada de un miembro por ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Miembro encontrado"),
        @ApiResponse(responseCode = "404", description = "Miembro no encontrado", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "403", description = "No tienes acceso a este miembro", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esMiembroIdActual(#id) or @grupoSecurity.esCreadorOAdminMiembro(#id)")
    public ResponseEntity<MiembroGrupoResponseDTO> get(
        @Parameter(description = "ID del miembro") @PathVariable Long id) {
        return ResponseEntity.ok(miembroService.obtenerPorId(id));
    }

    @GetMapping("/{id}/reservas")
    @Operation(summary = "Obtener reservas del miembro", description = "Obtener todas las reservas de un miembro específico")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de reservas obtenida exitosamente"),
        @ApiResponse(responseCode = "404", description = "Miembro no encontrado", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "403", description = "No tienes acceso a este miembro", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esMiembroIdActual(#id) or @grupoSecurity.esCreadorOAdminMiembro(#id)")
    public ResponseEntity<List<ReservaResponseDTO>> getReservas(
        @Parameter(description = "ID del miembro") @PathVariable Long id) {
        return ResponseEntity.ok(miembroService.obtenerReservasPorMiembro(id));
    }

    @PostMapping
    @Operation(summary = "Agregar miembro", description = "Agregar un nuevo miembro a un grupo")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Miembro agregado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "403", description = "No tienes permisos para agregar miembros a este grupo", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esCreadorOAdmin(#dto.grupoId)")
    public ResponseEntity<MiembroGrupoResponseDTO> create(
        @Parameter(description = "Datos del nuevo miembro") @Valid @RequestBody MiembroGrupoRequestDTO dto) {
        MiembroGrupoResponseDTO miembroCreado = miembroService.crear(dto);
        return ResponseEntity.created(URI.create("/api/miembros/" + miembroCreado.getId())).body(miembroCreado);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar miembro", description = "Actualizar información de un miembro (rol, estado, etc.)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Miembro actualizado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Miembro no encontrado", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "403", description = "No tienes permisos para actualizar este miembro", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esCreadorOAdminMiembro(#id) or @grupoSecurity.esMiembroIdActual(#id)")
    public ResponseEntity<MiembroGrupoResponseDTO> update(
        @Parameter(description = "ID del miembro") @PathVariable Long id,
        @Parameter(description = "Datos actualizados del miembro") @Valid @RequestBody MiembroGrupoUpdateDTO dto) {
        return ResponseEntity.ok(miembroService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar miembro", description = "Remover un miembro de un grupo")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Miembro eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Miembro no encontrado", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "403", description = "No tienes permisos para eliminar este miembro", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esCreadorOAdminMiembro(#id) or @grupoSecurity.esMiembroIdActual(#id)")
    public ResponseEntity<Void> delete(
        @Parameter(description = "ID del miembro") @PathVariable Long id) {
        miembroService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/unirse")
    @Operation(summary = "Unirse a grupo por código", description = "Permite al usuario autenticado unirse a un grupo mediante código de invitación")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Usuario unido al grupo exitosamente"),
        @ApiResponse(responseCode = "400", description = "Código inválido", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "404", description = "Grupo o usuario no encontrado", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    public ResponseEntity<MiembroGrupoResponseDTO> unirse(@RequestBody Map<String, String> payload) {
        String codigo = payload != null ? payload.get("codigoInvitacion") : null;
        if (codigo == null || codigo.isBlank()) throw new ParametroNuloException("El código de invitacion es obligatorio");

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) throw new EntidadNoEncontradaException("Usuario autenticado no encontrado");

        MiembroGrupoResponseDTO creado = miembroService.unirsePorCodigo(codigo, auth.getName());
        return ResponseEntity.created(URI.create("/api/miembros/" + creado.getId())).body(creado);
    }
}
