# pkt-todolist Project Context

## Project Overview
**pkt-todolist** is a user authentication-based ToDo List application designed to provide a secure and integrated schedule management experience.

*   **Goal**: Help users manage personal tasks alongside common schedules (like national holidays) with a safety net for accidental deletions.
*   **Core Value**:
    *   **Safe Deletion**: "Soft delete" mechanism with a Trash can (30-day retention).
    *   **Integrated View**: Personal tasks + Common schedules in one view.
    *   **Time-Based**: Start Date and Due Date for effective time management.

## Current Status: Planning & Design
The project is currently in the **Planning Phase**. The Product Requirements Document (PRD) and Domain Definition are complete, but implementation (coding) has not yet started.

## Tech Stack (Planned)
*   **Frontend**: React 18+ (Vite), Tailwind CSS, Zustand, React Router, Axios.
*   **Backend**: Java Spring Boot 3.2+, Spring Security (JWT), Spring Data JPA.
*   **Database**: PostgreSQL (Production), H2 (Development).
*   **Infrastructure**: Vercel (Frontend), Railway (Backend/DB).

## Architecture & key Entities
Based on `docs/1-domain-definition.md`:
*   **User**: `userId`, `username`, `email`, `password` (bcrypt), `isActive`.
*   **Todo**: `todoId`, `userId` (NULL for public), `title`, `startDate`, `dueDate`, `status` (ACTIVE, COMPLETED, DELETED).
*   **Trash**: `trashId`, `todoId`, `userId`, `deletedAt`, `canRestore`.

## Directory Structure
*   `docs/`: Contains comprehensive project documentation.
    *   `1-domain-definition.md`: Detailed domain model, entities, business rules, and use cases.
    *   `3-prd.md`: Product Requirements Document (Vision, User Personas, Features, Roadmap).
*   `.claude/`: Contains AI agent role definitions (e.g., `backend-developer.md`, `frontend-developer.md`).
*   `README.md`: Project entry point.

## Development Conventions (Planned)
*   **Style**:
    *   **Frontend**: Functional Components, Hooks, Utility-first CSS (Tailwind).
    *   **Backend**: Layered Architecture (Controller -> Service -> Repository).
*   **Commit Strategy**: Git flow with feature branches (`feature/*`).
*   **Testing**:
    *   Frontend: Vitest, React Testing Library.
    *   Backend: JUnit 5, Mockito.

## Next Steps (Immediate)
1.  **Environment Setup**: Initialize React (Frontend) and Spring Boot (Backend) projects.
2.  **Database Design**: Create SQL DDL based on the domain definition.
3.  **Implementation Phase 1**: Focus on User Authentication (Signup/Login) and basic ToDo CRUD.
