package com.cohabit.cohabit_backend.service;

import com.cohabit.cohabit_backend.dto.ReglaRecursoRequestDTO;
import com.cohabit.cohabit_backend.dto.ReglaRecursoResponseDTO;
import com.cohabit.cohabit_backend.entity.Recurso;
import com.cohabit.cohabit_backend.entity.ReglaRecurso;
import com.cohabit.cohabit_backend.entity.TipoRegla;
import com.cohabit.cohabit_backend.exception.EntidadNoEncontradaException;
import com.cohabit.cohabit_backend.exception.ParametroNuloException;
import com.cohabit.cohabit_backend.repository.RecursoRepository;
import com.cohabit.cohabit_backend.repository.ReglaRecursoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReglaRecursoServiceTest {

    @Mock
    private ReglaRecursoRepository reglaRepo;

    @Mock
    private RecursoRepository recursoRepo;

    @InjectMocks
    private ReglaRecursoService reglaRecursoService;

    private ReglaRecurso reglaRecurso;
    private Recurso recurso;
    private ReglaRecursoRequestDTO reglaRecursoRequestDTO;

    @BeforeEach
    void inicializar() {
        recurso = new Recurso();
        recurso.setId(1L);
        recurso.setNombre("nombre");

        reglaRecurso = new ReglaRecurso();
        reglaRecurso.setId(1L);
        reglaRecurso.setTipoRegla(TipoRegla.DURACION_MAX);
        reglaRecurso.setValor("valor");
        reglaRecurso.setDescripcion("descripcion");
        reglaRecurso.setRecurso(recurso);

        reglaRecursoRequestDTO = ReglaRecursoRequestDTO.builder()
                .tipoRegla(TipoRegla.DURACION_MAX)
                .valor("valor")
                .descripcion("descripcion")
                .recursoId(1L)
                .build();
    }

    @Test
    void obtenerPorId() {
        when(reglaRepo.findById(1L)).thenReturn(Optional.of(reglaRecurso));

        ReglaRecursoResponseDTO resultado = reglaRecursoService.obtenerPorId(1L);

        assertNotNull(resultado);
        assertEquals(TipoRegla.DURACION_MAX, resultado.getTipoRegla());
        verify(reglaRepo, times(1)).findById(1L);
    }

    @Test
    void obtenerPorIdNoEncontrado() {
        when(reglaRepo.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntidadNoEncontradaException.class, () -> reglaRecursoService.obtenerPorId(1L));
        verify(reglaRepo, times(1)).findById(1L);
    }

    @Test
    void obtenerTodos() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<ReglaRecurso> page = new PageImpl<>(List.of(reglaRecurso));
        when(reglaRepo.findAll(pageable)).thenReturn(page);

        Page<ReglaRecursoResponseDTO> resultado = reglaRecursoService.obtenerTodos(pageable);

        assertNotNull(resultado);
        assertEquals(1, resultado.getTotalElements());
        verify(reglaRepo, times(1)).findAll(pageable);
    }

    @Test
    void crear() {
        when(recursoRepo.findById(1L)).thenReturn(Optional.of(recurso));
        when(reglaRepo.save(any(ReglaRecurso.class))).thenReturn(reglaRecurso);

        ReglaRecursoResponseDTO resultado = reglaRecursoService.crear(reglaRecursoRequestDTO);

        assertNotNull(resultado);
        assertEquals(TipoRegla.DURACION_MAX, resultado.getTipoRegla());
        verify(reglaRepo, times(1)).save(any(ReglaRecurso.class));
    }

    @Test
    void crearConDtoNulo() {
        assertThrows(ParametroNuloException.class, () -> reglaRecursoService.crear(null));
        verify(reglaRepo, never()).save(any(ReglaRecurso.class));
    }

    @Test
    void crearConRecursoNoEncontrado() {
        when(recursoRepo.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntidadNoEncontradaException.class, () -> reglaRecursoService.crear(reglaRecursoRequestDTO));
        verify(reglaRepo, never()).save(any(ReglaRecurso.class));
    }

    @Test
    void actualizar() {
        ReglaRecursoRequestDTO actualizacion = ReglaRecursoRequestDTO.builder()
                .tipoRegla(TipoRegla.HORARIO_APERTURA)
                .valor("valor2")
                .build();
        when(reglaRepo.findById(1L)).thenReturn(Optional.of(reglaRecurso));
        when(reglaRepo.save(any(ReglaRecurso.class))).thenReturn(reglaRecurso);

        ReglaRecursoResponseDTO resultado = reglaRecursoService.actualizar(1L, actualizacion);

        assertNotNull(resultado);
        verify(reglaRepo, times(1)).save(any(ReglaRecurso.class));
    }

    @Test
    void actualizarNoEncontrado() {
        when(reglaRepo.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntidadNoEncontradaException.class, () -> reglaRecursoService.actualizar(1L, reglaRecursoRequestDTO));
        verify(reglaRepo, never()).save(any(ReglaRecurso.class));
    }

    @Test
    void eliminar() {
        when(reglaRepo.existsById(1L)).thenReturn(true);
        doNothing().when(reglaRepo).deleteById(1L);

        reglaRecursoService.eliminar(1L);

        verify(reglaRepo, times(1)).deleteById(1L);
    }

    @Test
    void eliminarNoEncontrado() {
        when(reglaRepo.existsById(1L)).thenReturn(false);

        assertThrows(EntidadNoEncontradaException.class, () -> reglaRecursoService.eliminar(1L));
        verify(reglaRepo, never()).deleteById(1L);
    }
}
