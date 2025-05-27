package es.daw2.fct_fct;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FctFctApplication {

	public static void main(String[] args) {
		System.out.println("Puerto detectado: " + System.getenv("PORT"));
		SpringApplication.run(FctFctApplication.class, args);
		
	}
}
