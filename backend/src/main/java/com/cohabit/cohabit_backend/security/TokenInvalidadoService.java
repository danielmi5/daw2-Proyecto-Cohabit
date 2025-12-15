package com.cohabit.cohabit_backend.security;

import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenInvalidadoService {

    private final Map<String, Date> tokensInvalidados = new ConcurrentHashMap<>();

    public void invalidarToken(String jti, Date fechaExpiracion) {
        tokensInvalidados.put(jti, fechaExpiracion);
        limpiarTokensExpirados();
    }

    public boolean esTokenInvalidado(String jti) {
        limpiarTokensExpirados();
        return tokensInvalidados.containsKey(jti);
    }

    private void limpiarTokensExpirados() {
        Date ahora = new Date();
        tokensInvalidados.entrySet().removeIf(e -> e.getValue().before(ahora));
    }

    public int obtenerCantidadTokensInvalidados() {
        limpiarTokensExpirados();
        return tokensInvalidados.size();
    }
}
