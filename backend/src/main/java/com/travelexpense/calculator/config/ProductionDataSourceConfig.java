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
        HikariConfig config = new HikariConfig();
        config.setDriverClassName("org.postgresql.Driver");

        String jdbcUrl;
        String username = rawUsername;
        String password = rawPassword;

        if (rawDatabaseUrl != null && (rawDatabaseUrl.startsWith("postgres://") || rawDatabaseUrl.startsWith("postgresql://"))) {
            try {
                URI uri = new URI(rawDatabaseUrl);
                String host = uri.getHost();
                int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                String path = uri.getPath();
                String query = uri.getQuery();

                if (uri.getUserInfo() != null && (username == null || username.trim().isEmpty())) {
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

                log.info("Normalized cloud DATABASE_URL to JDBC URL for host: {}:{}", host, port);
            } catch (URISyntaxException e) {
                log.warn("Failed to parse DATABASE_URL as URI, using fallback: {}", e.getMessage());
                jdbcUrl = rawDatabaseUrl.startsWith("jdbc:") ? rawDatabaseUrl : "jdbc:" + rawDatabaseUrl;
            }
        } else {
            jdbcUrl = (rawDatabaseUrl == null || rawDatabaseUrl.trim().isEmpty())
                    ? "jdbc:postgresql://localhost:5432/travelexpensedb"
                    : rawDatabaseUrl;
        }

        config.setJdbcUrl(jdbcUrl);
        if (username != null && !username.trim().isEmpty()) {
            config.setUsername(username);
        }
        if (password != null && !password.trim().isEmpty()) {
            config.setPassword(password);
        }

        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setIdleTimeout(300000);
        config.setConnectionTimeout(20000);
        config.setMaxLifetime(1200000);

        return new HikariDataSource(config);
    }
}
