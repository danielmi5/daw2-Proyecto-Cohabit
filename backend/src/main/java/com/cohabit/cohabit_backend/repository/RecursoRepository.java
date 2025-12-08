package com.cohabit.cohabit_backend.repository;

import com.cohabit.cohabit_backend.entity.Recurso;
import com.cohabit.cohabit_backend.entity.EstadoRecurso;
import com.cohabit.cohabit_backend.entity.TipoRecurso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecursoRepository extends JpaRepository<Recurso, Long> {
    List<Recurso> findByGrupoId(Long grupoId);
    List<Recurso> findByEstadoActual(EstadoRecurso estado);
    List<Recurso> findByTipo(TipoRecurso tipo);
}