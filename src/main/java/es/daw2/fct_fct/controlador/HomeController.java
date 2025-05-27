package es.daw2.fct_fct.controlador;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.RequestParam;



@Controller
public class HomeController {

    @GetMapping("/")
    public String index(HttpSession session) {
        if (session.getAttribute("user") == null)
            return "redirect:/login";
        
        if (session.getAttribute("role") == null)
            return "redirect:/login";

        return switch (session.getAttribute("role").toString()) {
            case "admin"        ->  "admin.html";
            case "coordinador"  ->  "coordinacion.html";
            case "tutor"        ->  "tutor.html";
            case "alumno"       ->  "alumno.html";
            default             ->  "login.html";
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
