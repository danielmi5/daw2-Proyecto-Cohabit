package com.cohabit.cohabit_backend.exception;

public class UsuarioYaPerteneceAUnGrupoException extends EntidadYaExisteException {

    public UsuarioYaPerteneceAUnGrupoException(String mensaje) {
        super(mensaje);
    }

}
