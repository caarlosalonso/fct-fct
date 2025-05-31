package es.daw2.fct_fct.controlador;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import es.daw2.fct_fct.modelo.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;


@Controller
public class HomeController {

    private enum PAGES {
    /*  Authentication                                                          */
        LOGIN("/auth/login.html"),
        REDIRECT_LOGIN("redirect:/auth/login.html"),
    /*  Errors                                                                  */
        ERROR("/error.html"),
    /*  User Management                                                         */
    /*  Admin                                                                   */
        ADMIN("/admin.html"),
    /*  Coordinación                                                            */
        COORDINACION("/coordinacion.html"),
    /*  Tutor                                                                   */
        TUTOR("/tutor.html"),
    /*  Alumno                                                                  */
        ALUMNO("/alumno.html"),




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
        return PAGES.LOGIN.getPath();
    }

    @GetMapping("/crear")
    public String crear(HttpServletRequest request) {
        //HttpSession session = request.getSession(false);
        //if (session == null) return "redirect:/login";
        return "createuser.html";
    }

    @GetMapping("/error")
    public String error() {
        return PAGES.ERROR.getPath();
    }

    @GetMapping("/coordinacion")
    public String coordinacion() {
        return PAGES.COORDINACION.getPath();
    }

    @GetMapping("/index")
    public String index() {
        return "index.html";
    }

}
