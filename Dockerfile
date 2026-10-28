# ==============================================================================
# Root Dockerfile for Spring Boot REST API
# Allows building directly from repository root context on cloud platforms (e.g. Render)
# ==============================================================================

# Stage 1: Build application JAR
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /workspace

# Copy backend pom and cache dependencies
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B

# Copy backend source code and package executable JAR
COPY backend/src ./src
RUN mvn package -DskipTests -B

# Stage 2: Lightweight runtime environment
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create unprivileged application user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser:appgroup

# Copy compiled artifact
COPY --from=builder /workspace/target/*.jar app.jar

ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-8080}/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
