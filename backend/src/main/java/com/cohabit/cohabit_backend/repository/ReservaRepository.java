package com.cohabit.cohabit_backend.repository;

import com.cohabit.cohabit_backend.entity.Reserva;
import com.cohabit.cohabit_backend.entity.EstadoReserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByRecursoId(Long recursoId);
    List<Reserva> findByMiembroGrupoId(Long miembroGrupoId);
    List<Reserva> findByFecha(LocalDate fecha);
    List<Reserva> findByEstado(EstadoReserva estado);
    List<Reserva> findByRecursoIdAndFechaAndEstadoNot(Long recursoId, LocalDate fecha, EstadoReserva estado);
}
