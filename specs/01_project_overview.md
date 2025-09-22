# 01_project_overview.md

## Project Overview

Windfall is a web-based blackjack & card-counting application built with modern web technologies, designed to provide users with genuninely helpful card-counting concepts, techniques, drills, and performance reports within a gamified experience. It is a single player game designed to teach users how to card-count.

The project serves as a comprehensive platform for BlackJack enthusiasts to practice their skills, learn optimal strategies, and track their progress over time. Built with Next.js 15 and Supabase, it provides a robust foundation for real-time gaming experiences with secure user authentication and data persistence.

## Architecture Philosophy

The application follows a specification-first development approach where major features are documented and designed before implementation. This ensures consistent architecture decisions and provides clear guidance for development priorities.

The system is designed around three core pillars: **Security** (robust authentication and data protection), **Performance** (fast loading times and responsive gameplay), and **User Experience** (intuitive interfaces and engaging interactions).

## Technology Stack

### Core Framework

The application is built on Next.js 15.5.3 with the App Router architecture, providing server-side rendering, optimal performance, and modern React features. TypeScript ensures type safety across the entire codebase, reducing runtime errors and improving developer productivity.

### Authentication & Backend

Supabase serves as the backend-as-a-service solution, providing PostgreSQL database, real-time subscriptions, and authentication services. The `@supabase/ssr` package enables seamless server-side rendering with authenticated requests, while custom middleware handles route protection and session management.

### Styling & UI

Tailwind CSS 4 provides utility-first styling with a custom theme system. The application uses gradient backgrounds and modern design patterns to create an immersive casino atmosphere. Responsive design ensures optimal experiences across desktop and mobile devices.

### Development Tooling

The development environment includes comprehensive tooling for code quality and testing:

- **ESLint + Prettier**: Enforces consistent code formatting and best practices
- **Husky + lint-staged**: Automated pre-commit hooks for quality assurance
- **Jest + React Testing Library**: Unit and integration testing framework
- **TypeScript**: Static type checking and enhanced developer experience

## Application Structure

### Page Architecture

The application follows a hub-and-spoke navigation model with the home page serving as the central menu. Each major feature area has its own dedicated page:

```
/ (Home)          - Main menu and user dashboard
├── /casino       - BlackJack gameplay interface
├── /school       - Learning resources and tutorials
├── /reports      - Game statistics and analytics
└── /settings     - User preferences and configuration
```

### Authentication Flow

All application routes except `/login`, `/auth/*`, and `/error` require authentication. The middleware automatically redirects unauthenticated users to the login page, while authenticated users access the full application feature set.

### Component Organization

Components are organized by feature area with shared components in the root app directory. Authentication-related components handle user sessions, while page-specific components encapsulate feature functionality.

## Feature Domains

### Casino Domain

The core gaming experience centered around BlackJack gameplay. This includes game state management, card mechanics, betting systems, and real-time user interactions. The casino domain serves as the primary avenue for users to test the skills they've learned in other parts of the application.

### Educational Domain

Learning resources and strategy guides help users improve their BlackJack skills. The school section provides tutorials, rule explanations, and strategic insights for players of all skill levels.

### Analytics Domain

Comprehensive tracking of user gameplay patterns, win/loss statistics, and performance metrics. The reports system provides insights into user progress and game trends over time.

### Configuration Domain

User preferences, game settings, and application configuration options. The settings domain allows personalization of the gaming experience and account management.

## Data Architecture

### User Management

User accounts are managed through Supabase Auth with email/password authentication. User sessions persist across browser sessions with secure cookie management handled by the Supabase SSR package.

### Game State

Game states are managed through React state with potential integration of Redux or Zustand for complex game flows. Session data persists to the database for continuing games and maintaining user progress.

### Analytics Storage

Game events and user interactions are tracked and stored for analytics processing. Historical data enables trend analysis and performance reporting across user sessions.

## Development Workflow

### Specification-First Development

New features begin with specification documents that define requirements, architecture, and implementation details. These living documents are updated as features evolve and provide clear guidance for development teams.

### Quality Assurance

The development workflow includes automated testing, code formatting, and type checking. Pre-commit hooks ensure code quality standards are maintained, while CI/CD pipelines provide automated deployment and testing.

### Version Control

Git workflow follows conventional commit standards with semantic versioning. Feature branches enable parallel development while maintaining stable main branch deployments.

## Future Roadmap

### Phase 1: Core Gameplay

Implementation of basic BlackJack game mechanics, betting system, and user interface. This phase establishes the foundation for all future gaming features.

### Phase 2: Enhanced Features

Advanced game options, gameplay records, and expanded analytics & reports.

### Phase 3: Educational Content

Comprehensive tutorial system, strategy guides, and interactive learning tools. This phase transforms the application from pure entertainment to educational platform.

### Phase 4: Deployment

Create a production pipeline, configure hosting service (probably vercel), and setup project to exist for a finite amount of time.

## Technical Considerations

### Performance Optimization

Server-side rendering with Next.js provides fast initial page loads, while client-side navigation ensures smooth user experiences. Turbopack development mode reduces build times during development.

### Security Framework

Supabase authentication provides enterprise-grade security with proper session management. Middleware enforces authentication requirements across all protected routes, preventing unauthorized access.

### Scalability Planning

The architecture supports horizontal scaling through Supabase's managed infrastructure. Database design accommodates growing user bases and increasing game data volumes.

## References

none so far
