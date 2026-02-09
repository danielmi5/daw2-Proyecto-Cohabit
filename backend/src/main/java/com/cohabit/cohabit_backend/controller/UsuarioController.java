package com.cohabit.cohabit_backend.controller;

import com.cohabit.cohabit_backend.dto.UsuarioRequestDTO;
import com.cohabit.cohabit_backend.dto.UsuarioUpdateDTO;
import com.cohabit.cohabit_backend.dto.UsuarioResponseDTO;
import com.cohabit.cohabit_backend.service.UsuarioService;
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
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

import jakarta.validation.Valid;
import java.net.URI;

@RestController
@RequestMapping("/api/usuarios")
@Tag(name = "Usuarios", description = "Gestión de usuarios del sistema")
@SecurityRequirement(name = "esquemaCohabitJWT")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    @Operation(summary = "Listar usuarios", description = "Obtener lista paginada de todos los usuarios")
    @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida exitosamente")
    public ResponseEntity<Page<UsuarioResponseDTO>> list(Pageable pageable) {
        return ResponseEntity.ok(usuarioService.obtenerTodos(pageable));
    }

    @GetMapping("/existe")
    @Operation(summary = "Comprobar email", description = "Verifica si un email ya está registrado (público)")
    public ResponseEntity<Map<String, Boolean>> existePorEmail(@RequestParam("email") String email) {
        boolean existe = usuarioService.existePorEmail(email);
        return ResponseEntity.ok(Map.of("exists", existe));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener usuario", description = "Obtener información detallada de un usuario por ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario encontrado"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "403", description = "No tienes permisos para ver este usuario", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esUsuarioIdActual(#id) or @grupoSecurity.comparteGrupoConUsuario(#id)")
    public ResponseEntity<UsuarioResponseDTO> get(
        @Parameter(description = "ID del usuario", required = true) @PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.obtenerPorId(id));
    }

    @PostMapping
    @Operation(summary = "Crear usuario", description = "Crear un nuevo usuario (solo administradores)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Usuario creado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "403", description = "Solo administradores pueden crear usuarios", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    public ResponseEntity<UsuarioResponseDTO> create(
        @Parameter(description = "Datos del nuevo usuario") @Valid @RequestBody UsuarioRequestDTO dto) {
        UsuarioResponseDTO usuarioCreado = usuarioService.crear(dto);
        return ResponseEntity.created(URI.create("/api/usuarios/" + usuarioCreado.getId())).body(usuarioCreado);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar usuario", description = "Actualizar información de un usuario")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario actualizado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "403", description = "No tienes permisos para actualizar este usuario", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esUsuarioIdActual(#id)")
    public ResponseEntity<UsuarioResponseDTO> update(
        @Parameter(description = "ID del usuario") @PathVariable Long id,
        @Parameter(description = "Datos actualizados del usuario") @Valid @RequestBody UsuarioUpdateDTO dto) {
        return ResponseEntity.ok(usuarioService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar usuario", description = "Eliminar un usuario del sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Usuario eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "403", description = "No tienes permisos para eliminar este usuario", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esUsuarioIdActual(#id)")
    public ResponseEntity<Void> delete(
        @Parameter(description = "ID del usuario") @PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/foto")
    @Operation(summary = "Subir foto de perfil", description = "Subir o actualizar la foto de perfil de un usuario")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Foto subida exitosamente"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class))),
        @ApiResponse(responseCode = "403", description = "Solo puedes subir tu propia foto de perfil", content = @Content(schema = @Schema(implementation = ApiErrorDTO.class)))
    })
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esUsuarioIdActual(#id)")
    public ResponseEntity<UsuarioResponseDTO> subirFoto(
        @Parameter(description = "ID del usuario") @PathVariable Long id,
        @Parameter(description = "Archivo de imagen") @RequestParam("archivo") MultipartFile archivo) {
        return ResponseEntity.ok(usuarioService.subirFoto(id, archivo));
    }
}
