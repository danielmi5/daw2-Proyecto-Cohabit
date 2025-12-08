package com.cohabit.cohabit_backend.repository;

import com.cohabit.cohabit_backend.entity.Grupo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GrupoRepository extends JpaRepository<Grupo, Long> {
    boolean existsByCodigoInvitacion(String codigoInvitacion);
    Optional<Grupo> findByCodigoInvitacion(String codigoInvitacion);
}
