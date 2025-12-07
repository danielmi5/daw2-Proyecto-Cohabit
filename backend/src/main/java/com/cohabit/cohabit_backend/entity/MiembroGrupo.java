package com.cohabit.cohabit_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "miembros_grupo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MiembroGrupo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grupo_id", nullable = false)
    private Grupo grupo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RolGrupo rol;

    @Column(nullable = false)
    private LocalDateTime fechaUnion;

    @PrePersist
    protected void onCreate() {
        fechaUnion = LocalDateTime.now();
    }
}
