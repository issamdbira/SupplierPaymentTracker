# FinancePro: Invoice and Payment Management System

## Overview

FinancePro is a full-stack web application for managing supplier invoices, payments, and financial tracking. The application allows users to track invoices, plan payments through installments, manage suppliers, and view financial analytics through a dashboard.

The application is built using a React frontend with a Node.js Express backend. It uses a PostgreSQL database with Drizzle ORM for data management and features a modern UI built with Tailwind CSS and Radix UI components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with React and follows a component-based architecture using functional components with hooks. The UI is designed using Tailwind CSS for styling and leverages the shadcn/ui component library, which is built on top of Radix UI primitives. 

Key aspects of the frontend:
- React for UI rendering and component management
- React Query for data fetching and state management
- React Hook Form for form handling and validation
- Wouter for client-side routing
- Recharts for data visualization
- Context API for theme management

### Backend Architecture

The backend uses an Express.js server that serves both the API endpoints and the client-side React application. The server is structured to handle API requests and provide data to the frontend.

Key aspects of the backend:
- Express.js for the server framework
- RESTful API design for client-server communication
- Middleware for request logging and error handling
- Drizzle ORM for database interactions
- Zod for schema validation

### Data Storage

The application uses PostgreSQL as its database, with Drizzle ORM for database schema definition and queries. The schema includes tables for users, suppliers, invoices, installments, and activity logs.

### Authentication and Authorization

The application includes a basic role-based authorization system with user management. Users can have different roles (like "user" or potentially "admin") with potentially different permissions.

## Key Components

### Server Components

1. **Express Server** (`server/index.ts`): Entry point that sets up Express middleware and routes.
2. **API Routes** (`server/routes.ts`): Defines REST API endpoints for CRUD operations.
3. **Storage Interface** (`server/storage.ts`): Defines the interface for database operations.
4. **Vite Integration** (`server/vite.ts`): Handles integration with Vite for development and static file serving.

### Client Components

1. **UI Components** (`client/src/components/ui/`): Reusable UI components based on Radix UI primitives.
2. **Layout Components** (`client/src/components/layout/`): Page layout components including AppLayout, Sidebar, and TopNav.
3. **Feature Components**: Each feature has its own set of components (e.g., `client/src/components/invoices/`).
4. **Pages** (`client/src/pages/`): Page components for each route in the application.
5. **Hooks** (`client/src/hooks/`): Custom React hooks for reusable logic.
6. **Utilities** (`client/src/lib/`): Utility functions for API calls, PDF generation, etc.

### Shared Components

1. **Database Schema** (`shared/schema.ts`): Defines the database schema using Drizzle ORM and Zod validators.

## Data Flow

1. **Client Requests**: The React frontend sends HTTP requests to the Express backend using React Query.
2. **API Handling**: The Express server processes these requests through defined routes.
3. **Database Operations**: The storage interface executes database operations using Drizzle ORM.
4. **Response**: The server sends JSON responses back to the client.
5. **UI Updates**: React Query automatically updates the UI based on the received data.

For example, when loading the dashboard:
1. The Dashboard component mounts and triggers React Query hooks
2. These hooks send requests to endpoints like `/api/dashboard/stats`
3. The server processes these requests and queries the database
4. The server responds with JSON data
5. React Query updates the local state with this data
6. The UI re-renders to display the updated information

## External Dependencies

### Frontend
- React, React DOM for UI rendering
- Tailwind CSS for styling
- Radix UI components for accessible UI elements
- React Query for data fetching
- Wouter for routing
- Recharts for data visualization
- jsPDF for PDF generation
- date-fns for date manipulation

### Backend
- Express for the server framework
- Drizzle ORM for database interactions
- Zod for schema validation
- Neon Database (Postgres) via @neondatabase/serverless

## Deployment Strategy

The application is configured for deployment on Replit using its autoscale capability:

1. **Build Process**: The `npm run build` command:
   - Builds the React frontend with Vite
   - Bundles the server code with esbuild

2. **Production Startup**: The `npm run start` command runs the server in production mode.

3. **Dev Environment**: The `npm run dev` command starts the development server with hot reloading.

The app uses Replit's built-in PostgreSQL database for data storage.

## Development Workflow

1. **Setup**:
   - The application needs a PostgreSQL database. The Replit configuration already includes this.
   - The `DATABASE_URL` environment variable must be set for database connectivity.

2. **Database Management**:
   - Drizzle is used for database schema management.
   - Run `npm run db:push` to synchronize the database schema with the code.

3. **Local Development**:
   - Use `npm run dev` to start the development server.
   - The server runs on port 5000 by default.

4. **Building**:
   - Use `npm run build` to create a production build.
   - The build output is stored in the `dist` directory.

5. **Production**:
   - Use `npm run start` to run the production server.
   - The server serves the static frontend files from the `dist/public` directory.

## Feature Implementation Plan

1. **Dashboard**: Complete implementation of analytics and summary data
2. **Invoices**: Complete the CRUD operations for invoices
3. **Payments**: Implement installment planning and payment tracking
4. **Suppliers**: Complete supplier management functionality
5. **User Management**: Add authentication and user management features
6. **Settings**: Complete user preference settings
7. **Financial Reports**: Add PDF export for financial reports

## Known Issues or Limitations

1. The authentication system is not fully implemented in the current version.
2. The database schema shows relationships between tables but those might need to be refined.
3. Some UI components may require responsive design improvements for mobile devices.