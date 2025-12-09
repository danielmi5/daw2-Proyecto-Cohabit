package com.cohabit.cohabit_backend.exception;

public class EntidadYaExisteException extends RuntimeException {
    public EntidadYaExisteException(String mensaje) {
        super(mensaje);
    }
}
