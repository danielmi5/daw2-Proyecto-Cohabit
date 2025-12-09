package com.cohabit.cohabit_backend.controller;

import com.cohabit.cohabit_backend.dto.MiembroGrupoRequestDTO;
import com.cohabit.cohabit_backend.dto.MiembroGrupoResponseDTO;
import com.cohabit.cohabit_backend.service.MiembroGrupoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<MiembroGrupoResponseDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(miembroService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<MiembroGrupoResponseDTO> create(@Valid @RequestBody MiembroGrupoRequestDTO dto) {
        MiembroGrupoResponseDTO miembroCreado = miembroService.crear(dto);
        return ResponseEntity.created(URI.create("/api/miembros/" + miembroCreado.getId())).body(miembroCreado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MiembroGrupoResponseDTO> update(@PathVariable Long id, @Valid @RequestBody MiembroGrupoRequestDTO dto) {
        return ResponseEntity.ok(miembroService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        miembroService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
