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

    public static PasswordValidity isPasswordValid(String password) {
        if (password == null) return PasswordValidity.INVALID;          // La contraseña no puede ser nula
        if (password.length() < 8) return PasswordValidity.TOO_SHORT;   // La contraseña es demasiado corta
        if (password.length() > 128) return PasswordValidity.TOO_LONG;  // La contraseña es demasiado larga

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

        if (hasUpperCase && hasLowerCase && hasDigit)
            return PasswordValidity.VALID;      // Si son todos verdaderos, la contraseña es válida
        return PasswordValidity.INVALID;        // Si no, la contraseña es inválida
    }

    /**
     * Enum representing the validity of a password.
     * The objective is to provide a more descriptive way of indicating how valid a password is.
     */
    public enum PasswordValidity {
        /**
         * The password is valid.
         */
        VALID,
        /**
         * The password is too short.
         */
        TOO_SHORT,
        /**
         * The password is too long.
         */
        TOO_LONG,
        /**
         * The password is invalid.
         */
        INVALID
    }
}
