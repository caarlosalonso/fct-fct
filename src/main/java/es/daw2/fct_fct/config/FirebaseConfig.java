package es.daw2.fct_fct.config;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import javax.annotation.PostConstruct;

import org.springframework.context.annotation.Configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void init() throws Exception {
        String credJson = System.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON");
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