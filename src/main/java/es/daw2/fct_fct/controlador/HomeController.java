package es.daw2.fct_fct.controlador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import es.daw2.fct_fct.modelo.Alumno;
import es.daw2.fct_fct.modelo.User;
import es.daw2.fct_fct.servicio.ServicioAlumno;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;


@Controller
public class HomeController {

    @Autowired
    private ServicioAlumno servicioAlumno;

    private enum PAGES {
    /*  Authentication                                                          */
        LOGIN("/login"),
        REDIRECT_LOGIN("redirect:/login"),
    /*  Errors                                                                  */
        ERROR("/error"),
    /*  User Management                                                         */
    /*  Admin                                                                   */
        ADMIN("/admin"),
    /*  Coordinación                                                            */
        COORDINACION("/coordinacion"),
    /*  Tutor                                                                   */
        TUTOR("/tutor"),
    /*  Alumno                                                                  */
        ALUMNO("/alumno"),




    /*
Do not disturb the sacred semicolon's deep slumber.
    *  \   |*  /     *
      * \  |  /  *          *
 *   --- */;/* ---      *
   *    /  |  \   *           *
       / * |   \      *
*/
        private final String path;

        PAGES(String path) {
            this.path = path;
        }

        public String getPath() {
            return path;
        }
    }

    @GetMapping("/")
    public String index(HttpServletRequest request) {
        HttpSession session = request.getSession(false);    // No crea sesión.
        if (session == null) return PAGES.REDIRECT_LOGIN.getPath();

        Object user = session.getAttribute("user");
        Object role = session.getAttribute("role");
        if (user == null || role == null) return PAGES.REDIRECT_LOGIN.getPath();

        return switch (role) {
            case User.Role.ADMIN        -> PAGES.ADMIN.getPath();
            case User.Role.COORDINADOR  -> PAGES.COORDINACION.getPath();
            case User.Role.TUTOR        -> PAGES.TUTOR.getPath();
            case User.Role.ALUMNO       -> PAGES.ALUMNO.getPath();
            default                     -> PAGES.LOGIN.getPath();
        };
    }

    @GetMapping("/login")
    public String login() {
        return "auth/login.html";
    }

    @GetMapping("/error")
    public String error() {
        return "error.html";
    }

    @GetMapping("/coordinacion")
    public String coordinacion() {
        return "coordinacion/coordinacion.html";
    }

    @GetMapping("/index")
    public String index() {
        return "index.html";
    }

    @GetMapping("/admin")
    public String admin(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) return PAGES.REDIRECT_LOGIN.getPath();
        Object user = session.getAttribute("user");
        Object role = session.getAttribute("role");
        if (user == null || role == null || !role.equals(User.Role.ADMIN)) {
            return PAGES.REDIRECT_LOGIN.getPath();
        }
        return "admin/admin.html";
    }

    @GetMapping("/tutor")
    public String tutor(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) return PAGES.REDIRECT_LOGIN.getPath();
        Object user = session.getAttribute("user");
        Object role = session.getAttribute("role");
        if (user == null || role == null) return PAGES.REDIRECT_LOGIN.getPath();
        return "tutor/tutor.html";
    }

    @GetMapping("/alumno")
    public String alumno(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) return PAGES.REDIRECT_LOGIN.getPath();
        Object user = session.getAttribute("user");
        Object role = session.getAttribute("role");
        if (user == null || role == null) return PAGES.REDIRECT_LOGIN.getPath();
        return "alumno/alumno.html";
    }

    @GetMapping("/subir")
    public String subir() {
        return "subirarchivo.html";
    }

    @GetMapping("/perfil")
    public String perfil(HttpServletRequest request, Model model) {
        HttpSession session = request.getSession(false);
        if (session == null) return PAGES.REDIRECT_LOGIN.getPath();

        Object user = session.getAttribute("user");
        Object role = session.getAttribute("role");
        if (user == null || role == null) return PAGES.REDIRECT_LOGIN.getPath();

        model.addAttribute("alumno", user);

        return switch (role) {
            case User.Role.ADMIN        -> "admin/profile.html";
            case User.Role.COORDINADOR  -> "coordinacion/profile.html";
            case User.Role.TUTOR        -> "tutor/profile.html";
            case User.Role.ALUMNO       -> "alumno/profile.html";
            default                     -> PAGES.REDIRECT_LOGIN.getPath();
        };
    }

    @PostMapping("/perfil")
    public String actualizarPerfil(@ModelAttribute Alumno alumno, Model model, HttpServletRequest request) {
        // Actualizar el perfil del alumno
        model.addAttribute("alumno", alumno);
        return "alumno/profile.html";
    }
}
