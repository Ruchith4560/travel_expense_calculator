# VoyageLedger | Travel Expense Calculator

> A modern, production-grade full-stack travel budgeting and expense planning application built with **React, TypeScript, Tailwind CSS**, and **Java 21 Spring Boot REST API**.

[![Java 21](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot 3.3.4](https://img.shields.io/badge/Spring_Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React 18](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-cyan.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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
│   │   │   ├── java/com/travelexpense/calculator/  # Source code
│   │   │   └── resources/                          # App properties (dev, test, prod)
│   │   └── test/                                   # JUnit 5 & Mockito test suite
│   ├── mvnw.cmd              # Maven wrapper for Windows
│   ├── mvnw                  # Maven wrapper for Linux/macOS
│   └── pom.xml               # Maven dependencies and build plugins
├── frontend/                 # React 18 TypeScript Vite Application
│   ├── src/                  # React components, hooks, and styles
│   ├── tailwind.config.js    # Tailwind styling config
│   ├── vite.config.ts        # Vite build & reverse-proxy config
│   └── package.json          # Frontend dependencies
├── .gitignore                # Production git ignore rules
└── README.md                 # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Java 21 LTS**
- **Node.js 20+** and **npm**
- **Git**
- Optional: **Docker** & **PostgreSQL** (H2 in-memory runs out of the box with zero external dependencies)

### Running the Backend
```bash
cd backend
# Run test suite
./mvnw test

# Start the Spring Boot application (port 8080)
./mvnw spring-boot:run
```
- API Base: `http://localhost:8080/api`
- Actuator Health Check: `http://localhost:8080/actuator/health`
- H2 Console (Dev Profile): `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:travelexpensedb`)

### Running the Frontend
```bash
cd frontend
# Install dependencies
npm install

# Start Vite development server (port 5173 with auto-proxy to 8080)
npm run dev

# Run production build
npm run build
```

---

## 📌 Phase Completion Status
- [x] **Phase 0:** Requirements analysis & technical specification
- [x] **Phase 1:** Git repository initialization, Spring Boot 3 + Java 21, React + TypeScript + Tailwind scaffolding, multi-profile DB configuration
- [x] **Phase 2:** Entity, DTOs, Repository, Service with `BigDecimal`, and REST Controller (18 unit & MockMvc tests passed)
- [x] **Phase 3:** Interactive Trip Form with Real-Time Cost Preview & Category Distribution
- [x] **Phase 4:** Full-Stack API Integration, Saved Trips Table/Card View, and Refresh Persistence
- [x] **Phase 5:** SaaS UI/UX Polish, Multi-Type Toast System, Demo Presets, Search & Multi-Column Sorting
- [x] **Phase 6:** Automated Testing & Security Suite (34 automated tests across Backend & Frontend)
- [ ] **Phase 7:** Optional Enhancements (Trip deletion, charts)
- [ ] **Phase 8:** Cloud Deployment (Docker, PostgreSQL, Render/Vercel)
- [ ] **Phase 9:** Technical Interview Mentor Guide & Portfolio Presentation
