package com.cohabit.cohabit_backend.controller;

import com.cohabit.cohabit_backend.dto.MiembroGrupoRequestDTO;
import com.cohabit.cohabit_backend.dto.MiembroGrupoUpdateDTO;
import com.cohabit.cohabit_backend.dto.MiembroGrupoResponseDTO;
import com.cohabit.cohabit_backend.service.MiembroGrupoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import jakarta.validation.Valid;
import java.net.URI;

@RestController
@RequestMapping("/api/miembros")
public class MiembroGrupoController {

    private final MiembroGrupoService miembroService;

    public MiembroGrupoController(MiembroGrupoService miembroService) {
        this.miembroService = miembroService;
    }

    @GetMapping
    public ResponseEntity<Page<MiembroGrupoResponseDTO>> list(Pageable pageable) {
        return ResponseEntity.ok(miembroService.obtenerTodos(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esMiembroIdActual(#id) or @grupoSecurity.esCreadorOAdminMiembro(#id)")
    public ResponseEntity<MiembroGrupoResponseDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(miembroService.obtenerPorId(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esCreadorOAdmin(#dto.grupoId)")
    public ResponseEntity<MiembroGrupoResponseDTO> create(@Valid @RequestBody MiembroGrupoRequestDTO dto) {
        MiembroGrupoResponseDTO miembroCreado = miembroService.crear(dto);
        return ResponseEntity.created(URI.create("/api/miembros/" + miembroCreado.getId())).body(miembroCreado);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esCreadorOAdminMiembro(#id) or @grupoSecurity.esMiembroIdActual(#id)")
    public ResponseEntity<MiembroGrupoResponseDTO> update(@PathVariable Long id, @Valid @RequestBody MiembroGrupoUpdateDTO dto) {
        return ResponseEntity.ok(miembroService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esCreadorOAdminMiembro(#id) or @grupoSecurity.esMiembroIdActual(#id)")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        miembroService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
