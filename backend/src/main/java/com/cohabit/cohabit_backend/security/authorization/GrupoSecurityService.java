package com.cohabit.cohabit_backend.security.authorization;

import com.cohabit.cohabit_backend.entity.MiembroGrupo;
import com.cohabit.cohabit_backend.entity.RolGrupo;
import com.cohabit.cohabit_backend.entity.Usuario;
import com.cohabit.cohabit_backend.repository.MiembroGrupoRepository;
import com.cohabit.cohabit_backend.repository.RecursoRepository;
import com.cohabit.cohabit_backend.repository.ReglaRecursoRepository;
import com.cohabit.cohabit_backend.repository.ReservaRepository;
import com.cohabit.cohabit_backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Servicio usado desde expresiones SpEL en @PreAuthorize para comprobar roles dentro de un grupo.
 */
@Component("grupoSecurity")
@RequiredArgsConstructor
public class GrupoSecurityService {

    private final UsuarioRepository usuarioRepository;
    private final MiembroGrupoRepository miembroRepo;
    private final RecursoRepository recursoRepo;
    private final ReglaRecursoRepository reglaRepo;
    private final ReservaRepository reservaRepo;

    private Optional<Usuario> obtenerUsuarioActual() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) return Optional.empty();
        return Optional.ofNullable(usuarioRepository.findByEmail(auth.getName()));
    }

    public boolean esAdminGlobal() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return false;
        return auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    public boolean esMiembro(Long grupoId) {
        Optional<Usuario> usuario = obtenerUsuarioActual();
        return usuario.map(u -> miembroRepo.existsByUsuarioIdAndGrupoId(u.getId(), grupoId)).orElse(false);
    }

    public boolean esCreadorOAdmin(Long grupoId) {
        if (esAdminGlobal()) return true;
        Optional<Usuario> usuario = obtenerUsuarioActual();
        if (usuario.isEmpty()) return false;
        Optional<MiembroGrupo> miembro = miembroRepo.findByUsuarioIdAndGrupoId(usuario.get().getId(), grupoId);
        return miembro.map(m -> m.getRol() == RolGrupo.CREADOR || m.getRol() == RolGrupo.ADMIN).orElse(false);
    }

    public boolean esCreadorOAdminMiembro(Long miembroId) {
        if (esAdminGlobal()) return true;
        Optional<MiembroGrupo> miembro = miembroRepo.findById(miembroId);
        return miembro.map(m -> esCreadorOAdmin(m.getGrupo().getId())).orElse(false);
    }

    public boolean esCreadorOAdminRecurso(Long recursoId) {
        if (esAdminGlobal()) return true;
        return recursoRepo.findById(recursoId)
                .map(r -> esCreadorOAdmin(r.getGrupo().getId()))
                .orElse(false);
    }

    public boolean esCreadorOAdminRegla(Long reglaId) {
        if (esAdminGlobal()) return true;
        return reglaRepo.findById(reglaId)
                .map(rr -> rr.getRecurso() != null ? esCreadorOAdmin(rr.getRecurso().getGrupo().getId()) : false)
                .orElse(false);
    }

    /**
     * Devuelve true si el usuario actual es el miembro que aparece como creador del recurso.
     */
    public boolean esCreadorDelRecurso(Long recursoId) {
        Optional<Usuario> usuario = obtenerUsuarioActual();
        if (usuario.isEmpty()) return false;
        Long usuarioId = usuario.get().getId();
        return recursoRepo.findById(recursoId)
                .map(r -> r.getCreador() != null && r.getCreador().getUsuario() != null && r.getCreador().getUsuario().getId().equals(usuarioId))
                .orElse(false);
    }

    /**
     * Devuelve true si el usuario actual es el miembro que aparece como creador de la regla.
     */
    public boolean esCreadorDeRegla(Long reglaId) {
        Optional<Usuario> usuario = obtenerUsuarioActual();
        if (usuario.isEmpty()) return false;
        Long usuarioId = usuario.get().getId();
        return reglaRepo.findById(reglaId)
                .map(rr -> rr.getCreador() != null && rr.getCreador().getUsuario() != null && rr.getCreador().getUsuario().getId().equals(usuarioId))
                .orElse(false);
    }

    /**
     * Comprueba si el miembroId corresponde al miembro del usuario actualmente autenticado.
     */
    public boolean esMiembroIdActual(Long miembroId) {
        Optional<Usuario> usuario = obtenerUsuarioActual();
        if (usuario.isEmpty()) return false;
        return miembroRepo.findById(miembroId).map(m -> m.getUsuario() != null && m.getUsuario().getId().equals(usuario.get().getId())).orElse(false);
    }

    /**
     * Devuelve true si el usuario autenticado es el propietario (miembro) de la reserva indicada.
     */
    public boolean esPropietarioReserva(Long reservaId) {
        Optional<Usuario> usuario = obtenerUsuarioActual();
        if (usuario.isEmpty()) return false;
        Long usuarioId = usuario.get().getId();
        return reservaRepo.findById(reservaId)
                .map(r -> r.getMiembroGrupo() != null && r.getMiembroGrupo().getUsuario() != null && r.getMiembroGrupo().getUsuario().getId().equals(usuarioId))
                .orElse(false);
    }

    /**
     * Devuelve true si el id de usuario pasado corresponde al usuario autenticado.
     */
    public boolean esUsuarioIdActual(Long usuarioId) {
        Optional<Usuario> usuario = obtenerUsuarioActual();
        return usuario.map(u -> u.getId().equals(usuarioId)).orElse(false);
    }

    /**
     * Devuelve true si el usuario actual comparte grupo con el usuario cuyo id se pasa.
     */
    public boolean comparteGrupoConUsuario(Long usuarioId) {
        Optional<Usuario> usuario = obtenerUsuarioActual();
        if (usuario.isEmpty()) return false;
        Optional<MiembroGrupo> miActual = miembroRepo.findByUsuarioId(usuario.get().getId());
        Optional<MiembroGrupo> miOtro = miembroRepo.findByUsuarioId(usuarioId);
        if (miActual.isEmpty() || miOtro.isEmpty()) return false;
        return miActual.get().getGrupo().getId().equals(miOtro.get().getGrupo().getId());
    }

    /**
     * Devuelve true si la reserva corresponde a un recurso cuyo grupo tiene al usuario como miembro.
     */
    public boolean esReservaEnGrupoMiembro(Long reservaId) {
        if (esAdminGlobal()) return true;
        return reservaRepo.findById(reservaId)
                .map(r -> r.getRecurso() != null && r.getRecurso().getGrupo() != null && esMiembro(r.getRecurso().getGrupo().getId()))
                .orElse(false);
    }

    /**
     * Devuelve true si el recurso pertenece a un grupo en el que el usuario es miembro.
     */
    public boolean esRecursoEnGrupoMiembro(Long recursoId) {
        if (esAdminGlobal()) return true;
        return recursoRepo.findById(recursoId)
                .map(r -> r.getGrupo() != null && esMiembro(r.getGrupo().getId()))
                .orElse(false);
    }

    /**
     * Devuelve true si la regla pertenece a un recurso cuyo grupo contiene al usuario como miembro.
     */
    public boolean esReglaEnGrupoMiembro(Long reglaId) {
        if (esAdminGlobal()) return true;
        return reglaRepo.findById(reglaId)
                .map(rr -> rr.getRecurso() != null && rr.getRecurso().getGrupo() != null && esMiembro(rr.getRecurso().getGrupo().getId()))
                .orElse(false);
    }
}
