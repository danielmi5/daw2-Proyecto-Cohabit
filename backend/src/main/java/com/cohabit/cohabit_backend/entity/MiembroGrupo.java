package com.cohabit.cohabit_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grupo_id", nullable = false)
    private Grupo grupo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RolGrupo rol;

    @Column(nullable = false)
    private LocalDateTime fechaUnion;

    @OneToMany(mappedBy = "creador")
    @Builder.Default
    private List<Recurso> recursos = new ArrayList<>();

    @OneToMany(mappedBy = "miembroGrupo", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Reserva> reservas = new ArrayList<>();

    @Column(nullable = false)
    @Builder.Default
    private boolean activo = true;

    @PrePersist
    protected void onCreate() {
        fechaUnion = LocalDateTime.now();
    }
}
