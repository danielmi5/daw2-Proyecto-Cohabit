package com.cohabit.cohabit_backend.controller;

import com.cohabit.cohabit_backend.dto.GrupoRequestDTO;
import com.cohabit.cohabit_backend.dto.GrupoResponseDTO;
import com.cohabit.cohabit_backend.service.GrupoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.net.URI;

@RestController
@RequestMapping("/api/grupos")
public class GrupoController {

    private final GrupoService grupoService;

    public GrupoController(GrupoService grupoService) {
        this.grupoService = grupoService;
    }

    @GetMapping
    public ResponseEntity<Page<GrupoResponseDTO>> list(Pageable pageable) {
        return ResponseEntity.ok(grupoService.obtenerTodos(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GrupoResponseDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(grupoService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<GrupoResponseDTO> create(@Valid @RequestBody GrupoRequestDTO dto) {
        GrupoResponseDTO grupoCreado = grupoService.crear(dto);
        return ResponseEntity.created(URI.create("/api/grupos/" + grupoCreado.getId())).body(grupoCreado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GrupoResponseDTO> update(@PathVariable Long id, @Valid @RequestBody GrupoRequestDTO dto) {
        return ResponseEntity.ok(grupoService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        grupoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
