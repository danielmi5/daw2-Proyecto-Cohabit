package com.cohabit.cohabit_backend.controller;

import com.cohabit.cohabit_backend.dto.AuthRequestDTO;
import com.cohabit.cohabit_backend.dto.AuthResponseDTO;
import com.cohabit.cohabit_backend.dto.RegisterRequestDTO;
import com.cohabit.cohabit_backend.service.AutenticacionService;
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
    public ResponseEntity<AuthResponseDTO> iniciarSesion(@RequestBody AuthRequestDTO peticion) {
        AuthResponseDTO response = autenticacionService.iniciarSesion(peticion);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody RegisterRequestDTO peticion) {
        autenticacionService.registrar(peticion);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> cerrarSesion(@RequestHeader(value = "Authorization", required = true) String authorizationHeader) {
        autenticacionService.cerrarSesion(authorizationHeader);

        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Sesión cerrada exitosamente");

        return ResponseEntity.ok(respuesta);
    }
}
