package com.cohabit.cohabit_backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioResponseDTO {
    private Long id;
    private String nombre;
    private String apellidos;
    private String email;
    private String fotoPerfil;
    private String pais;
    private String ciudad;
    private String telefono;
    private LocalDateTime fechaRegistro;
    private Long miembroGrupoId;
}
