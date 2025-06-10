package es.daw2.fct_fct.controlador;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import es.daw2.fct_fct.modelo.User;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;


@Controller
public class HomeController {

    private static final String LOGIN_URL = "/login";
    private static final String REDIRECT_LOGIN = "redirect:" + LOGIN_URL;
    private static final String INDEX_URL = "/index";
    private static final String REDIRECT_INDEX = "redirect:" + INDEX_URL;

    @GetMapping(LOGIN_URL)
    public String login() {
        return "auth/login.html";
    }

    @GetMapping("/logout")
    public String logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) return REDIRECT_LOGIN;
        session.invalidate();
        return "auth/logout.html";
    }

    @GetMapping("/error")
    public String error() {
        return "error.html";
    }

    @GetMapping("/")
    public String empty(HttpServletRequest request, HttpServletResponse response) {
        return index(request, response);
    }

    @GetMapping("/index")
    public String index(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false);    // No crea sesión.
        if (session == null) return REDIRECT_LOGIN;

        Object user = session.getAttribute("user");
        Object role = session.getAttribute("role");
        Object nombre = session.getAttribute("nombre");
        if (user == null || role == null || nombre == null) return REDIRECT_LOGIN;

        String cookieName;
        try {
            cookieName = URLEncoder.encode(nombre.toString(), StandardCharsets.UTF_8.toString());
        } catch (Exception e) {
            System.err.println("Error al codificar el nombre: " + e.getMessage());
            return REDIRECT_LOGIN;
        }

        Cookie cookie = new Cookie("nombre", cookieName);
        cookie.setMaxAge(-1);       // La cookie durará lo que dure la sesión.
        response.addCookie(cookie);

        return switch (role) {
            case User.Role.ADMIN        -> "admin/index.html";
            case User.Role.COORDINADOR  -> "coordinacion/index.html";
            case User.Role.TUTOR        -> "tutor/index.html";
            case User.Role.ALUMNO       -> "alumno/index.html";
            default                     -> REDIRECT_LOGIN;
        };
    }

    @GetMapping("/perfil")
    public String perfil(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) return REDIRECT_LOGIN;

        Object user = session.getAttribute("user");
        Object role = session.getAttribute("role");
        Object nombre = session.getAttribute("nombre");
        if (user == null || role == null || nombre == null) return REDIRECT_LOGIN;

        return switch (role) {
            case User.Role.ADMIN        -> "admin/profile.html";
            case User.Role.COORDINADOR  -> "coordinacion/profile.html";
            case User.Role.TUTOR        -> "tutor/profile.html";
            case User.Role.ALUMNO       -> "alumno/profile.html";
            default                     -> REDIRECT_LOGIN;
        };
    }

    @GetMapping("/ciclos")
    public String ciclos(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) return REDIRECT_LOGIN;
        Object user = session.getAttribute("user");
        Object role = session.getAttribute("role");
        if (user == null || role == null) return REDIRECT_LOGIN;

        return switch(role) {
            case User.Role.ADMIN        -> "admin/ciclos.html";
            case User.Role.COORDINADOR  -> "coordinacion/ciclos.html";
            case User.Role.TUTOR        -> "tutor/ciclos.html";
            default                     -> REDIRECT_LOGIN;
        };
    }

    @GetMapping("/alumnado")
    public String alumnado(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) return REDIRECT_LOGIN;
        Object user = session.getAttribute("user");
        Object role = session.getAttribute("role");
        if (user == null || role == null) return REDIRECT_LOGIN;

        return switch(role) {
            case User.Role.ADMIN        -> "admin/alumnado.html";
            case User.Role.COORDINADOR  -> "coordinacion/alumnado.html";
            case User.Role.TUTOR        -> "tutor/alumnado.html";
            default                     -> REDIRECT_INDEX;
        };
    }

    @GetMapping("/coordinacion")
    public String coordinacion(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) return REDIRECT_LOGIN;
        Object user = session.getAttribute("user");
        Object role = session.getAttribute("role");
        if (user == null || role == null) return REDIRECT_LOGIN;

        return switch(role) {
            case User.Role.ADMIN        -> "admin/coordinacion.html";
            default                     -> REDIRECT_INDEX;
        };
    }

    @GetMapping("/crear")
    public String crear(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) return REDIRECT_LOGIN;
        Object user = session.getAttribute("user");
        Object role = session.getAttribute("role");
        if (user == null || role == null) return REDIRECT_LOGIN;

        return switch(role) {
            case User.Role.ADMIN        -> "admin/createuser.html";
            default                     -> REDIRECT_INDEX;
        };
    }

    @GetMapping("/tutores")
    public String tutores(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) return REDIRECT_LOGIN;
        Object user = session.getAttribute("user");
        Object role = session.getAttribute("role");
        if (user == null || role == null) return REDIRECT_LOGIN;

        return switch(role) {
            case User.Role.COORDINADOR  -> "coordinacion/tutores.html";
            default                     -> REDIRECT_INDEX;
        };
    }

    @GetMapping("/empresas")
    public String empresas(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) return REDIRECT_LOGIN;
        Object user = session.getAttribute("user");
        Object role = session.getAttribute("role");
        if (user == null || role == null) return REDIRECT_LOGIN;

        return switch(role) {
            case User.Role.TUTOR        -> "tutor/empresas.html";
            case User.Role.ALUMNO       -> "alumno/empresas.html";
            default                     -> REDIRECT_INDEX;
        };
    }

    @GetMapping("/fcts")
    public String fcts(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) return REDIRECT_LOGIN;
        Object user = session.getAttribute("user");
        Object role = session.getAttribute("role");
        if (user == null || role == null) return REDIRECT_LOGIN;

        return switch(role) {
            case User.Role.TUTOR        -> "tutor/fcts.html";
            case User.Role.ALUMNO       -> "alumno/fcts.html";
            default                     -> REDIRECT_INDEX;
        };
    }

    @GetMapping("/tutorias")
    public String tutorias(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) return REDIRECT_LOGIN;
        Object user = session.getAttribute("user");
        Object role = session.getAttribute("role");
        if (user == null || role == null) return REDIRECT_LOGIN;

        return switch(role) {
            case User.Role.TUTOR        -> "tutor/tutorias.html";
            case User.Role.ALUMNO       -> "alumno/tutorias.html";
            default                     -> REDIRECT_INDEX;
        };
    }

    @GetMapping("/cursos")
    public String cursos(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) return REDIRECT_LOGIN;
        Object user = session.getAttribute("user");
        Object role = session.getAttribute("role");
        if (user == null || role == null) return REDIRECT_LOGIN;

        return switch(role) {
            case User.Role.TUTOR        -> "tutor/cursos.html";
            case User.Role.ALUMNO       -> "alumno/cursos.html";
            default                     -> REDIRECT_INDEX;
        };
    }

    @GetMapping("/subir")
    public String subir() {
        return "subirarchivo.html";
    }
}
