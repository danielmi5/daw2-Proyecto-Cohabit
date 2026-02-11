package com.cohabit.cohabit_backend.service;

import com.cohabit.cohabit_backend.dto.GrupoRequestDTO;
import com.cohabit.cohabit_backend.dto.GrupoUpdateDTO;
import com.cohabit.cohabit_backend.dto.GrupoResponseDTO;
import com.cohabit.cohabit_backend.dto.RecursoResponseDTO;
import com.cohabit.cohabit_backend.entity.Grupo;
import com.cohabit.cohabit_backend.entity.MiembroGrupo;
import com.cohabit.cohabit_backend.exception.EntidadNoEncontradaException;
import com.cohabit.cohabit_backend.exception.EntidadYaExisteException;
import com.cohabit.cohabit_backend.exception.ParametroNuloException;
import com.cohabit.cohabit_backend.exception.UsuarioYaPerteneceAUnGrupoException;
import com.cohabit.cohabit_backend.mapper.GrupoMapper;
import com.cohabit.cohabit_backend.mapper.MiembroGrupoMapper;
import com.cohabit.cohabit_backend.mapper.RecursoMapper;
import com.cohabit.cohabit_backend.entity.TipoRecurso;
import com.cohabit.cohabit_backend.entity.RolGrupo;
import com.cohabit.cohabit_backend.entity.Usuario;
import com.cohabit.cohabit_backend.repository.GrupoRepository;
import com.cohabit.cohabit_backend.repository.UsuarioRepository;
import com.cohabit.cohabit_backend.dto.MiembroGrupoRequestDTO;
import com.cohabit.cohabit_backend.dto.MiembroGrupoResponseDTO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class GrupoService {

    private final GrupoRepository grupoRepository;
    private final UsuarioRepository usuarioRepository;
    private final MiembroGrupoService miembroGrupoService;

    public GrupoService(GrupoRepository grupoRepository, UsuarioRepository usuarioRepository, MiembroGrupoService miembroGrupoService) {
        this.grupoRepository = grupoRepository;
        this.usuarioRepository = usuarioRepository;
        this.miembroGrupoService = miembroGrupoService;
    }

    public GrupoResponseDTO obtenerPorId(Long id) {
        Grupo grupo = grupoRepository.findById(id)
                .orElseThrow(() -> new EntidadNoEncontradaException("Grupo no encontrado: " + id));
        return GrupoMapper.grupoEntidadAGrupoDto(grupo);
    }

    public Page<GrupoResponseDTO> obtenerTodos(Pageable pageable) {
        var paginaGrupos = grupoRepository.findAll(pageable);
        List<GrupoResponseDTO> dtos = paginaGrupos.getContent().stream().map(grupoEntidad -> GrupoMapper.grupoEntidadAGrupoDto(grupoEntidad)).toList();
        return new PageImpl<>(dtos, pageable, paginaGrupos.getTotalElements());
    }

    public Page<GrupoResponseDTO> buscarPorFiltros(String nombre, String descripcion, Long creadorId, Pageable pageable) {
        var pagina = grupoRepository.findByFilters(nombre, descripcion, creadorId, pageable);
        List<GrupoResponseDTO> dtos = pagina.getContent().stream().map(GrupoMapper::grupoEntidadAGrupoDto).toList();
        return new PageImpl<>(dtos, pageable, pagina.getTotalElements());
    }

    @Transactional
    public GrupoResponseDTO crear(GrupoRequestDTO dto) {
        if (dto == null) throw new ParametroNuloException("GrupoRequestDTO es null");

        // Validar existencia del usuario creador
        Usuario creador = usuarioRepository.findById(dto.getCreadorId())
            .orElseThrow(() -> new EntidadNoEncontradaException("Usuario no encontrado: " + dto.getCreadorId()));

        // Evitar crear un grupo si el usuario ya pertenece a otro
        if (creador.getMiembroGrupo() != null) {
            throw new UsuarioYaPerteneceAUnGrupoException("El usuario ya pertenece a un grupo");
        }

        Grupo entidad = GrupoMapper.grupoRequestAGrupoEntidad(dto);
        // Asignar creador directo en Grupo
        entidad.setCreador(creador);
        // Genera el código
        if (entidad.getCodigoInvitacion() == null || entidad.getCodigoInvitacion().isBlank()) {
            String codigoGenerado = generarCodigoInvitacionUnico(8);
            entidad.setCodigoInvitacion(codigoGenerado);
        }

        // Persistir grupo
        Grupo grupoGuardado = grupoRepository.save(entidad);

        // Crea miembro del grupo para el creador con rol CREADOR usando el servicio
        MiembroGrupoRequestDTO miembroDto = MiembroGrupoRequestDTO.builder()
            .usuarioId(creador.getId())
            .grupoId(grupoGuardado.getId())
            .rol(RolGrupo.CREADOR)
            .activo(true)
            .build();

        miembroGrupoService.crear(miembroDto);

        return GrupoMapper.grupoEntidadAGrupoDto(grupoGuardado);
    }

    @Transactional
    public GrupoResponseDTO actualizar(Long id, GrupoUpdateDTO dto) {
        if (dto == null) throw new ParametroNuloException("GrupoUpdateDTO es null");
        Grupo grupoExistente = grupoRepository.findById(id)
                .orElseThrow(() -> new EntidadNoEncontradaException("Grupo no encontrado: " + id));

        if (dto.getNombre() != null) grupoExistente.setNombre(dto.getNombre());
        if (dto.getDireccion() != null) grupoExistente.setDireccion(dto.getDireccion());
        if (dto.getDescripcion() != null) grupoExistente.setDescripcion(dto.getDescripcion());
        if (dto.getFotoGrupo() != null) grupoExistente.setFotoGrupo(dto.getFotoGrupo());

        Grupo grupoGuardado = grupoRepository.save(grupoExistente);
        return GrupoMapper.grupoEntidadAGrupoDto(grupoGuardado);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!grupoRepository.existsById(id)) {
            throw new EntidadNoEncontradaException("Grupo no encontrado: " + id);
        }
        grupoRepository.deleteById(id);
    }

    @Transactional
    public GrupoResponseDTO subirFoto(Long id, MultipartFile archivo) {
        Grupo grupoExistente = grupoRepository.findById(id)
                .orElseThrow(() -> new EntidadNoEncontradaException("Grupo no encontrado: " + id));

        try {
            // Convierte el archivo a base64
            byte[] bytes = archivo.getBytes();
            String base64 = "data:" + archivo.getContentType() + ";base64," + Base64.getEncoder().encodeToString(bytes);
            
            grupoExistente.setFotoGrupo(base64);
            Grupo grupoGuardado = grupoRepository.save(grupoExistente);
            return GrupoMapper.grupoEntidadAGrupoDto(grupoGuardado);
        } catch (IOException e) {
            throw new RuntimeException("Error al procesar el archivo: " + e.getMessage());
        }
    }

    /**
     * Genera un código de invitación único comprobado contra la base de datos.
     * @param intentosMaximos número máximo de intentos antes de lanzar excepción
     * @return código único
     */
    private String generarCodigoInvitacionUnico(int intentosMaximos) {
        if (intentosMaximos < 1) intentosMaximos = 8;
        String codigo;
        int contadorIntentos = 0;
        do {
            codigo = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
            contadorIntentos++;
            if (contadorIntentos > intentosMaximos) {
                throw new EntidadYaExisteException("No se pudo generar un código de invitación único después de " + intentosMaximos + " intentos. Por favor, inténtelo de nuevo.");
            }
        } while (grupoRepository.existsByCodigoInvitacion(codigo));
        return codigo;
    }

    @Transactional(readOnly = true)
    public List<RecursoResponseDTO> obtenerRecursosPorGrupo(Long grupoId) {
        // Usa findByIdWithRecursos para cargar recursos en una sola query (optimización N+1)
        Grupo grupo = grupoRepository.findByIdWithRecursos(grupoId)
                .orElseThrow(() -> new EntidadNoEncontradaException("Grupo no encontrado: " + grupoId));
        return grupo.getRecursos().stream()
                .map(RecursoMapper::recursoEntidadARecursoDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<RecursoResponseDTO> obtenerRecursosPorGrupoPaginado(Long grupoId, String tipo, String estado, Pageable pageable) {
        // Verificar que el grupo existe
        if (!grupoRepository.existsById(grupoId)) {
            throw new EntidadNoEncontradaException("Grupo no encontrado: " + grupoId);
        }
        
        Page<com.cohabit.cohabit_backend.entity.Recurso> paginaRecursos = 
            grupoRepository.findRecursosPorGrupo(grupoId, tipo, estado, pageable);
        
        List<RecursoResponseDTO> dtos = paginaRecursos.getContent().stream()
                .map(RecursoMapper::recursoEntidadARecursoDto)
                .collect(Collectors.toList());
        
        return new PageImpl<>(dtos, pageable, paginaRecursos.getTotalElements());
    }

    @Transactional(readOnly = true)
    public Page<RecursoResponseDTO> obtenerRecursosInventario(Long grupoId, TipoRecurso tipo, Pageable pageable) {
        // Verificar que el grupo existe
        if (!grupoRepository.existsById(grupoId)) {
            throw new EntidadNoEncontradaException("Grupo no encontrado: " + grupoId);
        }

        Page<com.cohabit.cohabit_backend.entity.Recurso> paginaRecursos =
                grupoRepository.findRecursosInventario(grupoId, tipo, pageable);

        List<RecursoResponseDTO> dtos = paginaRecursos.getContent().stream()
                .map(RecursoMapper::recursoEntidadARecursoDto)
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, paginaRecursos.getTotalElements());
    }

    @Transactional(readOnly = true)
    public Page<MiembroGrupoResponseDTO> obtenerMiembros(Long grupoId, Pageable pageable) {
        // Verifica que el grupo existe
        if (!grupoRepository.existsById(grupoId)) {
            throw new EntidadNoEncontradaException("Grupo no encontrado: " + grupoId);
        }

        Page<MiembroGrupo> paginaMiembros = grupoRepository.findMiembros(grupoId, pageable);

        List<MiembroGrupoResponseDTO> dtos = paginaMiembros.getContent().stream()
                .map(MiembroGrupoMapper::miembroGrupoEntidadAMiembroGrupoDto)
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, paginaMiembros.getTotalElements());
    }
}
