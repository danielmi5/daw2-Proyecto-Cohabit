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
import java.time.LocalDate;
import java.time.LocalTime;
import com.cohabit.cohabit_backend.entity.TipoRecurso;
import com.cohabit.cohabit_backend.entity.EstadoRecurso;

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

    @GetMapping("/buscar")
    public ResponseEntity<Page<RecursoResponseDTO>> buscarPorFiltros(@RequestParam(name = "grupoId", required = false) Long grupoId, @RequestParam(name = "tipo", required = false) TipoRecurso tipo, @RequestParam(name = "estado", required = false) EstadoRecurso estado, @RequestParam(name = "fecha", required = false) LocalDate fecha, @RequestParam(name = "horaInicio", required = false) LocalTime horaInicio, @RequestParam(name = "horaFin", required = false) LocalTime horaFin, Pageable pageable) {
        return ResponseEntity.ok(recursoService.buscarPorFiltros(grupoId, tipo, estado, fecha, horaInicio, horaFin, pageable));
    }
}
