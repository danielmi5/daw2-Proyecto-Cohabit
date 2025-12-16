package com.cohabit.cohabit_backend.security.auth.controller;

import com.cohabit.cohabit_backend.security.auth.dto.AuthRequestDTO;
import com.cohabit.cohabit_backend.security.auth.dto.AuthResponseDTO;
import com.cohabit.cohabit_backend.security.auth.dto.RegisterRequestDTO;
import com.cohabit.cohabit_backend.security.auth.service.AutenticacionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AutenticacionController {

    private final AutenticacionService autenticacionService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> iniciarSesion(@Valid @RequestBody AuthRequestDTO peticion) {
        AuthResponseDTO response = autenticacionService.iniciarSesion(peticion);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> registrar(@Valid @RequestBody RegisterRequestDTO peticion) {
        AuthResponseDTO response = autenticacionService.registrar(peticion);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> cerrarSesion(@RequestHeader(value = "Authorization", required = true) String authorizationHeader) {
        autenticacionService.cerrarSesion(authorizationHeader);

        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Sesión cerrada exitosamente");

        return ResponseEntity.ok(respuesta);
    }
}
