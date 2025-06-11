package es.daw2.fct_fct.utils;

import org.springframework.http.ResponseEntity;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

public class SessionValidation {

    public static ResponseEntity<?> isValidSession(HttpServletRequest request, Role ...validRoles) {
        StringBuilder logging = new StringBuilder("Validando sesión - Roles: ");
        if (validRoles == null || validRoles.length == 0) {
            logging.append("No específicados.");
            System.out.println(logging.toString());
            return ResponseEntity.badRequest().body("No roles specified");
        }
        logging.append("Válidos.").append(" - Request: ");

        if (request == null) {
            logging.append("Nulo.");
            System.out.println(logging.toString());
            return ResponseEntity.status(401).body("No session found");
        }
        logging.append("No nulo.").append(" - Session: ");

        HttpSession session = request.getSession(false);
        if (session == null) {
            logging.append("Nulo.");
            System.out.println(logging.toString());
            return ResponseEntity.status(401).body("No session found");
        }
        logging.append("No nulo.").append(" - Rol usuario: ");

        Object roleObj = session.getAttribute("role");
        if (roleObj == null) {
            logging.append("Nulo.");
            System.out.println(logging.toString());
            return ResponseEntity.status(401).body("No role found in session");
        }
        logging.append("No nulo.").append(" - Validez: ");

        if (!(roleObj instanceof Role)) {
            logging.append("Invalido.");
            System.out.println(logging.toString());
            return ResponseEntity.status(401).body("Invalid role type in session");
        }

        Role role = (Role) roleObj;
        logging.append("Válido.").append(" - Rol: ").append(role.toString()).append("=").append(role.getRoleName());

        boolean isValidRole = false;
        for (Role validRole : validRoles) {
            if (role == validRole) {
                isValidRole = true;
            }
        }
        logging.append(" - Rol válido para endpoint: ");
        if (isValidRole) {
            logging.append("Sí.");
            System.out.println(logging.toString());
            return null;
        }

        StringBuilder validRolesString = new StringBuilder();
        for (Role validRole : validRoles) {
            if (validRolesString.length() > 0) {
                validRolesString.append(", ");
            }
            validRolesString.append(validRole.getRoleName());
        }

        logging.append("No.").append("Debería ser uno de los siguientes: ").append(validRolesString.toString());
        System.out.println(logging.toString());
        return ResponseEntity.status(403).body("Denegado: Sólo pueden acceder los usuarios con el rol: " + validRolesString.toString());
    }

    public static Long getUserIdFromSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        StringBuilder logging = new StringBuilder("Obteniendo ID de usuario de la sesión - Request: ");

        if (session == null) {
            logging.append("Nulo.");
            System.out.println(logging.toString());
            return null;
        }

        Long userId = (Long) session.getAttribute("user");
        if (userId == null) {
            logging.append("No encontrado.");
            System.out.println(logging.toString());
            return null;
        }

        logging.append("Encontrado: ").append(userId);
        System.out.println(logging.toString());
        return userId;
    }
}
