package es.daw2.fct_fct.config;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.Arrays;
import java.util.Base64;

import javax.annotation.PostConstruct;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

@Configuration
public class FirebaseConfig {

    private final Environment env;

    public FirebaseConfig(Environment env) {
        this.env = env;
    }

    @PostConstruct
    public void init() throws Exception {
        if (env.getActiveProfiles() != null &&
            Arrays.asList(env.getActiveProfiles()).contains("test")) return;

        String base64Creds = System.getenv("GOOGLE_APPLICATION_CREDENTIALS_BASE64");

        if (base64Creds == null || base64Creds.isEmpty()) {
            throw new IllegalStateException("Variable GOOGLE_APPLICATION_CREDENTIALS_BASE64 no está definida o está vacía");
        }

        try {
            byte[] decodedBytes = Base64.getDecoder().decode(base64Creds);
            InputStream serviceAccount = new ByteArrayInputStream(decodedBytes);

            FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .setStorageBucket("tfc-fct-3b0fa.appspot.com")
                .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                System.out.println("Firebase inicializado correctamente.");
            }
        } catch (Exception e) {
            System.out.println("Error al inicializar Firebase:");
            e.printStackTrace();
            throw e;
        }
    }
}
