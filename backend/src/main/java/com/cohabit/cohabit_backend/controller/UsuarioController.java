package com.cohabit.cohabit_backend.controller;

import com.cohabit.cohabit_backend.dto.UsuarioRequestDTO;
import com.cohabit.cohabit_backend.dto.UsuarioUpdateDTO;
import com.cohabit.cohabit_backend.dto.UsuarioResponseDTO;
import com.cohabit.cohabit_backend.service.UsuarioService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import jakarta.validation.Valid;
import java.net.URI;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<Page<UsuarioResponseDTO>> list(Pageable pageable) {
        return ResponseEntity.ok(usuarioService.obtenerTodos(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esUsuarioIdActual(#id) or @grupoSecurity.comparteGrupoConUsuario(#id)")
    public ResponseEntity<UsuarioResponseDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> create(@Valid @RequestBody UsuarioRequestDTO dto) {
        UsuarioResponseDTO usuarioCreado = usuarioService.crear(dto);
        return ResponseEntity.created(URI.create("/api/usuarios/" + usuarioCreado.getId())).body(usuarioCreado);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esUsuarioIdActual(#id)")
    public ResponseEntity<UsuarioResponseDTO> update(@PathVariable Long id, @Valid @RequestBody UsuarioUpdateDTO dto) {
        return ResponseEntity.ok(usuarioService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esUsuarioIdActual(#id)")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
