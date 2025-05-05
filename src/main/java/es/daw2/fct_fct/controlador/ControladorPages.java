package es.daw2.fct_fct.controlador;

import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class ControladorPages {

    private static final Map<String, String> THEMES = Map.of(
        "light", "/styles/light-theme.css",
        "dark", "/styles/dark-theme.css"
    );

    @RequestMapping("/login")
    public String login(Model model,
                        @CookieValue(value = "theme", defaultValue = "light") String theme
    ) {
        String selectedTheme = THEMES.getOrDefault(theme, THEMES.get("light"));
        model.addAttribute("theme", selectedTheme);
        return "login";
    }
}
