package com.cohabit.cohabit_backend.repository;

import com.cohabit.cohabit_backend.entity.Grupo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GrupoRepository extends JpaRepository<Grupo, Long> {
    boolean existsByCodigoInvitacion(String codigoInvitacion);
    Optional<Grupo> findByCodigoInvitacion(String codigoInvitacion);

    @Query("""
            SELECT g FROM Grupo g
            WHERE (:nombre IS NULL OR LOWER(g.nombre) LIKE LOWER(CONCAT('%', :nombre, '%')))
            AND (:descripcion IS NULL OR LOWER(g.descripcion) LIKE LOWER(CONCAT('%', :descripcion, '%')))
            AND (:creadorId IS NULL OR g.creador.id = :creadorId)
            """)
    Page<Grupo> findByFilters(@Param("nombre") String nombre, @Param("descripcion") String descripcion, @Param("creadorId") Long creadorId, Pageable pageable);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT g FROM Grupo g WHERE g.id = :id")
    Optional<Grupo> findByIdWithLock(@Param("id") Long id);

    /**
     * Busca un grupo por ID cargando sus recursos de forma eager para evitar problema N+1.
     * Usa @EntityGraph para hacer un JOIN FETCH en una sola query.
     */
    @EntityGraph(attributePaths = {"recursos"})
    @Query("SELECT g FROM Grupo g WHERE g.id = :id")
    Optional<Grupo> findByIdWithRecursos(@Param("id") Long id);
}
