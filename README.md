# VoyageLedger | Travel Expense Calculator

> A modern, production-grade full-stack travel budgeting and expense planning application built with **React 18, TypeScript, Tailwind CSS**, and **Java 21 Spring Boot 3.3 REST API** with **PostgreSQL**.

[![Java 21](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot 3.3.4](https://img.shields.io/badge/Spring_Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React 18](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-cyan.svg)](https://tailwindcss.com/)
[![Tests Passing](https://img.shields.io/badge/Tests-34%20Passing-success.svg)](#-testing--quality-assurance)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**GitHub Repository:** [https://github.com/Ruchith4560/travel_expense_calculator.git](https://github.com/Ruchith4560/travel_expense_calculator.git)

---

## 📖 Overview

The **Travel Expense Calculator** is an enterprise-ready financial calculation tool for travellers. It enables trip planners to estimate combined trip expenses, determine fair per-traveller allocations, preview totals in real-time, and persistently record trip financial history across browser sessions.

### Business Rules & Mathematical Integrity
- **Total Trip Cost:** $\text{Travel Expense} + \text{Accommodation Expense} + \text{Food Expense}$
- **Per-Traveller Cost:** $\frac{\text{Total Trip Cost}}{\text{Number of Travellers}}$
- **Validation:** Days $\ge 1$, Travellers $\ge 1$, Expenses $\ge 0.00$.
- **Monetary Precision:** Implemented using `java.math.BigDecimal` with `RoundingMode.HALF_UP` (2 decimal places) on the server to prevent IEEE-754 floating-point inaccuracies.
- **Server Authority:** Authoritative totals are verified and calculated on the backend before database persistence.

---

## 🏛 System Architecture

The application implements a clean 4-tier layered architecture:

```
[ Client: React + TypeScript + Vite + Tailwind CSS ]
                         │
                 HTTP / REST (JSON)
                         │
[ Controller: Spring Boot @RestController & Validation ]
                         │
[ Service Layer: Pure Business Logic & BigDecimal Math ]
                         │
[ Repository: Spring Data JPA (Hibernate) ]
                         │
[ Persistence: PostgreSQL / In-Memory H2 (Dev/Test) ]
```

---

## 📂 Repository Structure

```
.
├── backend/                  # Java 21 Spring Boot REST API
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/travelexpense/calculator/
│   │   │   │   ├── config/      # ProductionDataSourceConfig, WebConfig
│   │   │   │   ├── controller/  # TripController REST endpoints
│   │   │   │   ├── dto/         # Request, Response, and Error DTOs
│   │   │   │   ├── entity/      # Trip JPA Entity with indices
│   │   │   │   ├── exception/   # GlobalExceptionHandler
│   │   │   │   ├── repository/  # TripRepository (Spring Data JPA)
│   │   │   │   └── service/     # TripService & TripServiceImpl (BigDecimal)
│   │   │   └── resources/       # Multi-profile properties (dev, prod, test)
│   │   └── test/                # 26 JUnit 5, Mockito & MockMvc tests
│   ├── Dockerfile            # Multi-stage container build
│   ├── mvnw.cmd              # Maven wrapper for Windows
│   ├── mvnw                  # Maven wrapper for Linux/macOS
│   └── pom.xml               # Maven dependencies and build plugins
├── frontend/                 # React 18 TypeScript Vite Application
│   ├── src/
│   │   ├── components/       # Header, TripForm, CostPreviewCard, SavedTripsList, StatsCards, Analytics, Toast
│   │   ├── services/         # Axios API client with dynamic host resolution
│   │   ├── types/            # TypeScript data contracts & models
│   │   └── utils/            # calculator.ts, exportCsv.ts, unit tests
│   ├── Dockerfile            # Multi-stage production Nginx container
│   ├── nginx.conf            # SPA routing & caching configuration
│   ├── tailwind.config.js    # Tailwind styling config
│   ├── vite.config.ts        # Vite build & reverse-proxy config
│   └── package.json          # Frontend dependencies & test scripts
├── docker-compose.yml        # Local multi-container orchestration (DB, API, Frontend)
├── render.yaml               # Render Infrastructure-as-Code Blueprint
├── .gitignore                # Production git ignore rules
└── README.md                 # Complete documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Java 21 LTS**
- **Node.js 20+** and **npm**
- **Git**
- Optional: **Docker** & **PostgreSQL** (H2 in-memory runs out of the box with zero external dependencies)

### Running the Backend Locally
```bash
cd backend
# Run test suite (26 tests)
./mvnw test

# Start the Spring Boot application (port 8080)
./mvnw spring-boot:run
```
- API Base: `http://localhost:8080/api`
- Actuator Health Check: `http://localhost:8080/actuator/health`
- H2 Console (Dev Profile): `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:travelexpensedb`)

### Running the Frontend Locally
```bash
cd frontend
# Install dependencies
npm install

# Run frontend tests (8 tests)
npm test

# Start Vite development server (port 5173 with auto-proxy to 8080)
npm run dev

# Run production build
npm run build
```

### Running with Docker Compose
```bash
docker compose up --build
```
This automatically spins up:
1. PostgreSQL 16 on port 5432
2. Spring Boot Backend on port 8080
3. React Nginx Frontend on port 3000

---

## ☁️ Deployment Guide (Render.com)

This application is ready to deploy on [Render](https://render.com) using two methods:

### Method 1: Automated 1-Click Blueprint (Recommended)

1. Fork or push this repository to GitHub: `https://github.com/Ruchith4560/travel_expense_calculator.git`
2. Log in to [dashboard.render.com](https://dashboard.render.com).
3. Click **New +** $\rightarrow$ **Blueprint**.
4. Connect your GitHub repository `travel_expense_calculator`.
5. Render detects [`render.yaml`](render.yaml) and automatically provisions all 3 services:
   - **Database (`travel-expense-db`):** Managed PostgreSQL Free Tier.
   - **Backend (`travel-expense-backend`):** Dockerized Spring Boot Web Service (connects to database automatically, health check at `/actuator/health`).
   - **Frontend (`travel-expense-frontend`):** Vite Static Site (`npm install && npm run build`, auto-injects `VITE_API_BASE_URL`).
6. Click **Apply**. Within a few minutes, all three services are live and connected!

---

### Method 2: Manual Dashboard Setup on Render

If you prefer configuring services individually on Render:

#### 1. PostgreSQL Database
- Click **New +** $\rightarrow$ **PostgreSQL**.
- Name: `travel-expense-db`
- Database: `travelexpensedb`
- User: `postgres`
- Plan: **Free**
- Copy the **Internal Database URL** once created (e.g. `postgres://...`).

#### 2. Backend Web Service
- Click **New +** $\rightarrow$ **Web Service**.
- Connect your GitHub repository.
- Root Directory: `backend`
- Environment: **Docker**
- DockerfilePath: `Dockerfile`
- Health Check Path: `/actuator/health`
- Plan: **Free**
- Add Environment Variables:
  - `SPRING_PROFILES_ACTIVE`: `prod`
  - `DATABASE_URL`: *Paste the Internal Database URL from Step 1*
  - `CORS_ALLOWED_ORIGINS`: `https://*.onrender.com,http://localhost:5173`
- Click **Create Web Service**. Note the deployed backend URL (e.g., `https://travel-expense-backend.onrender.com`).

#### 3. Frontend Static Site
- Click **New +** $\rightarrow$ **Static Site**.
- Connect your GitHub repository.
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Add Environment Variable:
  - `VITE_API_BASE_URL`: `https://travel-expense-backend.onrender.com` *(your backend URL)*
- Under **Redirects/Rewrites**:
  - Source: `/*`
  - Destination: `/index.html`
  - Action: `Rewrite`
- Click **Create Static Site**.

---

## 🧪 Testing & Quality Assurance

Comprehensive automated tests cover every critical business rule, boundary condition, and edge case:

| Layer | Framework | Tests | Status | Key Coverage |
| :--- | :--- | :---: | :---: | :--- |
| **Backend Unit** | JUnit 5, Mockito | 15 | Passed | `BigDecimal` math, 2-decimal rounding, zero/negative inputs, whitespace trimming |
| **Backend MockMvc** | Spring Test, MockMvc | 6 | Passed | REST endpoints, HTTP status codes (201, 200, 400, 404), validation payloads |
| **Backend Integration** | Spring Boot Test, H2 | 4 | Passed | Full create $\rightarrow$ persist $\rightarrow$ fetch $\rightarrow$ delete database lifecycle |
| **Backend Repository** | DataJpaTest | 1 | Passed | Custom JPA query `findAllByOrderByCreatedAtDesc()` |
| **Frontend Utilities** | Node.js Test Runner | 8 | Passed | Client live math, half-up rounding, form validation rules, edge cases |
| **Total Automated** | | **34** | **100% Passed** | **Zero failures, zero regressions** |

Run tests:
```bash
# Backend tests
cd backend && ./mvnw test

# Frontend tests
cd frontend && npm test
```

---

## 📡 REST API Reference

| Method | Endpoint | Description | Request Body | Success Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/trips` | Create & calculate new trip | `TripRequestDto` | `201 Created` (`TripResponseDto`) |
| `GET` | `/api/trips` | Retrieve all trips (newest first) | None | `200 OK` (`TripResponseDto[]`) |
| `GET` | `/api/trips/{id}` | Retrieve single trip by ID | None | `200 OK` (`TripResponseDto`) |
| `DELETE` | `/api/trips/{id}` | Delete trip by ID | None | `204 No Content` |
| `GET` | `/actuator/health`| Production health check | None | `200 OK` (`{"status":"UP"}`) |

---

## 💼 Technical Interview Mentor Guide

### Key Questions & Answers

#### Q1: Why use `BigDecimal` instead of `double` or `float` for monetary calculations?
> **Answer:** `double` and `float` use binary IEEE-754 floating-point representation. They cannot represent decimal fractions such as `0.1` or `0.01` exactly, resulting in compounding precision drift (e.g. `0.1 + 0.2 = 0.30000000000000004`). In financial software, every cent must balance. `BigDecimal` provides arbitrary-precision signed decimal numbers with explicit rounding modes (`RoundingMode.HALF_UP`), preventing rounding leaks.

#### Q2: Why calculate authoritative totals on the backend if the frontend already shows a live preview?
> **Answer:** Never trust client input for business or financial logic. A frontend preview provides an interactive UX, but malicious clients or network proxies can tamper with HTTP payloads. Calculating and rounding totals on the server guarantees mathematical integrity before saving to the database.

#### Q3: How does the application handle database portability between local development and cloud production?
> **Answer:** Through Spring Boot profiles (`dev`, `prod`, `test`). In `dev` and `test`, an in-memory H2 database runs with zero external setup. In `prod`, `ProductionDataSourceConfig` reads cloud URIs (`postgres://user:pass@host:port/db` or standard JDBC strings), parses credentials, sets `sslmode=require`, and configures HikariCP connection pooling.

#### Q4: How is container security ensured in the Dockerfile?
> **Answer:** By employing a multi-stage build: stage 1 compiles the application using Maven, while stage 2 copies only the final `.jar` into a minimal Alpine JRE image. The container runs under an unprivileged user (`appuser:appgroup`) instead of `root`, reducing attack surface.

---

## 📄 License
This project is licensed under the MIT License.
