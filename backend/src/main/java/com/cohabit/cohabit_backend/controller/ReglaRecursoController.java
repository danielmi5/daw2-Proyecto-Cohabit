package com.cohabit.cohabit_backend.controller;

import com.cohabit.cohabit_backend.dto.ReglaRecursoRequestDTO;
import com.cohabit.cohabit_backend.dto.ReglaRecursoUpdateDTO;
import com.cohabit.cohabit_backend.dto.ReglaRecursoResponseDTO;
import com.cohabit.cohabit_backend.service.ReglaRecursoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import jakarta.validation.Valid;
import java.net.URI;

@RestController
@RequestMapping("/api/reglas")
public class ReglaRecursoController {

    private final ReglaRecursoService reglaService;

    public ReglaRecursoController(ReglaRecursoService reglaService) {
        this.reglaService = reglaService;
    }

    @GetMapping
    public ResponseEntity<Page<ReglaRecursoResponseDTO>> list(Pageable pageable) {
        return ResponseEntity.ok(reglaService.obtenerTodos(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esReglaEnGrupoMiembro(#id)")
    public ResponseEntity<ReglaRecursoResponseDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(reglaService.obtenerPorId(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esCreadorOAdminRecurso(#dto.recursoId) or @grupoSecurity.esMiembroIdActual(#dto.miembroId)")
    public ResponseEntity<ReglaRecursoResponseDTO> create(@Valid @RequestBody ReglaRecursoRequestDTO dto) {
        ReglaRecursoResponseDTO reglaCreada = reglaService.crear(dto);
        return ResponseEntity.created(URI.create("/api/reglas/" + reglaCreada.getId())).body(reglaCreada);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esCreadorOAdminRegla(#id) or @grupoSecurity.esCreadorDeRegla(#id)")
    public ResponseEntity<ReglaRecursoResponseDTO> update(@PathVariable Long id, @Valid @RequestBody ReglaRecursoUpdateDTO dto) {
        return ResponseEntity.ok(reglaService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @grupoSecurity.esCreadorOAdminRegla(#id) or @grupoSecurity.esCreadorDeRegla(#id)")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        reglaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
