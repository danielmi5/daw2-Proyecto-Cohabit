package com.cohabit.cohabit_backend.service;

import com.cohabit.cohabit_backend.dto.GrupoRequestDTO;
import com.cohabit.cohabit_backend.dto.GrupoUpdateDTO;
import com.cohabit.cohabit_backend.dto.GrupoResponseDTO;
import com.cohabit.cohabit_backend.dto.MiembroGrupoRequestDTO;
import com.cohabit.cohabit_backend.entity.Grupo;
import com.cohabit.cohabit_backend.entity.RolGrupo;
import com.cohabit.cohabit_backend.entity.Usuario;
import com.cohabit.cohabit_backend.exception.EntidadNoEncontradaException;
import com.cohabit.cohabit_backend.exception.ParametroNuloException;
import com.cohabit.cohabit_backend.repository.GrupoRepository;
import com.cohabit.cohabit_backend.repository.UsuarioRepository;
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
class GrupoServiceTest {

    @Mock
    private GrupoRepository grupoRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private MiembroGrupoService miembroGrupoService;

    @InjectMocks
    private GrupoService grupoService;

    private Grupo grupo;
    private Usuario usuario;
    private GrupoRequestDTO grupoRequestDTO;

    @BeforeEach
    void inicializar() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("nombre");

        grupo = new Grupo();
        grupo.setId(1L);
        grupo.setNombre("nombre");
        grupo.setDireccion("direccion");
        grupo.setDescripcion("descripcion");
        grupo.setCreador(usuario);
        grupo.setCodigoInvitacion("CODIGO");

        grupoRequestDTO = GrupoRequestDTO.builder()
                .nombre("nombre")
                .direccion("direccion")
                .descripcion("descripcion")
                .creadorId(1L)
                .build();
    }

    @Test
    void obtenerPorId() {
        when(grupoRepository.findById(1L)).thenReturn(Optional.of(grupo));

        GrupoResponseDTO resultado = grupoService.obtenerPorId(1L);

        assertNotNull(resultado);
        assertEquals("nombre", resultado.getNombre());
        verify(grupoRepository, times(1)).findById(1L);
    }

    @Test
    void obtenerPorIdNoEncontrado() {
        when(grupoRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntidadNoEncontradaException.class, () -> grupoService.obtenerPorId(1L));
        verify(grupoRepository, times(1)).findById(1L);
    }

    @Test
    void obtenerTodos() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Grupo> page = new PageImpl<>(List.of(grupo));
        when(grupoRepository.findAll(pageable)).thenReturn(page);

        Page<GrupoResponseDTO> resultado = grupoService.obtenerTodos(pageable);

        assertNotNull(resultado);
        assertEquals(1, resultado.getTotalElements());
        verify(grupoRepository, times(1)).findAll(pageable);
    }

    @Test
    void crear() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(grupoRepository.save(any(Grupo.class))).thenReturn(grupo);
        when(grupoRepository.existsByCodigoInvitacion(anyString())).thenReturn(false);

        GrupoResponseDTO resultado = grupoService.crear(grupoRequestDTO);

        assertNotNull(resultado);
        assertEquals("nombre", resultado.getNombre());
        verify(grupoRepository, times(1)).save(any(Grupo.class));
        verify(miembroGrupoService, times(1)).crear(any(MiembroGrupoRequestDTO.class));
    }

    @Test
    void crearConDtoNulo() {
        assertThrows(ParametroNuloException.class, () -> grupoService.crear(null));
        verify(grupoRepository, never()).save(any(Grupo.class));
    }

    @Test
    void crearConCreadorNoEncontrado() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntidadNoEncontradaException.class, () -> grupoService.crear(grupoRequestDTO));
        verify(grupoRepository, never()).save(any(Grupo.class));
    }

    @Test
    void actualizar() {
        GrupoUpdateDTO actualizacion = GrupoUpdateDTO.builder()
                .nombre("nombre2")
                .direccion("direccion2")
                .build();
        when(grupoRepository.findById(1L)).thenReturn(Optional.of(grupo));
        when(grupoRepository.save(any(Grupo.class))).thenReturn(grupo);

        GrupoResponseDTO resultado = grupoService.actualizar(1L, actualizacion);

        assertNotNull(resultado);
        verify(grupoRepository, times(1)).save(any(Grupo.class));
    }

    @Test
    void actualizarNoEncontrado() {
        when(grupoRepository.findById(1L)).thenReturn(Optional.empty());

        GrupoUpdateDTO dto = GrupoUpdateDTO.builder().nombre("x").build();
        assertThrows(EntidadNoEncontradaException.class, () -> grupoService.actualizar(1L, dto));
        verify(grupoRepository, never()).save(any(Grupo.class));
    }

    @Test
    void eliminar() {
        when(grupoRepository.existsById(1L)).thenReturn(true);
        doNothing().when(grupoRepository).deleteById(1L);

        grupoService.eliminar(1L);

        verify(grupoRepository, times(1)).deleteById(1L);
    }

    @Test
    void eliminarNoEncontrado() {
        when(grupoRepository.existsById(1L)).thenReturn(false);

        assertThrows(EntidadNoEncontradaException.class, () -> grupoService.eliminar(1L));
        verify(grupoRepository, never()).deleteById(1L);
    }

    @Test
    void buscarPorFiltros() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Grupo> page = new PageImpl<>(List.of(grupo));
        when(grupoRepository.findByFilters("nombre", "descripcion", 1L, pageable)).thenReturn(page);

        Page<GrupoResponseDTO> resultado = grupoService.buscarPorFiltros("nombre", "descripcion", 1L, pageable);

        assertNotNull(resultado);
        assertEquals(1, resultado.getTotalElements());
        verify(grupoRepository, times(1)).findByFilters("nombre", "descripcion", 1L, pageable);
    }
}
