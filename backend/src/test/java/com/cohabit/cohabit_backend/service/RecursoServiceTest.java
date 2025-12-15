package com.cohabit.cohabit_backend.service;

import com.cohabit.cohabit_backend.dto.RecursoRequestDTO;
import com.cohabit.cohabit_backend.dto.RecursoResponseDTO;
import com.cohabit.cohabit_backend.entity.Grupo;
import com.cohabit.cohabit_backend.entity.MiembroGrupo;
import com.cohabit.cohabit_backend.entity.Recurso;
import com.cohabit.cohabit_backend.entity.TipoRecurso;
import com.cohabit.cohabit_backend.exception.EntidadNoEncontradaException;
import com.cohabit.cohabit_backend.exception.ParametroNuloException;
import com.cohabit.cohabit_backend.repository.GrupoRepository;
import com.cohabit.cohabit_backend.repository.MiembroGrupoRepository;
import com.cohabit.cohabit_backend.repository.RecursoRepository;
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
class RecursoServiceTest {

    @Mock
    private RecursoRepository recursoRepo;

    @Mock
    private GrupoRepository grupoRepo;

    @Mock
    private MiembroGrupoRepository miembroRepo;

    @InjectMocks
    private RecursoService recursoService;

    private Recurso recurso;
    private Grupo grupo;
    private MiembroGrupo miembro;
    private RecursoRequestDTO recursoRequestDTO;

    @BeforeEach
    void inicializar() {
        grupo = new Grupo();
        grupo.setId(1L);
        grupo.setNombre("nombre");

        miembro = new MiembroGrupo();
        miembro.setId(1L);

        recurso = new Recurso();
        recurso.setId(1L);
        recurso.setNombre("nombre");
        recurso.setDescripcion("descripcion");
        recurso.setCapacidad(1);
        recurso.setUbicacion("ubicacion");
        recurso.setGrupo(grupo);
        recurso.setCreador(miembro);

        recursoRequestDTO = RecursoRequestDTO.builder()
                .nombre("nombre")
                .descripcion("descripcion")
                .capacidad(1)
                .ubicacion("ubicacion")
                .grupoId(1L)
                .creadorId(1L)
                .build();
    }

    @Test
    void obtenerPorId() {
        when(recursoRepo.findById(1L)).thenReturn(Optional.of(recurso));

        RecursoResponseDTO resultado = recursoService.obtenerPorId(1L);

        assertNotNull(resultado);
        assertEquals("nombre", resultado.getNombre());
        verify(recursoRepo, times(1)).findById(1L);
    }

    @Test
    void obtenerPorIdNoEncontrado() {
        when(recursoRepo.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntidadNoEncontradaException.class, () -> recursoService.obtenerPorId(1L));
        verify(recursoRepo, times(1)).findById(1L);
    }

    @Test
    void obtenerTodos() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Recurso> page = new PageImpl<>(List.of(recurso));
        when(recursoRepo.findAll(pageable)).thenReturn(page);

        Page<RecursoResponseDTO> resultado = recursoService.obtenerTodos(pageable);

        assertNotNull(resultado);
        assertEquals(1, resultado.getTotalElements());
        verify(recursoRepo, times(1)).findAll(pageable);
    }

    @Test
    void crear() {
        when(grupoRepo.findById(1L)).thenReturn(Optional.of(grupo));
        when(miembroRepo.findById(1L)).thenReturn(Optional.of(miembro));
        when(recursoRepo.save(any(Recurso.class))).thenReturn(recurso);

        RecursoResponseDTO resultado = recursoService.crear(recursoRequestDTO);

        assertNotNull(resultado);
        assertEquals("nombre", resultado.getNombre());
        verify(recursoRepo, times(1)).save(any(Recurso.class));
    }

    @Test
    void crearConDtoNulo() {
        assertThrows(ParametroNuloException.class, () -> recursoService.crear(null));
        verify(recursoRepo, never()).save(any(Recurso.class));
    }

    @Test
    void crearConCapacidadInvalida() {
        recursoRequestDTO.setCapacidad(0);
        when(grupoRepo.findById(1L)).thenReturn(Optional.of(grupo));
        when(miembroRepo.findById(1L)).thenReturn(Optional.of(miembro));

        assertThrows(ParametroNuloException.class, () -> recursoService.crear(recursoRequestDTO));
        verify(recursoRepo, never()).save(any(Recurso.class));
    }

    @Test
    void actualizar() {
        RecursoRequestDTO actualizacion = RecursoRequestDTO.builder()
                .nombre("nombre2")
                .descripcion("descripcion2")
                .build();
        when(recursoRepo.findById(1L)).thenReturn(Optional.of(recurso));
        when(recursoRepo.save(any(Recurso.class))).thenReturn(recurso);

        RecursoResponseDTO resultado = recursoService.actualizar(1L, actualizacion);

        assertNotNull(resultado);
        verify(recursoRepo, times(1)).save(any(Recurso.class));
    }

    @Test
    void actualizarNoEncontrado() {
        when(recursoRepo.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntidadNoEncontradaException.class, () -> recursoService.actualizar(1L, recursoRequestDTO));
        verify(recursoRepo, never()).save(any(Recurso.class));
    }

    @Test
    void eliminar() {
        when(recursoRepo.existsById(1L)).thenReturn(true);
        doNothing().when(recursoRepo).deleteById(1L);

        recursoService.eliminar(1L);

        verify(recursoRepo, times(1)).deleteById(1L);
    }

    @Test
    void eliminarNoEncontrado() {
        when(recursoRepo.existsById(1L)).thenReturn(false);

        assertThrows(EntidadNoEncontradaException.class, () -> recursoService.eliminar(1L));
        verify(recursoRepo, never()).deleteById(1L);
    }

    @Test
    void buscarPorFiltros() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Recurso> page = new PageImpl<>(List.of(recurso));
        when(recursoRepo.findByFilters(1L, TipoRecurso.HABITACION, null, null, null, null, pageable)).thenReturn(page);

        Page<RecursoResponseDTO> resultado = recursoService.buscarPorFiltros(1L, TipoRecurso.HABITACION, null, null, null, null, pageable);

        assertNotNull(resultado);
        assertEquals(1, resultado.getTotalElements());
        verify(recursoRepo, times(1)).findByFilters(1L, TipoRecurso.HABITACION, null, null, null, null, pageable);
    }
}
