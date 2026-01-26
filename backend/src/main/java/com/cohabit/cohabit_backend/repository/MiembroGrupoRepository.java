package com.cohabit.cohabit_backend.repository;

import com.cohabit.cohabit_backend.entity.MiembroGrupo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MiembroGrupoRepository extends JpaRepository<MiembroGrupo, Long> {
    List<MiembroGrupo> findByGrupoId(Long grupoId);
    List<MiembroGrupo> findByGrupoIdAndActivo(Long grupoId, boolean activo);
    boolean existsByUsuarioIdAndGrupoId(Long usuarioId, Long grupoId);
    boolean existsByUsuarioId(Long usuarioId);
    Optional<MiembroGrupo> findByUsuarioId(Long usuarioId);
    Optional<MiembroGrupo> findByUsuarioIdAndGrupoId(Long usuarioId, Long grupoId);

    /**
     * Busca un miembro por ID cargando sus reservas de forma eager para evitar problema N+1.
     * Usa @EntityGraph para hacer un JOIN FETCH en una sola query.
     */
    @EntityGraph(attributePaths = {"reservas"})
    @Query("SELECT m FROM MiembroGrupo m WHERE m.id = :id")
    Optional<MiembroGrupo> findByIdWithReservas(@Param("id") Long id);
}
