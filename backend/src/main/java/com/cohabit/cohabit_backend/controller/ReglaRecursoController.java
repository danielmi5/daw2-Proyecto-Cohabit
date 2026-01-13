package com.cohabit.cohabit_backend.controller;

import com.cohabit.cohabit_backend.dto.ReglaRecursoRequestDTO;
import com.cohabit.cohabit_backend.dto.ReglaRecursoUpdateDTO;
import com.cohabit.cohabit_backend.dto.ReglaRecursoResponseDTO;
import com.cohabit.cohabit_backend.service.ReglaRecursoService;
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

@RestController
@RequestMapping("/api/reglas")
@Tag(name = "Reglas", description = "Gestión de reglas de uso de recursos")
@SecurityRequirement(name = "bearerAuth")
public class ReglaRecursoController {

    private final ReglaRecursoService reglaService;

    public ReglaRecursoController(ReglaRecursoService reglaService) {
        this.reglaService = reglaService;
    }

    @GetMapping
    @Operation(summary = "Listar reglas", description = "Obtener lista paginada de reglas de recursos")
    @ApiResponse(responseCode = "200", description = "Lista de reglas obtenida exitosamente")
    public ResponseEntity<Page<ReglaRecursoResponseDTO>> list(Pageable pageable) {
        return ResponseEntity.ok(reglaService.obtenerTodos(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener regla", description = "Obtener información detallada de una regla por ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Regla encontrada"),
        @ApiResponse(responseCode = "404", description = "Regla no encontrada"),
        @ApiResponse(responseCode = "403", description = "No tienes acceso a esta regla")
    })
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esReglaEnGrupoMiembro(#id)")
    public ResponseEntity<ReglaRecursoResponseDTO> get(
        @Parameter(description = "ID de la regla") @PathVariable Long id) {
        return ResponseEntity.ok(reglaService.obtenerPorId(id));
    }

    @PostMapping
    @Operation(summary = "Crear regla", description = "Crear una nueva regla para un recurso")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Regla creada exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos"),
        @ApiResponse(responseCode = "403", description = "No tienes permisos para crear reglas en este recurso")
    })
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esCreadorOAdminRecurso(#dto.recursoId) or @grupoSecurity.esMiembroIdActual(#dto.miembroId)")
    public ResponseEntity<ReglaRecursoResponseDTO> create(
        @Parameter(description = "Datos de la nueva regla") @Valid @RequestBody ReglaRecursoRequestDTO dto) {
        ReglaRecursoResponseDTO reglaCreada = reglaService.crear(dto);
        return ResponseEntity.created(URI.create("/api/reglas/" + reglaCreada.getId())).body(reglaCreada);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar regla", description = "Actualizar información de una regla de recurso")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Regla actualizada exitosamente"),
        @ApiResponse(responseCode = "404", description = "Regla no encontrada"),
        @ApiResponse(responseCode = "403", description = "No tienes permisos para actualizar esta regla")
    })
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esCreadorOAdminRegla(#id) or @grupoSecurity.esCreadorDeRegla(#id)")
    public ResponseEntity<ReglaRecursoResponseDTO> update(
        @Parameter(description = "ID de la regla") @PathVariable Long id,
        @Parameter(description = "Datos actualizados de la regla") @Valid @RequestBody ReglaRecursoUpdateDTO dto) {
        return ResponseEntity.ok(reglaService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar regla", description = "Eliminar una regla de recurso")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Regla eliminada exitosamente"),
        @ApiResponse(responseCode = "404", description = "Regla no encontrada"),
        @ApiResponse(responseCode = "403", description = "No tienes permisos para eliminar esta regla")
    })
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esCreadorOAdminRegla(#id) or @grupoSecurity.esCreadorDeRegla(#id)")
    public ResponseEntity<Void> delete(
        @Parameter(description = "ID de la regla") @PathVariable Long id) {
        reglaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
