package com.cohabit.cohabit_backend.repository;

import com.cohabit.cohabit_backend.entity.Grupo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
}
