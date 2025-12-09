package com.cohabit.cohabit_backend.controller;

import com.cohabit.cohabit_backend.dto.ReservaRequestDTO;
import com.cohabit.cohabit_backend.dto.ReservaResponseDTO;
import com.cohabit.cohabit_backend.service.ReservaService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.net.URI;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    private final ReservaService reservaService;

    public ReservaController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @GetMapping
    public ResponseEntity<Page<ReservaResponseDTO>> list(Pageable pageable) {
        return ResponseEntity.ok(reservaService.obtenerTodos(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservaResponseDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(reservaService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<ReservaResponseDTO> create(@Valid @RequestBody ReservaRequestDTO dto) {
        ReservaResponseDTO reservaCreada = reservaService.crear(dto);
        return ResponseEntity.created(URI.create("/api/reservas/" + reservaCreada.getId())).body(reservaCreada);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReservaResponseDTO> update(@PathVariable Long id, @Valid @RequestBody ReservaRequestDTO dto) {
        return ResponseEntity.ok(reservaService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        reservaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
