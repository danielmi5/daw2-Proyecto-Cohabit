package com.cohabit.cohabit_backend.service;

import com.cohabit.cohabit_backend.dto.MiembroGrupoRequestDTO;
import com.cohabit.cohabit_backend.dto.MiembroGrupoUpdateDTO;
import com.cohabit.cohabit_backend.dto.MiembroGrupoResponseDTO;
import com.cohabit.cohabit_backend.entity.Grupo;
import com.cohabit.cohabit_backend.entity.MiembroGrupo;
import com.cohabit.cohabit_backend.entity.RolGrupo;
import com.cohabit.cohabit_backend.entity.Usuario;
import com.cohabit.cohabit_backend.exception.EntidadNoEncontradaException;
import com.cohabit.cohabit_backend.exception.EntidadYaExisteException;
import com.cohabit.cohabit_backend.exception.ParametroNuloException;
import com.cohabit.cohabit_backend.repository.GrupoRepository;
import com.cohabit.cohabit_backend.repository.MiembroGrupoRepository;
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
class MiembroGrupoServiceTest {

    @Mock
    private MiembroGrupoRepository miembroRepo;

    @Mock
    private GrupoRepository grupoRepo;

    @Mock
    private UsuarioRepository usuarioRepo;

    @InjectMocks
    private MiembroGrupoService miembroGrupoService;

    private MiembroGrupo miembroGrupo;
    private Usuario usuario;
    private Grupo grupo;
    private MiembroGrupoRequestDTO miembroGrupoRequestDTO;

    @BeforeEach
    void inicializar() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("nombre");

        grupo = new Grupo();
        grupo.setId(1L);
        grupo.setNombre("nombre");

        miembroGrupo = new MiembroGrupo();
        miembroGrupo.setId(1L);
        miembroGrupo.setUsuario(usuario);
        miembroGrupo.setGrupo(grupo);
        miembroGrupo.setRol(RolGrupo.MIEMBRO);
        miembroGrupo.setActivo(true);

        miembroGrupoRequestDTO = MiembroGrupoRequestDTO.builder()
                .usuarioId(1L)
                .grupoId(1L)
                .rol(RolGrupo.MIEMBRO)
                .activo(true)
                .build();
    }

    @Test
    void obtenerPorId() {
        when(miembroRepo.findById(1L)).thenReturn(Optional.of(miembroGrupo));

        MiembroGrupoResponseDTO resultado = miembroGrupoService.obtenerPorId(1L);

        assertNotNull(resultado);
        assertEquals(RolGrupo.MIEMBRO, resultado.getRol());
        verify(miembroRepo, times(1)).findById(1L);
    }

    @Test
    void obtenerPorIdNoEncontrado() {
        when(miembroRepo.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntidadNoEncontradaException.class, () -> miembroGrupoService.obtenerPorId(1L));
        verify(miembroRepo, times(1)).findById(1L);
    }

    @Test
    void obtenerTodos() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<MiembroGrupo> page = new PageImpl<>(List.of(miembroGrupo));
        when(miembroRepo.findAll(pageable)).thenReturn(page);

        Page<MiembroGrupoResponseDTO> resultado = miembroGrupoService.obtenerTodos(pageable);

        assertNotNull(resultado);
        assertEquals(1, resultado.getTotalElements());
        verify(miembroRepo, times(1)).findAll(pageable);
    }

    @Test
    void crear() {
        when(grupoRepo.findById(1L)).thenReturn(Optional.of(grupo));
        when(usuarioRepo.findById(1L)).thenReturn(Optional.of(usuario));
        when(miembroRepo.existsByUsuarioIdAndGrupoId(1L, 1L)).thenReturn(false);
        when(miembroRepo.save(any(MiembroGrupo.class))).thenReturn(miembroGrupo);

        MiembroGrupoResponseDTO resultado = miembroGrupoService.crear(miembroGrupoRequestDTO);

        assertNotNull(resultado);
        assertEquals(RolGrupo.MIEMBRO, resultado.getRol());
        verify(miembroRepo, times(1)).save(any(MiembroGrupo.class));
    }

    @Test
    void crearConDtoNulo() {
        assertThrows(ParametroNuloException.class, () -> miembroGrupoService.crear(null));
        verify(miembroRepo, never()).save(any(MiembroGrupo.class));
    }

    @Test
    void crearConMiembroYaExistente() {
        when(grupoRepo.findById(1L)).thenReturn(Optional.of(grupo));
        when(usuarioRepo.findById(1L)).thenReturn(Optional.of(usuario));
        when(miembroRepo.existsByUsuarioIdAndGrupoId(1L, 1L)).thenReturn(true);

        assertThrows(EntidadYaExisteException.class, () -> miembroGrupoService.crear(miembroGrupoRequestDTO));
        verify(miembroRepo, never()).save(any(MiembroGrupo.class));
    }

    @Test
    void actualizar() {
        MiembroGrupoUpdateDTO actualizacion = MiembroGrupoUpdateDTO.builder()
                .rol(RolGrupo.ADMIN)
                .activo(false)
                .build();
        when(miembroRepo.findById(1L)).thenReturn(Optional.of(miembroGrupo));
        when(miembroRepo.save(any(MiembroGrupo.class))).thenReturn(miembroGrupo);

        MiembroGrupoResponseDTO resultado = miembroGrupoService.actualizar(1L, actualizacion);

        assertNotNull(resultado);
        verify(miembroRepo, times(1)).save(any(MiembroGrupo.class));
    }

    @Test
    void actualizarNoEncontrado() {
        when(miembroRepo.findById(1L)).thenReturn(Optional.empty());

        MiembroGrupoUpdateDTO dto = MiembroGrupoUpdateDTO.builder().activo(true).build();
        assertThrows(EntidadNoEncontradaException.class, () -> miembroGrupoService.actualizar(1L, dto));
        verify(miembroRepo, never()).save(any(MiembroGrupo.class));
    }

    @Test
    void eliminar() {
        when(miembroRepo.existsById(1L)).thenReturn(true);
        doNothing().when(miembroRepo).deleteById(1L);

        miembroGrupoService.eliminar(1L);

        verify(miembroRepo, times(1)).deleteById(1L);
    }

    @Test
    void eliminarNoEncontrado() {
        when(miembroRepo.existsById(1L)).thenReturn(false);

        assertThrows(EntidadNoEncontradaException.class, () -> miembroGrupoService.eliminar(1L));
        verify(miembroRepo, never()).deleteById(1L);
    }
}
