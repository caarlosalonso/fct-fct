package es.daw2.fct_fct.config;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;

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
        // No inicializa Firebase en tests
        if (env.getActiveProfiles() != null &&
            java.util.Arrays.asList(env.getActiveProfiles()).contains("test")) return;

        // Carga el JSON desde /resources
        InputStream serviceAccount = getClass().getClassLoader().getResourceAsStream("firebase-key.json");

        if (serviceAccount == null) {
            throw new IllegalStateException("No se encontró firebase-key.json en resources");
        }

        FirebaseOptions options = FirebaseOptions.builder()
            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
            .setStorageBucket("tfc-fct-3b0fa.appspot.com")
            .build();

        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp.initializeApp(options);
        }
    }
}