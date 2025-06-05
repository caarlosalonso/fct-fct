package es.daw2.fct_fct;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class FctFctApplicationTests {

	@BeforeAll
	static void setup() {
		System.setProperty("GOOGLE_APPLICATION_CREDENTIALS", "src/test/resources/firebase-key.json");
	}
	
	@Test
	void contextLoads() {
	}
}
