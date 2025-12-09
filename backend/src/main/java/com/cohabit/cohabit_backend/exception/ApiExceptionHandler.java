package com.cohabit.cohabit_backend.exception;

import com.cohabit.cohabit_backend.dto.ApiErrorDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.List;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorDTO> handleIllegalArgumentException(IllegalArgumentException e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.NOT_FOUND;
        return ResponseEntity.status(status).body(crearCuerpoJson(status, request, e, "Parámetro no válido"));
    }

    @ExceptionHandler(EntidadNoEncontradaException.class)
    public ResponseEntity<ApiErrorDTO> handleEntidadNoEncontradaException(EntidadNoEncontradaException e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.NOT_FOUND;
        return ResponseEntity.status(status).body(crearCuerpoJson(status, request, e, "Entidad no encontrada"));
    }

    @ExceptionHandler(ParametroNuloException.class)
    public ResponseEntity<ApiErrorDTO> handleParametroNuloException(ParametroNuloException e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status).body(crearCuerpoJson(status, request, e, "Has introducido un parámetro no válido"));
    }

    @ExceptionHandler(EntidadYaExisteException.class)
    public ResponseEntity<ApiErrorDTO> handleEntidadYaExisteException(EntidadYaExisteException e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.CONFLICT;
        return ResponseEntity.status(status).body(crearCuerpoJson(status, request, e, e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorDTO> handleValidationException(MethodArgumentNotValidException e, HttpServletRequest request) {
        List<String> errores = e.getBindingResult()
                .getAllErrors()
                .stream().map(error -> error.getDefaultMessage()).toList();

        HttpStatus status = HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status).body(crearCuerpoJson(status, request, e, errores.toString()));
    }

    private ApiErrorDTO crearCuerpoJson(HttpStatus status, HttpServletRequest request, Exception e, String desc) {
        String mensaje;
        if (e instanceof MethodArgumentNotValidException) {
            mensaje = "Los datos introducidos no son válidos";
        } else {
            mensaje = e.getMessage();
        }

        return ApiErrorDTO.builder()
                .timestamp(LocalDateTime.now())
                .numEstado(status.value())
                .error(status.getReasonPhrase())
                .mensaje(mensaje)
                .descripcion(desc)
                .path(request.getRequestURI())
                .build();
    }
}
