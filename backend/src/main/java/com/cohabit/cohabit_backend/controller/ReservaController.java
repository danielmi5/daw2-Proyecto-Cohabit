package com.cohabit.cohabit_backend.controller;

import com.cohabit.cohabit_backend.dto.ReservaRequestDTO;
import com.cohabit.cohabit_backend.dto.ReservaUpdateDTO;
import com.cohabit.cohabit_backend.dto.ReservaResponseDTO;
import com.cohabit.cohabit_backend.dto.UsuarioResponseDTO;
import com.cohabit.cohabit_backend.service.ReservaService;
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
import java.time.LocalDate;
import com.cohabit.cohabit_backend.entity.EstadoReserva;

@RestController
@RequestMapping("/api/reservas")
@Tag(name = "Reservas", description = "Gestión de reservas de recursos")
@SecurityRequirement(name = "esquemaCohabitJWT")
public class ReservaController {

    private final ReservaService reservaService;

    public ReservaController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @GetMapping
    @Operation(summary = "Listar reservas", description = "Obtener lista paginada de todas las reservas")
    @ApiResponse(responseCode = "200", description = "Lista de reservas obtenida exitosamente")
    public ResponseEntity<Page<ReservaResponseDTO>> list(Pageable pageable) {
        return ResponseEntity.ok(reservaService.obtenerTodos(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener reserva", description = "Obtener información detallada de una reserva por ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Reserva encontrada"),
        @ApiResponse(responseCode = "404", description = "Reserva no encontrada", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "403", description = "No tienes acceso a esta reserva", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esPropietarioReserva(#id) or @grupoSecurity.esReservaEnGrupoMiembro(#id)")
    public ResponseEntity<ReservaResponseDTO> get(
        @Parameter(description = "ID de la reserva") @PathVariable Long id) {
        return ResponseEntity.ok(reservaService.obtenerPorId(id));
    }

    @GetMapping("/{id}/autor")
    @Operation(summary = "Obtener autor de la reserva", description = "Obtener información del usuario que creó la reserva")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Autor encontrado"),
        @ApiResponse(responseCode = "404", description = "Reserva no encontrada", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "403", description = "No tienes acceso a esta información", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esReservaEnGrupoMiembro(#id)")
    public ResponseEntity<UsuarioResponseDTO> getAutor(
        @Parameter(description = "ID de la reserva") @PathVariable Long id) {
        return ResponseEntity.ok(reservaService.obtenerAutorReserva(id));
    }

    @PostMapping
    @Operation(summary = "Crear reserva", description = "Crear una nueva reserva de un recurso")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Reserva creada exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos o conflicto de reserva", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "403", description = "No tienes permisos para crear esta reserva", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esMiembroIdActual(#dto.miembroGrupoId)")
    public ResponseEntity<ReservaResponseDTO> create(
        @Parameter(description = "Datos de la nueva reserva") @Valid @RequestBody ReservaRequestDTO dto) {
        ReservaResponseDTO reservaCreada = reservaService.crear(dto);
        return ResponseEntity.created(URI.create("/api/reservas/" + reservaCreada.getId())).body(reservaCreada);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar reserva", description = "Actualizar información de una reserva")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Reserva actualizada exitosamente"),
        @ApiResponse(responseCode = "404", description = "Reserva no encontrada", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "403", description = "Solo el propietario puede actualizar la reserva", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esPropietarioReserva(#id)")
    public ResponseEntity<ReservaResponseDTO> update(
        @Parameter(description = "ID de la reserva") @PathVariable Long id,
        @Parameter(description = "Datos actualizados de la reserva") @Valid @RequestBody ReservaUpdateDTO dto) {
        return ResponseEntity.ok(reservaService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar reserva", description = "Cancelar/eliminar una reserva")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Reserva eliminada exitosamente"),
        @ApiResponse(responseCode = "404", description = "Reserva no encontrada", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "403", description = "Solo el propietario puede eliminar la reserva", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esPropietarioReserva(#id)")
    public ResponseEntity<Void> delete(
        @Parameter(description = "ID de la reserva") @PathVariable Long id) {
        reservaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/buscar")
    @Operation(summary = "Buscar reservas", description = "Buscar reservas por filtros opcionales: recurso, usuario, fecha y estado")
    @ApiResponse(responseCode = "200", description = "Búsqueda de reservas realizada exitosamente")
    public ResponseEntity<Page<ReservaResponseDTO>> buscarPorFiltros(
        @Parameter(description = "ID del recurso") @RequestParam(name = "recursoId", required = false) Long recursoId,
        @Parameter(description = "ID del usuario") @RequestParam(name = "usuarioId", required = false) Long usuarioId,
        @Parameter(description = "Fecha de la reserva (formato yyyy-MM-dd)") @RequestParam(name = "fecha", required = false) LocalDate fecha,
        @Parameter(description = "Estado de la reserva") @RequestParam(name = "estado", required = false) EstadoReserva estado,
        Pageable pageable) {
        return ResponseEntity.ok(reservaService.buscarPorFiltros(recursoId, usuarioId, fecha, estado, pageable));
    }
}
