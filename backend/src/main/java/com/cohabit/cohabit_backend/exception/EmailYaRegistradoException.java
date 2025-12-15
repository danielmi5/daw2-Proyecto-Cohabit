package com.cohabit.cohabit_backend.exception;

/**
 * Excepción lanzada cuando se intenta registrar un email que ya existe.
 */
public class EmailYaRegistradoException extends RuntimeException {

    public EmailYaRegistradoException(String mensaje) {
        super(mensaje);
    }

}
