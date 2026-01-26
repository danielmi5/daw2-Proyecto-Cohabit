package com.cohabit.cohabit_backend.repository;

import com.cohabit.cohabit_backend.entity.Recurso;
import com.cohabit.cohabit_backend.entity.EstadoRecurso;
import com.cohabit.cohabit_backend.entity.TipoRecurso;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RecursoRepository extends JpaRepository<Recurso, Long> {
    List<Recurso> findByGrupoId(Long grupoId);
    List<Recurso> findByEstadoActual(EstadoRecurso estado);
    List<Recurso> findByTipo(TipoRecurso tipo);

    @Query("""
            SELECT r FROM Recurso r
            WHERE (:grupoId IS NULL OR r.grupo.id = :grupoId)
            AND (:tipo IS NULL OR r.tipo = :tipo)
            AND (:estado IS NULL OR r.estadoActual = :estado)
            AND (
                :fecha IS NULL OR :horaInicio IS NULL OR :horaFin IS NULL
                OR NOT EXISTS (
                    SELECT 1 FROM Reserva res
                    WHERE res.recurso = r
                      AND res.fecha = :fecha
                      AND res.estado <> com.cohabit.cohabit_backend.entity.EstadoReserva.CANCELADA
                      AND res.horaInicio < :horaFin
                      AND res.horaFin > :horaInicio
                )
            )
            """)
    Page<Recurso> findByFilters(@Param("grupoId") Long grupoId,
                                @Param("tipo") TipoRecurso tipo,
                                @Param("estado") EstadoRecurso estado,
                                @Param("fecha") LocalDate fecha,
                                @Param("horaInicio") LocalTime horaInicio,
                                @Param("horaFin") LocalTime horaFin,
                                Pageable pageable);

    @Query("SELECT COALESCE(MAX(r.numero), 0) FROM Recurso r WHERE r.grupo.id = :grupoId")
    Integer findMaxNumeroByGrupoId(@Param("grupoId") Long grupoId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM Recurso r WHERE r.id = :id")
    Optional<Recurso> findByIdWithLock(@Param("id") Long id);

    /**
     * Busca un recurso por ID cargando sus reservas de forma eager para evitar problema N+1.
     * Usa @EntityGraph para hacer un JOIN FETCH en una sola query.
     */
    @EntityGraph(attributePaths = {"reservas"})
    @Query("SELECT r FROM Recurso r WHERE r.id = :id")
    Optional<Recurso> findByIdWithReservas(@Param("id") Long id);
}