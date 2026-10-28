# ==============================================================================
# Unified Production Multi-Stage Dockerfile
# Builds React TypeScript Frontend + Java 21 Spring Boot 3 Backend into One Full-Stack Container
# ==============================================================================

# Stage 1: Build Frontend Assets
FROM node:20-alpine AS frontend-builder
WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend ./
RUN npm run build

# Stage 2: Build Spring Boot Application with bundled Frontend
FROM maven:3.9.6-eclipse-temurin-21-alpine AS backend-builder
WORKDIR /workspace

# Cache Maven dependencies
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B

# Copy backend source
COPY backend/src ./src

# Inject compiled React bundle into Spring Boot's static resources
COPY --from=frontend-builder /frontend/dist/ ./src/main/resources/static/

# Package executable JAR
RUN mvn package -DskipTests -B

# Stage 3: Minimal, secure Alpine runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Run as unprivileged user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser:appgroup

COPY --from=backend-builder /workspace/target/*.jar app.jar

ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-8080}/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
