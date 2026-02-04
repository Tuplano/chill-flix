# Production-Ready Folder Structure & Architecture

This document outlines the proposed folder structure and architecture for the `chill-flix` application, designed for scalability, maintainability, and production readiness.

## 1. Folder Tree Structure

```
src/
├── components/          # UI Components
│   ├── common/          # Reusable atomic components (Button, Input, Card)
│   ├── layout/          # Layout specific components (Header, Sidebar, Footer)
│   └── modules/         # Feature-specific components (e.g., DashboardWidget)
├── config/              # App configuration
│   └── paths.ts         # Centralized route constants
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication hook
│   └── useFetch.ts      # Data fetching hook
├── lib/                 # Utilities and libraries setup
│   ├── utils.ts         # Helper functions
│   └── constants.ts     # Global constants
├── routes/              # TanStack Router definitions
│   ├── __root.tsx       # Root layout (Providers)
│   ├── _public.tsx      # Layout for public pages (Landing, About)
│   ├── _public/         # Public route files
│   │   ├── index.tsx    # Home page
│   │   └── about.tsx    # About page
│   ├── _auth.tsx        # Layout for authenticated pages (Auth Guard)
│   └── _auth/           # Authenticated route files
│       └── dashboard.tsx
├── services/            # API and Business Logic
│   ├── api.ts           # HTTP Client configuration (Axios/Fetch)
│   └── auth.ts          # Authentication service
├── types/               # Global TypeScript definitions
│   └── index.ts         # distinct type files can be added here
└── main.tsx             # Entry point
```

## 2. Explanation of Major Folders

- **`routes/` (File-Based Routing)**:
  - Uses `_public` and `_auth` "pathless layouts" to group routes that share layouts or middleware without adding segments to the URL.
  - `_auth.tsx` acts as the **Auth Guard**, checking authentication before rendering child routes.

- **`services/`**:
  - Isolates API communication from UI components.
  - `api.ts` handles global concerns like auth tokens in headers and error handling.

- **`config/paths.ts`**:
  - **Centralized Routing**: Defines all route paths in one object. This prevents hardcoded strings scattered throughout the app ("magic strings").

- **`components/common` vs `modules`**:
  - `common`: Generic, dumb components (UIButton).
  - `modules`: State-aware or business-logic-heavy components specific to a feature.

## 3. Example Code Snippets

### A. Centralized Route Definitions (`src/config/paths.ts`)

```typescript
export const PATHS = {
  HOME: "/",
  ABOUT: "/about",
  LOGIN: "/login",
  DASHBOARD: {
    ROOT: "/dashboard",
    SETTINGS: "/dashboard/settings",
    PROFILE: "/dashboard/profile",
  },
} as const;
```

### B. Service Layer (`src/services/api.ts`)

```typescript
import { getAuthToken } from "@/lib/auth";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

interface RequestConfig extends RequestInit {
  data?: unknown;
}

async function request<T>(
  endpoint: string,
  config: RequestConfig = {},
): Promise<T> {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...config.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...config,
    headers,
    body: config.data ? JSON.stringify(config.data) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  get: <T>(url: string, config?: RequestConfig) =>
    request<T>(url, { ...config, method: "GET" }),
  post: <T>(url: string, data: unknown, config?: RequestConfig) =>
    request<T>(url, { ...config, method: "POST", data }),
  // ... put, delete
};
```

### C. Type Definitions (`src/types/index.ts`)

```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
```

### D. Middleware / Auth Guard (`src/routes/_auth.tsx`)

```typescript
import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';
import { checkAuthStatus } from '@/services/auth'; // Hypothetical service
import { PATHS } from '@/config/paths';

export const Route = createFileRoute('/_auth')({
  beforeLoad: async ({ location }) => {
    // Check if user is authenticated
    const isAuthenticated = await checkAuthStatus();

    if (!isAuthenticated) {
      throw redirect({
        to: PATHS.LOGIN,
        search: {
          // Redirect back to the page they were trying to visit
          redirect: location.href,
        },
      });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-900 text-white">
        {/* Sidebar Component */}
        <nav>Dashboard Nav</nav>
      </aside>
      <main className="flex-1 overflow-auto bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  );
}
```

### E. Custom Hook (`src/hooks/useUser.ts`)

```typescript
import { useState, useEffect } from "react";
import { api } from "@/services/api";
import type { User } from "@/types";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<User>("/me")
      .then(setUser)
      .catch((err) => console.error("Failed to fetch user", err))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}
```
