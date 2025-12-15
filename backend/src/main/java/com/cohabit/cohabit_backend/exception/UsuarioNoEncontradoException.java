package com.cohabit.cohabit_backend.exception;

import org.springframework.security.core.userdetails.UsernameNotFoundException;

/**
 * Excepción lanzada cuando no se encuentra un usuario por su identificador (email).
 */
public class UsuarioNoEncontradoException extends UsernameNotFoundException {

    public UsuarioNoEncontradoException(String mensaje) {
        super(mensaje);
    }

}
