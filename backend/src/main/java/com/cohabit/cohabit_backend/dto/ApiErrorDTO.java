package com.cohabit.cohabit_backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiErrorDTO {
    private LocalDateTime timestamp;
    private int numEstado;
    private String error;
    private String mensaje;
    private String descripcion;
    private String path;
}