package com.cohabit.cohabit_backend.repository;

import com.cohabit.cohabit_backend.entity.ReglaRecurso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReglaRecursoRepository extends JpaRepository<ReglaRecurso, Long> {
    List<ReglaRecurso> findByRecursoId(Long recursoId);
}
