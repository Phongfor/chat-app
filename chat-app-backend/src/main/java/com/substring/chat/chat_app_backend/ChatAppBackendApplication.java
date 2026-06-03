package com.substring.chat.chat_app_backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ChatAppBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChatAppBackendApplication.class, args);
	}

	@Bean
	CommandLineRunner debugMongo(
			@Value("${spring.data.mongodb.uri:NOT_FOUND}") String mongoUri) {
		return args -> {
			System.out.println("=================================");
			System.out.println("SPRING_MONGO_URI = " + mongoUri);
			System.out.println("ENV_MONGO_URL    = " + System.getenv("MONGO_URL"));
			System.out.println("=================================");
		};
	}
}