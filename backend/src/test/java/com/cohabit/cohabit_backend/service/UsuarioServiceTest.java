package com.cohabit.cohabit_backend.service;

import com.cohabit.cohabit_backend.dto.UsuarioRequestDTO;
import com.cohabit.cohabit_backend.dto.UsuarioResponseDTO;
import com.cohabit.cohabit_backend.entity.Usuario;
import com.cohabit.cohabit_backend.exception.EntidadNoEncontradaException;
import com.cohabit.cohabit_backend.exception.EntidadYaExisteException;
import com.cohabit.cohabit_backend.exception.ParametroNuloException;
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
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepo;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuario;
    private UsuarioRequestDTO usuarioRequestDTO;

    @BeforeEach
    void inicializar() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("nombre");
        usuario.setApellidos("apellidos");
        usuario.setEmail("email");
        usuario.setFotoPerfil("fotoPerfil");

        usuarioRequestDTO = UsuarioRequestDTO.builder()
                .nombre("nombre")
                .apellidos("apellidos")
                .email("email")
                .fotoPerfil("fotoPerfil")
                .build();
    }

    @Test
    void obtenerPorId() {
        when(usuarioRepo.findById(1L)).thenReturn(Optional.of(usuario));

        UsuarioResponseDTO resultado = usuarioService.obtenerPorId(1L);

        assertNotNull(resultado);
        assertEquals("nombre", resultado.getNombre());
        verify(usuarioRepo, times(1)).findById(1L);
    }

    @Test
    void obtenerPorIdNoEncontrado() {
        when(usuarioRepo.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntidadNoEncontradaException.class, () -> usuarioService.obtenerPorId(1L));
        verify(usuarioRepo, times(1)).findById(1L);
    }

    @Test
    void obtenerTodos() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Usuario> page = new PageImpl<>(List.of(usuario));
        when(usuarioRepo.findAll(pageable)).thenReturn(page);

        Page<UsuarioResponseDTO> resultado = usuarioService.obtenerTodos(pageable);

        assertNotNull(resultado);
        assertEquals(1, resultado.getTotalElements());
        verify(usuarioRepo, times(1)).findAll(pageable);
    }

    @Test
    void crear() {
        when(usuarioRepo.existsByEmail("email")).thenReturn(false);
        when(usuarioRepo.save(any(Usuario.class))).thenReturn(usuario);

        UsuarioResponseDTO resultado = usuarioService.crear(usuarioRequestDTO);

        assertNotNull(resultado);
        assertEquals("nombre", resultado.getNombre());
        verify(usuarioRepo, times(1)).save(any(Usuario.class));
    }

    @Test
    void crearConEmailExistente() {
        when(usuarioRepo.existsByEmail("email")).thenReturn(true);

        assertThrows(EntidadYaExisteException.class, () -> usuarioService.crear(usuarioRequestDTO));
        verify(usuarioRepo, never()).save(any(Usuario.class));
    }

    @Test
    void crearConDtoNulo() {
        assertThrows(ParametroNuloException.class, () -> usuarioService.crear(null));
        verify(usuarioRepo, never()).save(any(Usuario.class));
    }

    @Test
    void actualizar() {
        UsuarioRequestDTO actualizacion = UsuarioRequestDTO.builder()
                .nombre("nombre2")
                .apellidos("apellidos2")
                .build();
        when(usuarioRepo.findById(1L)).thenReturn(Optional.of(usuario));
        when(usuarioRepo.save(any(Usuario.class))).thenReturn(usuario);

        UsuarioResponseDTO resultado = usuarioService.actualizar(1L, actualizacion);

        assertNotNull(resultado);
        verify(usuarioRepo, times(1)).save(any(Usuario.class));
    }

    @Test
    void actualizarNoEncontrado() {
        when(usuarioRepo.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntidadNoEncontradaException.class, () -> usuarioService.actualizar(1L, usuarioRequestDTO));
        verify(usuarioRepo, never()).save(any(Usuario.class));
    }

    @Test
    void eliminar() {
        when(usuarioRepo.existsById(1L)).thenReturn(true);
        doNothing().when(usuarioRepo).deleteById(1L);

        usuarioService.eliminar(1L);

        verify(usuarioRepo, times(1)).deleteById(1L);
    }

    @Test
    void eliminarNoEncontrado() {
        when(usuarioRepo.existsById(1L)).thenReturn(false);

        assertThrows(EntidadNoEncontradaException.class, () -> usuarioService.eliminar(1L));
        verify(usuarioRepo, never()).deleteById(1L);
    }
}
