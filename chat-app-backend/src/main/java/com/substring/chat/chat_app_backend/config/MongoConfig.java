package com.substring.chat.chat_app_backend.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;

@Configuration
public class MongoConfig extends AbstractMongoClientConfiguration {

    private static final String FALLBACK_URI = "mongodb://localhost:27017/test";

    private String resolveUri() {
        String uri = System.getenv("SPRING_DATA_MONGODB_URI");
        if (uri == null || uri.isBlank()) {
            uri = FALLBACK_URI;
        }
        return uri;
    }

    @Override
    protected String getDatabaseName() {
        String uri = resolveUri();
        // Extract the database name from the URI (last path segment, before any query string)
        try {
            String path = uri.replaceFirst("mongodb(?:\\+srv)?://[^/]+/", "");
            String dbName = path.split("[?&]")[0].trim();
            return dbName.isEmpty() ? "test" : dbName;
        } catch (Exception e) {
            return "test";
        }
    }

    @Override
    @Bean
    public MongoClient mongoClient() {
        String uri = resolveUri();
        System.out.println("=================================");
        System.out.println("MongoConfig: connecting with URI = " + uri);
        System.out.println("=================================");
        return MongoClients.create(uri);
    }
}
