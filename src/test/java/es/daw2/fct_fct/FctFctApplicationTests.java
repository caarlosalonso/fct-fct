package es.daw2.fct_fct;

import org.junit.jupiter.api.Test;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class FctFctApplicationTests {

	@Test
	void contextLoads() {
	}
	public static void main(String[] args) {
		System.out.println("Puerto detectado: " + System.getenv("PORT"));
		SpringApplication.run(FctFctApplication.class, args);
	}

}
