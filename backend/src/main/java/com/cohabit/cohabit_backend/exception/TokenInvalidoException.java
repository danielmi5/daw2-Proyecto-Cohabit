package com.cohabit.cohabit_backend.exception;

/**
 * Excepción lanzada cuando el token JWT es inválido o no puede procesarse.
 */
public class TokenInvalidoException extends RuntimeException {

    public TokenInvalidoException(String mensaje) {
        super(mensaje);
    }

    public TokenInvalidoException(String mensaje, Throwable causa) {
        super(mensaje, causa);
    }
}
