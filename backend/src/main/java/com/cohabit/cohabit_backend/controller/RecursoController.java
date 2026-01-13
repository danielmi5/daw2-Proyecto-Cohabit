package com.cohabit.cohabit_backend.controller;

import com.cohabit.cohabit_backend.dto.RecursoRequestDTO;
import com.cohabit.cohabit_backend.dto.RecursoUpdateDTO;
import com.cohabit.cohabit_backend.dto.RecursoResponseDTO;
import com.cohabit.cohabit_backend.service.RecursoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import jakarta.validation.Valid;
import java.net.URI;
import java.time.LocalDate;
import java.time.LocalTime;
import com.cohabit.cohabit_backend.entity.TipoRecurso;
import com.cohabit.cohabit_backend.entity.EstadoRecurso;

@RestController
@RequestMapping("/api/recursos")
@Tag(name = "Recursos", description = "Gestión de recursos compartidos en grupos")
@SecurityRequirement(name = "bearerAuth")
public class RecursoController {

    private final RecursoService recursoService;

    public RecursoController(RecursoService recursoService) {
        this.recursoService = recursoService;
    }

    @GetMapping
    @Operation(summary = "Listar recursos", description = "Obtener lista paginada de todos los recursos")
    @ApiResponse(responseCode = "200", description = "Lista de recursos obtenida exitosamente")
    public ResponseEntity<Page<RecursoResponseDTO>> list(Pageable pageable) {
        return ResponseEntity.ok(recursoService.obtenerTodos(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener recurso", description = "Obtener información detallada de un recurso por ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Recurso encontrado"),
        @ApiResponse(responseCode = "404", description = "Recurso no encontrado"),
        @ApiResponse(responseCode = "403", description = "No tienes acceso a este recurso")
    })
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esRecursoEnGrupoMiembro(#id)")
    public ResponseEntity<RecursoResponseDTO> get(
        @Parameter(description = "ID del recurso") @PathVariable Long id) {
        return ResponseEntity.ok(recursoService.obtenerPorId(id));
    }

    @PostMapping
    @Operation(summary = "Crear recurso", description = "Crear un nuevo recurso en un grupo")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Recurso creado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos"),
        @ApiResponse(responseCode = "403", description = "No tienes permisos para crear recursos en este grupo")
    })
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esCreadorOAdmin(#dto.grupoId) or @grupoSecurity.esMiembroIdActual(#dto.creadorId)")
    public ResponseEntity<RecursoResponseDTO> create(
        @Parameter(description = "Datos del nuevo recurso") @Valid @RequestBody RecursoRequestDTO dto) {
        RecursoResponseDTO recursoCreado = recursoService.crear(dto);
        return ResponseEntity.created(URI.create("/api/recursos/" + recursoCreado.getId())).body(recursoCreado);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar recurso", description = "Actualizar información de un recurso")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Recurso actualizado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Recurso no encontrado"),
        @ApiResponse(responseCode = "403", description = "No tienes permisos para actualizar este recurso")
    })
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esCreadorOAdminRecurso(#id) or @grupoSecurity.esCreadorDelRecurso(#id)")
    public ResponseEntity<RecursoResponseDTO> update(
        @Parameter(description = "ID del recurso") @PathVariable Long id,
        @Parameter(description = "Datos actualizados del recurso") @Valid @RequestBody RecursoUpdateDTO dto) {
        return ResponseEntity.ok(recursoService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar recurso", description = "Eliminar un recurso del sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Recurso eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Recurso no encontrado"),
        @ApiResponse(responseCode = "403", description = "No tienes permisos para eliminar este recurso")
    })
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esCreadorOAdminRecurso(#id) or @grupoSecurity.esCreadorDelRecurso(#id)")
    public ResponseEntity<Void> delete(
        @Parameter(description = "ID del recurso") @PathVariable Long id) {
        recursoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/buscar")
    public ResponseEntity<Page<RecursoResponseDTO>> buscarPorFiltros(@RequestParam(name = "grupoId", required = false) Long grupoId, @RequestParam(name = "tipo", required = false) TipoRecurso tipo, @RequestParam(name = "estado", required = false) EstadoRecurso estado, @RequestParam(name = "fecha", required = false) LocalDate fecha, @RequestParam(name = "horaInicio", required = false) LocalTime horaInicio, @RequestParam(name = "horaFin", required = false) LocalTime horaFin, Pageable pageable) {
        return ResponseEntity.ok(recursoService.buscarPorFiltros(grupoId, tipo, estado, fecha, horaInicio, horaFin, pageable));
    }
}
