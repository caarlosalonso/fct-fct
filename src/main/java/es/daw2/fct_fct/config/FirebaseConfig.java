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

        if (Arrays.asList(env.getActiveProfiles()).contains("test")) return;

        String credJson = System.getProperty("GOOGLE_APPLICATION_CREDENTIALS_JSON");

        // Debug temporal:
        System.out.println("GOOGLE_APPLICATION_CREDENTIALS_JSON:");
        System.out.println(credJson);
        
        if (credJson == null || credJson.isEmpty()) {
            throw new IllegalStateException("GOOGLE_APPLICATION_CREDENTIALS_JSON env variable not set or empty");
        }
        InputStream is = new ByteArrayInputStream(credJson.getBytes(StandardCharsets.UTF_8));
        FirebaseOptions opts = FirebaseOptions.builder()
            .setCredentials(GoogleCredentials.fromStream(is))
            .setStorageBucket("tfc-fct-3b0fa.appspot.com") // <-- Correct format
            .build();
        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp.initializeApp(opts);
        }
    }
}