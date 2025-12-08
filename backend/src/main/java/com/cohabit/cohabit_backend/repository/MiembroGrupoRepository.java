package com.cohabit.cohabit_backend.repository;

import com.cohabit.cohabit_backend.entity.MiembroGrupo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MiembroGrupoRepository extends JpaRepository<MiembroGrupo, Long> {
    List<MiembroGrupo> findByGrupoId(Long grupoId);
    List<MiembroGrupo> findByGrupoIdAndActivo(Long grupoId, boolean activo);
    boolean existsByUsuarioIdAndGrupoId(Long usuarioId, Long grupoId);
}
