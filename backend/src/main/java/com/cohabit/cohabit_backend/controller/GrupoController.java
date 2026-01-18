package com.cohabit.cohabit_backend.controller;

import com.cohabit.cohabit_backend.dto.GrupoRequestDTO;
import com.cohabit.cohabit_backend.dto.GrupoUpdateDTO;
import com.cohabit.cohabit_backend.dto.GrupoResponseDTO;
import com.cohabit.cohabit_backend.service.GrupoService;
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
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.access.prepost.PreAuthorize;

import jakarta.validation.Valid;
import java.net.URI;

@RestController
@RequestMapping("/api/grupos")
@Tag(name = "Grupos", description = "Gestión de grupos de usuarios para compartir recursos")
@SecurityRequirement(name = "esquemaCohabitJWT")
public class GrupoController {

    private final GrupoService grupoService;

    public GrupoController(GrupoService grupoService) {
        this.grupoService = grupoService;
    }

    @GetMapping
    @Operation(summary = "Listar grupos", description = "Obtener lista paginada de todos los grupos")
    @ApiResponse(responseCode = "200", description = "Lista de grupos obtenida exitosamente")
    public ResponseEntity<Page<GrupoResponseDTO>> list(Pageable pageable) {
        return ResponseEntity.ok(grupoService.obtenerTodos(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener grupo", description = "Obtener información detallada de un grupo por ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Grupo encontrado"),
        @ApiResponse(responseCode = "404", description = "Grupo no encontrado", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "403", description = "No eres miembro de este grupo", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esMiembro(#id)")
    public ResponseEntity<GrupoResponseDTO> get(
        @Parameter(description = "ID del grupo") @PathVariable Long id) {
        return ResponseEntity.ok(grupoService.obtenerPorId(id));
    }

    @PostMapping
    @Operation(summary = "Crear grupo", description = "Crear un nuevo grupo")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Grupo creado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    public ResponseEntity<GrupoResponseDTO> create(
        @Parameter(description = "Datos del nuevo grupo") @Valid @RequestBody GrupoRequestDTO dto) {
        GrupoResponseDTO grupoCreado = grupoService.crear(dto);
        return ResponseEntity.created(URI.create("/api/grupos/" + grupoCreado.getId())).body(grupoCreado);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar grupo", description = "Actualizar información de un grupo")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Grupo actualizado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Grupo no encontrado", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "403", description = "Solo el creador o administradores pueden actualizar el grupo", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esCreadorOAdmin(#id)")
    public ResponseEntity<GrupoResponseDTO> update(
        @Parameter(description = "ID del grupo") @PathVariable Long id,
        @Parameter(description = "Datos actualizados del grupo") @Valid @RequestBody GrupoUpdateDTO dto) {
        return ResponseEntity.ok(grupoService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar grupo", description = "Eliminar un grupo del sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Grupo eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Grupo no encontrado", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "403", description = "Solo el creador o administradores pueden eliminar el grupo", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esCreadorOAdmin(#id)")
    public ResponseEntity<Void> delete(
        @Parameter(description = "ID del grupo") @PathVariable Long id) {
        grupoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/buscar")
    @Operation(summary = "Buscar grupos", description = "Buscar grupos por filtros opcionales")
    @ApiResponse(responseCode = "200", description = "Búsqueda realizada exitosamente")
    public ResponseEntity<Page<GrupoResponseDTO>> buscarPorFiltros(
        @Parameter(description = "Nombre del grupo") @RequestParam(name = "nombre", required = false) String nombre,
        @Parameter(description = "Descripción del grupo") @RequestParam(name = "descripcion", required = false) String descripcion,
        @Parameter(description = "ID del creador") @RequestParam(name = "creadorId", required = false) Long creadorId,
        Pageable pageable) {
        return ResponseEntity.ok(grupoService.buscarPorFiltros(nombre, descripcion, creadorId, pageable));
    }

    @PutMapping("/{id}/foto")
    @Operation(summary = "Subir foto del grupo", description = "Subir o actualizar la foto de un grupo")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Foto subida exitosamente"),
        @ApiResponse(responseCode = "404", description = "Grupo no encontrado", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "403", description = "Solo el creador o administradores pueden subir la foto", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esCreadorOAdmin(#id)")
    public ResponseEntity<GrupoResponseDTO> subirFoto(
        @Parameter(description = "ID del grupo") @PathVariable Long id,
        @Parameter(description = "Archivo de imagen") @RequestParam("archivo") MultipartFile archivo) {
        return ResponseEntity.ok(grupoService.subirFoto(id, archivo));
    }
}
