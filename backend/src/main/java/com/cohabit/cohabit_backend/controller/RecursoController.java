package com.cohabit.cohabit_backend.controller;

import com.cohabit.cohabit_backend.dto.RecursoRequestDTO;
import com.cohabit.cohabit_backend.dto.RecursoResponseDTO;
import com.cohabit.cohabit_backend.service.RecursoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.net.URI;

@RestController
@RequestMapping("/api/recursos")
public class RecursoController {

    private final RecursoService recursoService;

    public RecursoController(RecursoService recursoService) {
        this.recursoService = recursoService;
    }

    @GetMapping
    public ResponseEntity<Page<RecursoResponseDTO>> list(Pageable pageable) {
        return ResponseEntity.ok(recursoService.obtenerTodos(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecursoResponseDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(recursoService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<RecursoResponseDTO> create(@Valid @RequestBody RecursoRequestDTO dto) {
        RecursoResponseDTO recursoCreado = recursoService.crear(dto);
        return ResponseEntity.created(URI.create("/api/recursos/" + recursoCreado.getId())).body(recursoCreado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecursoResponseDTO> update(@PathVariable Long id, @Valid @RequestBody RecursoRequestDTO dto) {
        return ResponseEntity.ok(recursoService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        recursoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
