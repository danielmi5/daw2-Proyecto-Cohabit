package com.cohabit.cohabit_backend.service;

import com.cohabit.cohabit_backend.dto.ReservaRequestDTO;
import com.cohabit.cohabit_backend.dto.ReservaResponseDTO;
import com.cohabit.cohabit_backend.entity.*;
import com.cohabit.cohabit_backend.exception.EntidadNoEncontradaException;
import com.cohabit.cohabit_backend.exception.ParametroNuloException;
import com.cohabit.cohabit_backend.repository.MiembroGrupoRepository;
import com.cohabit.cohabit_backend.repository.RecursoRepository;
import com.cohabit.cohabit_backend.repository.ReservaRepository;
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

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservaServiceTest {

    @Mock
    private ReservaRepository reservaRepo;

    @Mock
    private RecursoRepository recursoRepo;

    @Mock
    private MiembroGrupoRepository miembroRepo;

    @InjectMocks
    private ReservaService reservaService;

    private Reserva reserva;
    private Recurso recurso;
    private MiembroGrupo miembro;
    private ReservaRequestDTO reservaRequestDTO;

    @BeforeEach
    void inicializar() {
        recurso = new Recurso();
        recurso.setId(1L);
        recurso.setNombre("nombre");

        miembro = new MiembroGrupo();
        miembro.setId(1L);
        miembro.setActivo(true);

        reserva = new Reserva();
        reserva.setId(1L);
        reserva.setFecha(LocalDate.of(2025, 12, 15));
        reserva.setHoraInicio(LocalTime.of(10, 0));
        reserva.setHoraFin(LocalTime.of(11, 0));
        reserva.setNotas("notas");
        reserva.setNumPersonas(1);
        reserva.setEstado(EstadoReserva.CONFIRMADA);
        reserva.setRecurso(recurso);
        reserva.setMiembroGrupo(miembro);

        reservaRequestDTO = ReservaRequestDTO.builder()
                .fecha(LocalDate.of(2025, 12, 15))
                .horaInicio(LocalTime.of(10, 0))
                .horaFin(LocalTime.of(11, 0))
                .notas("notas")
                .numPersonas(1)
                .estado(EstadoReserva.CONFIRMADA)
                .recursoId(1L)
                .miembroGrupoId(1L)
                .build();
    }

    @Test
    void obtenerPorId() {
        when(reservaRepo.findById(1L)).thenReturn(Optional.of(reserva));

        ReservaResponseDTO resultado = reservaService.obtenerPorId(1L);

        assertNotNull(resultado);
        assertEquals(EstadoReserva.CONFIRMADA, resultado.getEstado());
        verify(reservaRepo, times(1)).findById(1L);
    }

    @Test
    void obtenerPorIdNoEncontrado() {
        when(reservaRepo.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntidadNoEncontradaException.class, () -> reservaService.obtenerPorId(1L));
        verify(reservaRepo, times(1)).findById(1L);
    }

    @Test
    void obtenerTodos() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Reserva> page = new PageImpl<>(List.of(reserva));
        when(reservaRepo.findAll(pageable)).thenReturn(page);

        Page<ReservaResponseDTO> resultado = reservaService.obtenerTodos(pageable);

        assertNotNull(resultado);
        assertEquals(1, resultado.getTotalElements());
        verify(reservaRepo, times(1)).findAll(pageable);
    }

    @Test
    void crear() {
        when(miembroRepo.findById(1L)).thenReturn(Optional.of(miembro));
        when(recursoRepo.findById(1L)).thenReturn(Optional.of(recurso));
        when(reservaRepo.findByRecursoIdAndFechaAndEstadoNot(1L, LocalDate.of(2025, 12, 15), EstadoReserva.CANCELADA)).thenReturn(List.of());
        when(reservaRepo.save(any(Reserva.class))).thenReturn(reserva);

        ReservaResponseDTO resultado = reservaService.crear(reservaRequestDTO);

        assertNotNull(resultado);
        assertEquals(EstadoReserva.CONFIRMADA, resultado.getEstado());
        verify(reservaRepo, times(1)).save(any(Reserva.class));
    }

    @Test
    void crearConDtoNulo() {
        assertThrows(ParametroNuloException.class, () -> reservaService.crear(null));
        verify(reservaRepo, never()).save(any(Reserva.class));
    }

    @Test
    void crearConMiembroInactivo() {
        miembro.setActivo(false);
        when(miembroRepo.findById(1L)).thenReturn(Optional.of(miembro));
        when(recursoRepo.findById(1L)).thenReturn(Optional.of(recurso));

        assertThrows(IllegalStateException.class, () -> reservaService.crear(reservaRequestDTO));
        verify(reservaRepo, never()).save(any(Reserva.class));
    }

    @Test
    void crearConHorarioOcupado() {
        Reserva reservaExistente = new Reserva();
        reservaExistente.setId(2L);
        reservaExistente.setFecha(LocalDate.of(2025, 12, 15));
        reservaExistente.setHoraInicio(LocalTime.of(10, 0));
        reservaExistente.setHoraFin(LocalTime.of(11, 0));

        when(miembroRepo.findById(1L)).thenReturn(Optional.of(miembro));
        when(recursoRepo.findById(1L)).thenReturn(Optional.of(recurso));
        when(reservaRepo.findByRecursoIdAndFechaAndEstadoNot(1L, LocalDate.of(2025, 12, 15), EstadoReserva.CANCELADA)).thenReturn(List.of(reservaExistente));

        assertThrows(IllegalStateException.class, () -> reservaService.crear(reservaRequestDTO));
        verify(reservaRepo, never()).save(any(Reserva.class));
    }

    @Test
    void actualizar() {
        ReservaRequestDTO actualizacion = ReservaRequestDTO.builder()
                .fecha(LocalDate.of(2025, 12, 16))
                .horaInicio(LocalTime.of(12, 0))
                .horaFin(LocalTime.of(13, 0))
                .build();
        when(reservaRepo.findById(1L)).thenReturn(Optional.of(reserva));
        when(reservaRepo.findByRecursoIdAndFechaAndEstadoNot(1L, LocalDate.of(2025, 12, 16), EstadoReserva.CANCELADA)).thenReturn(List.of());
        when(reservaRepo.save(any(Reserva.class))).thenReturn(reserva);

        ReservaResponseDTO resultado = reservaService.actualizar(1L, actualizacion);

        assertNotNull(resultado);
        verify(reservaRepo, times(1)).save(any(Reserva.class));
    }

    @Test
    void actualizarNoEncontrado() {
        when(reservaRepo.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntidadNoEncontradaException.class, () -> reservaService.actualizar(1L, reservaRequestDTO));
        verify(reservaRepo, never()).save(any(Reserva.class));
    }

    @Test
    void eliminar() {
        when(reservaRepo.existsById(1L)).thenReturn(true);
        doNothing().when(reservaRepo).deleteById(1L);

        reservaService.eliminar(1L);

        verify(reservaRepo, times(1)).deleteById(1L);
    }

    @Test
    void eliminarNoEncontrado() {
        when(reservaRepo.existsById(1L)).thenReturn(false);

        assertThrows(EntidadNoEncontradaException.class, () -> reservaService.eliminar(1L));
        verify(reservaRepo, never()).deleteById(1L);
    }

    @Test
    void buscarPorFiltros() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Reserva> page = new PageImpl<>(List.of(reserva));
        when(reservaRepo.findByFilters(1L, 1L, LocalDate.of(2025, 12, 15), EstadoReserva.CONFIRMADA, pageable)).thenReturn(page);

        Page<ReservaResponseDTO> resultado = reservaService.buscarPorFiltros(1L, 1L, LocalDate.of(2025, 12, 15), EstadoReserva.CONFIRMADA, pageable);

        assertNotNull(resultado);
        assertEquals(1, resultado.getTotalElements());
        verify(reservaRepo, times(1)).findByFilters(1L, 1L, LocalDate.of(2025, 12, 15), EstadoReserva.CONFIRMADA, pageable);
    }
}
