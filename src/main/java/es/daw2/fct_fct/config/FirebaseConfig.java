package es.daw2.fct_fct.config;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

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
        InputStream is = new ByteArrayInputStream(credJson.getBytes());
        FirebaseOptions opts = FirebaseOptions.builder()
            .setCredentials(GoogleCredentials.fromStream(is))
            .setStorageBucket("tfc-fct-3b0fa.firebasestorage.app")
            .build();
        FirebaseApp.initializeApp(opts);
    }
}