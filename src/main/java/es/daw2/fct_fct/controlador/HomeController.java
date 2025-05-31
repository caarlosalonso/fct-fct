package es.daw2.fct_fct.controlador;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

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
    public String index(HttpSession session) {
        if (session.getAttribute("user") == null)
            return PAGES.REDIRECT_LOGIN.getPath();
        
        if (session.getAttribute("role") == null)
            return PAGES.LOGIN.getPath();

        return switch (session.getAttribute("role").toString()) {
            case "admin"        ->  PAGES.ADMIN.getPath();
            case "coordinador"  ->  PAGES.COORDINACION.getPath();
            case "tutor"        ->  PAGES.TUTOR.getPath();
            case "alumno"       ->  PAGES.ALUMNO.getPath();
            default             ->  PAGES.LOGIN.getPath();
        };
    }

    @GetMapping("/login")
    public String login() {
        return PAGES.LOGIN.getPath();
    }

    @GetMapping("/crear")
    public String crear() {
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
