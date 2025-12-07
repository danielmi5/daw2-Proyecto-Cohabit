package com.cohabit.cohabit_backend.repository;

import com.cohabit.cohabit_backend.entity.MiembroGrupo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MiembroGrupoRepository extends JpaRepository<MiembroGrupo, Long> {

}
