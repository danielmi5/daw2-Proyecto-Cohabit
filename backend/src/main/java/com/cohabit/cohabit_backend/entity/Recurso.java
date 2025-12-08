package com.cohabit.cohabit_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "recursos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recurso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(length = 1000)
    private String descripcion;

    private String fotoRecurso;

    private Integer capacidad;

    private String ubicacion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoRecurso tipo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoRecurso estadoActual;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grupo_id", nullable = false)
    private Grupo grupo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "miembro_grupo_id", nullable = true)
    private MiembroGrupo creador;

    @OneToMany(mappedBy = "recurso", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Reserva> reservas = new ArrayList<>();

    @OneToMany(mappedBy = "recurso", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ReglaRecurso> reglas = new ArrayList<>();

    @Column(nullable = false)
    private LocalDateTime fechaCreacion;

    private LocalDateTime fechaActualizacion;

    @PrePersist
    private void onCreate() {
        fechaCreacion = LocalDateTime.now();
        fechaActualizacion = fechaCreacion;
    }

    @PreUpdate
    private void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }
}
