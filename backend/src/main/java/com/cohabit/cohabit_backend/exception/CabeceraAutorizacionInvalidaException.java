package com.cohabit.cohabit_backend.exception;

/**
 * Excepción lanzada cuando la cabecera Authorization está ausente o no tiene formato válido.
 */
public class CabeceraAutorizacionInvalidaException extends RuntimeException {

    public CabeceraAutorizacionInvalidaException(String mensaje) {
        super(mensaje);
    }

}
