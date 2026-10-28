package com.travelexpense.calculator.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

/**
 * Production DataSource configuration with cloud URI conversion (e.g., Render, Railway, Neon, Supabase).
 * Seamlessly converts postgres:// and postgresql:// URIs into valid JDBC URLs with credentials and SSL settings.
 * If no cloud database URL is provided, falls back to embedded H2 in PostgreSQL mode so the app remains resilient.
 */
@Configuration
@Profile("prod")
public class ProductionDataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(ProductionDataSourceConfig.class);

    @Value("${spring.datasource.url:${DATABASE_URL:}}")
    private String rawDatabaseUrl;

    @Value("${spring.datasource.username:${DATABASE_USERNAME:}}")
    private String rawUsername;

    @Value("${spring.datasource.password:${DATABASE_PASSWORD:}}")
    private String rawPassword;

    @Bean
    public DataSource dataSource() {
        // Priority 1: Check System environment directly
        String dbUrl = System.getenv("DATABASE_URL");
        if (dbUrl == null || dbUrl.trim().isEmpty()) {
            dbUrl = System.getenv("SPRING_DATASOURCE_URL");
        }
        if (dbUrl == null || dbUrl.trim().isEmpty()) {
            dbUrl = rawDatabaseUrl;
        }

        if (dbUrl != null) {
            dbUrl = dbUrl.trim();
        }

        // If no cloud DB URL is configured, or if it points to localhost (which does not exist inside Render containers)
        if (dbUrl == null || dbUrl.isEmpty() || dbUrl.contains("localhost:5432")) {
            log.warn("⚠️ No external DATABASE_URL provided or pointing to localhost! Falling back to embedded H2 (PostgreSQL mode) for high availability.");
            HikariConfig h2Config = new HikariConfig();
            h2Config.setDriverClassName("org.h2.Driver");
            h2Config.setJdbcUrl("jdbc:h2:mem:travelexpensedb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=false;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;DEFAULT_NULL_ORDERING=HIGH");
            h2Config.setUsername("sa");
            h2Config.setPassword("");
            h2Config.setMaximumPoolSize(5);
            return new HikariDataSource(h2Config);
        }

        HikariConfig config = new HikariConfig();
        config.setDriverClassName("org.postgresql.Driver");

        String jdbcUrl;
        String username = (rawUsername != null && !rawUsername.trim().isEmpty()) ? rawUsername.trim() : null;
        String password = (rawPassword != null && !rawPassword.trim().isEmpty()) ? rawPassword.trim() : null;

        if (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://")) {
            try {
                URI uri = new URI(dbUrl);
                String host = uri.getHost();
                int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                String path = uri.getPath();
                String query = uri.getQuery();

                if (uri.getUserInfo() != null && (username == null || "postgres".equals(username))) {
                    String[] userInfo = uri.getUserInfo().split(":", 2);
                    username = userInfo[0];
                    if (userInfo.length > 1) {
                        password = userInfo[1];
                    }
                }

                jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path;
                if (query != null && !query.isEmpty()) {
                    jdbcUrl += "?" + query;
                } else if (!jdbcUrl.contains("sslmode")) {
                    jdbcUrl += "?sslmode=require";
                }

                log.info("✅ Successfully normalized cloud DATABASE_URL to JDBC URL for host: {}:{}", host, port);
            } catch (URISyntaxException e) {
                log.warn("Failed to parse DATABASE_URL as URI, using fallback: {}", e.getMessage());
                jdbcUrl = dbUrl.startsWith("jdbc:") ? dbUrl : "jdbc:" + dbUrl;
            }
        } else {
            jdbcUrl = dbUrl.startsWith("jdbc:") ? dbUrl : "jdbc:" + dbUrl;
        }

        config.setJdbcUrl(jdbcUrl);
        if (username != null) {
            config.setUsername(username);
        }
        if (password != null) {
            config.setPassword(password);
        }

        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setIdleTimeout(300000);
        config.setConnectionTimeout(20000);
        config.setMaxLifetime(1200000);

        log.info("Connecting to PostgreSQL DataSource at: {}", jdbcUrl.replaceAll(":[^/@]+@", ":***@"));
        return new HikariDataSource(config);
    }
}
