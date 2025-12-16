package com.cohabit.cohabit_backend.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.clave-secreta:ZmFrZV9zZWNyZXRfZm9yX2Rldi1wZXJfcHJvZHVjdGlvbi0xMjM0NTY=}")
    private String claveSecretaBase64;

    @Value("${jwt.tiempo-expiracion:3600000}")
    private long tiempoExpiracionMillis;

    public String extraerEmail(String token) {
        return extraerClaim(token, Claims::getSubject);
    }

    public String extraerJti(String token) {
        return extraerClaim(token, Claims::getId);
    }

    public <T> T extraerClaim(String token, Function<Claims, T> resolver) {
        final Claims claims = extraerTodosLosClaims(token);
        return resolver.apply(claims);
    }

    public String generarToken(UserDetails detallesUsuario) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", detallesUsuario.getAuthorities());
        return generarToken(claims, detallesUsuario);
    }

    public String generarToken(Map<String, Object> claims, UserDetails detallesUsuario) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + tiempoExpiracionMillis);
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(detallesUsuario.getUsername())
                .setId(UUID.randomUUID().toString())
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(obtenerClaveSecreta(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean esTokenValido(String token, UserDetails detallesUsuario) {
        final String email = extraerEmail(token);
        return (email.equals(detallesUsuario.getUsername())) && !esTokenExpirado(token);
    }

    private boolean esTokenExpirado(String token) {
        return extraerExpiracion(token).before(new Date());
    }

    private Date extraerExpiracion(String token) {
        return extraerClaim(token, Claims::getExpiration);
    }

    public Date extraerExpiracionToken(String token) {
        return extraerExpiracion(token);
    }

    private Claims extraerTodosLosClaims(String token) {
        Key key = obtenerClaveSecreta();
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key obtenerClaveSecreta() {
        byte[] keyBytes = Decoders.BASE64.decode(claveSecretaBase64);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
