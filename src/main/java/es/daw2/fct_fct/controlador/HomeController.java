package es.daw2.fct_fct.controlador;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import es.daw2.fct_fct.modelo.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;


@Controller
public class HomeController {

    @GetMapping("/")
    public String index(HttpServletRequest request) {
        HttpSession session = request.getSession(false);    // No crea sesión.
        if (session == null) return "redirect:/login";

        Object user = session.getAttribute("user");
        Object role = session.getAttribute("role");
        if (user == null || role == null) return "redirect:/login";

        return switch (role) {
            case User.Role.ADMIN        -> "admin.html";
            case User.Role.COORDINADOR  -> "coordinacion.html";
            case User.Role.TUTOR        -> "tutor.html";
            case User.Role.ALUMNO       -> "alumno.html";
            default                     -> "login.html";
        };
    }

    @GetMapping("/login")
    public String login() {
        return "login.html";
    }

    @GetMapping("/crear")
    public String crear() {
        return "createuser.html";
    }

    @GetMapping("/error")
    public String error() {
        return "error.html";
    }

    @GetMapping("/coordinacion")
    public String coordinacion() {
        return "coordinacion.html";
    }

    @GetMapping("/index")
    public String index() {
        return "index.html";
    }

}
