package com.cohabit.cohabit_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reglas_recurso")
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recurso_id", nullable = false)
    private Recurso recurso;
}
