package es.daw2.fct_fct.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordUtils {
    
    // Para las contraseñas encriptadas
    private static final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();

    public static boolean doPasswordsMatch(String rawPassword, String hashedPassword) {
        return bCryptPasswordEncoder.matches(rawPassword, hashedPassword);
    }

    public static String hashPassword(String password) {
        return bCryptPasswordEncoder.encode(password);
    }

    public static boolean isPasswordValid(String password) {
        if (password.length() < 8) return false;    // La contraseña es demasiado corta

        // Validar la complejidad de la contraseña
        boolean hasUpperCase = false;
        boolean hasLowerCase = false;
        boolean hasDigit = false;

        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) {
                hasUpperCase = true;            // Tiene al menos una mayúscula
            } else if (Character.isLowerCase(c)) {
                hasLowerCase = true;            // Tiene al menos una minúscula
            } else if (Character.isDigit(c)) {
                hasDigit = true;                // Tiene al menos un dígito
            }
        }

        return hasUpperCase && hasLowerCase && hasDigit;
    }
}
