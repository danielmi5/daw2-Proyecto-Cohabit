package com.cohabit.cohabit_backend.repository;

import com.cohabit.cohabit_backend.entity.Reserva;
import com.cohabit.cohabit_backend.entity.EstadoReserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    @Query("""
            SELECT r FROM Reserva r
            WHERE (:recursoId IS NULL OR r.recurso.id = :recursoId)
            AND (:usuarioId IS NULL OR r.miembroGrupo.usuario.id = :usuarioId)
            AND (:fecha IS NULL OR r.fecha = :fecha)
            AND (:estado IS NULL OR r.estado = :estado)
            """)
    Page<Reserva> findByFilters(@Param("recursoId") Long recursoId, @Param("usuarioId") Long usuarioId, @Param("fecha") LocalDate fecha, @Param("estado") EstadoReserva estado, Pageable pageable);

    @Query("SELECT COALESCE(MAX(r.numero), 0) FROM Reserva r WHERE r.recurso.id = :recursoId")
    Integer findMaxNumeroByRecursoId(@Param("recursoId") Long recursoId);
}
