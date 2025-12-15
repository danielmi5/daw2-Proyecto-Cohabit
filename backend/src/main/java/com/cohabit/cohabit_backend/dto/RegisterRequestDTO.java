package com.cohabit.cohabit_backend.dto;

import lombok.Data;

@Data
public class RegisterRequestDTO {
    private String nombre;
    private String apellidos;
    private String email;
    private String password;
}
