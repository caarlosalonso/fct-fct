package es.daw2.fct_fct;

import java.io.IOException;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FctFctApplication {

	public static void main(String[] args) throws IOException {
		System.out.println("Puerto detectado: " + System.getenv("PORT"));
		SpringApplication.run(FctFctApplication.class, args);
		
	}
}