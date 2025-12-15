package com.cohabit.cohabit_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.cohabit.cohabit_backend.entity.MiembroGrupo;

@Entity
@Table(name = "reglas_recurso", uniqueConstraints = @UniqueConstraint(columnNames = {"recurso_id", "numero"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReglaRecurso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoRegla tipoRegla;

    @Column(nullable = false)
    private String valor;

    @Column(length = 1000)
    private String descripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recurso_id", nullable = false)
    private Recurso recurso;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "miembro_grupo_id", nullable = false)
    private MiembroGrupo creador;

    @Column(nullable = false)
    private Integer numero;

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
