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
        try {
            // Normalise the scheme so java.net.URI can parse it (it doesn't understand mongodb+srv)
            String parseableUri = uri.replaceFirst("^mongodb(\\+srv)?://", "mongodb://");
            java.net.URI parsed = new java.net.URI(parseableUri);
            String path = parsed.getPath(); // e.g. "/mydb", "/", or null when no path is present
            if (path == null || path.isEmpty() || path.equals("/")) {
                return "admin";
            }
            // Strip the leading slash and take only the first path segment
            String dbName = path.substring(1).split("[/?&]")[0].trim();
            return dbName.isEmpty() ? "admin" : dbName;
        } catch (Exception e) {
            return "admin";
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
