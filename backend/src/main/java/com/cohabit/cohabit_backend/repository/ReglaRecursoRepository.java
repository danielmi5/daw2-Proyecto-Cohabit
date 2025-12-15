package com.cohabit.cohabit_backend.repository;

import com.cohabit.cohabit_backend.entity.ReglaRecurso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface ReglaRecursoRepository extends JpaRepository<ReglaRecurso, Long> {
    List<ReglaRecurso> findByRecursoId(Long recursoId);

    @Query("SELECT COALESCE(MAX(rr.numero), 0) FROM ReglaRecurso rr WHERE rr.recurso.id = :recursoId")
    Integer findMaxNumeroByRecursoId(@Param("recursoId") Long recursoId);
}
