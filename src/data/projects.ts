export type Project = {
  id: string;
  index: string;
  title: string;
  tagline: string;
  description: string;
  year: string;
  role: string;
  liveUrl?: string;
  repoUrl: string;
  stack: string[];
  apiRoutes: { method: "GET" | "POST" | "PUT" | "DELETE"; path: string; note: string }[];
  authFlow: string[];
  metrics: { label: string; value: string }[];
  accent: string;
};

export const projects: Project[] = [
  {
    id: "pulse",
    index: "01",
    title: "Pulse",
    tagline: "Real-time social platform",
    description:
      "Communities, feeds, posts and direct messaging with real-time notifications, JWT access/refresh authentication and responsive UI.",
    year: "2025",
    role: "Full-Stack Developer",
    liveUrl: "https://socialmediaapplic.netlify.app/",
    repoUrl: "https://github.com/Hmmzza12/SOCIALMEDIA-APP",
    stack: [
      "React",
      "TypeScript",
      "Express",
      "Socket.IO",
      "Turso",
      "JWT",
    ],
    apiRoutes: [
      { method: "POST", path: "/api/auth/login", note: "Issues JWT access + refresh pair" },
      { method: "GET", path: "/api/posts", note: "Paginated community feed" },
      { method: "POST", path: "/api/posts", note: "Create post with image upload" },
      { method: "POST", path: "/api/communities/:id/join", note: "Join / leave a community" },
      { method: "GET", path: "/api/notifications", note: "Likes, comments, follows, mentions" },
      { method: "DELETE", path: "/api/posts/:id", note: "Author-only removal" },
    ],
    authFlow: [
      "Client posts credentials to /api/auth/login",
      "Password verified against a bcrypt hash",
      "Server signs a JWT access + refresh token pair",
      "Access token authorizes REST + Socket.IO calls",
      "Refresh token silently renews the session",
      "Parameterized SQL guards every query",
    ],
    metrics: [
      { label: "Socket.IO", value: "Real-time" },
      { label: "Access + refresh", value: "JWT" },
      { label: "+ Express 5", value: "React 19" },
    ],
    accent: "#FF1E42",
  },
  {
    id: "forge",
    index: "02",
    title: "Forge",
    tagline: "Team project management — a tiny Linear/Jira",
    description:
      "REST API, web app and CLI for organizations, tasks, Kanban boards and RBAC — with secure token flows and 66 API integration tests.",
    year: "2025",
    role: "Full-Stack Developer",
    liveUrl: "https://forgecli.netlify.app/login",
    repoUrl: "https://github.com/Hmmzza12/CLI-PROJECT",
    stack: [
      "Fastify 5",
      "React",
      "Drizzle ORM",
      "TanStack",
      "Tailwind v4",
      "Commander.js",
      "Turso",
      "JWT",
    ],
    apiRoutes: [
      { method: "POST", path: "/auth/login", note: "Rate-limited, Zod-validated" },
      { method: "POST", path: "/auth/refresh", note: "Rotates the refresh token" },
      { method: "GET", path: "/orgs/:id/projects", note: "Org-scoped projects" },
      { method: "POST", path: "/projects/:id/tasks", note: "Create a task" },
      { method: "GET", path: "/tasks?status=", note: "Filter, search & paginate" },
      { method: "POST", path: "/tasks/:id/comments", note: "Comment on a task" },
    ],
    authFlow: [
      "Login is rate-limited (10/min) & Zod-validated",
      "JWT access + rotating refresh token issued",
      "Refresh tokens stored as SHA-256 hashes",
      "Web clients hold refresh in an httpOnly cookie",
      "Service layer enforces Owner / Admin / Member",
      "Cross-tenant isolation guards each org boundary",
    ],
    metrics: [
      { label: "API · CLI · Web", value: "3 clients" },
      { label: "Owner/Admin/Member", value: "RBAC" },
      { label: "Integration tests", value: "66" },
    ],
    accent: "#F5A524",
  },
  {
    id: "auth-system",
    index: "03",
    title: "Auth System",
    tagline: "Advanced authentication & authorization",
    description:
      "Access/refresh tokens, Google/GitHub/Facebook login, TOTP-based 2FA, password reset, account linking and rate limiting — built on Spring Boot 3.",
    year: "2025",
    role: "Full-Stack Developer",
    repoUrl: "https://github.com/Hmmzza12/Advanced-authentification-system",
    stack: [
      "Java 17",
      "Spring Boot 3",
      "React",
      "OAuth2",
      "JWT",
      "TOTP",
    ],
    apiRoutes: [
      { method: "POST", path: "/api/auth/register", note: "Create account with email verification" },
      { method: "POST", path: "/api/auth/login", note: "Issues JWT access + refresh pair" },
      { method: "POST", path: "/api/auth/oauth/:provider", note: "Google / GitHub / Facebook OAuth" },
      { method: "POST", path: "/api/auth/2fa/setup", note: "Enable TOTP-based two-factor auth" },
      { method: "POST", path: "/api/auth/password/reset", note: "Password reset via email link" },
      { method: "PUT", path: "/api/auth/account/link", note: "Link additional OAuth provider" },
    ],
    authFlow: [
      "User registers with email or OAuth provider",
      "Password hashed with bcrypt, email verified",
      "Login issues JWT access + refresh token pair",
      "Optional TOTP 2FA verification on login",
      "OAuth providers (Google, GitHub, Facebook) linkable",
      "Rate limiting protects all auth endpoints",
    ],
    metrics: [
      { label: "OAuth providers", value: "3" },
      { label: "Password + TOTP", value: "2FA" },
      { label: "Spring Boot 3", value: "Java 17" },
    ],
    accent: "#8B5CF6",
  },
  {
    id: "devmetrics",
    index: "04",
    title: "DevMetrics",
    tagline: "GitHub analytics dashboard",
    description:
      "OAuth-based GitHub analytics with background data synchronization, activity metrics and encrypted token storage.",
    year: "2025",
    role: "Full-Stack Developer",
    liveUrl: "https://devmetrics-beta.vercel.app",
    repoUrl: "https://github.com/Hmmzza12/DevMetrics",
    stack: [
      "TypeScript",
      "Fastify",
      "GitHub GraphQL",
      "Turso",
      "React",
      "Tailwind CSS",
    ],
    apiRoutes: [
      { method: "GET", path: "/api/auth/github", note: "Initiates GitHub OAuth flow" },
      { method: "GET", path: "/api/metrics/:username", note: "Aggregated GitHub analytics" },
      { method: "POST", path: "/api/sync", note: "Triggers background data sync" },
      { method: "GET", path: "/api/activity", note: "Commit patterns and streaks" },
      { method: "GET", path: "/api/languages", note: "Language usage breakdown" },
      { method: "GET", path: "/api/repos", note: "Repository statistics" },
    ],
    authFlow: [
      "GitHub OAuth initiates authorization redirect",
      "Callback exchanges code for access token",
      "Token encrypted at rest with AES-256",
      "Background sync fetches GitHub GraphQL data",
      "Metrics computed and cached in Turso",
      "Session persisted with httpOnly cookie",
    ],
    metrics: [
      { label: "GitHub GraphQL", value: "OAuth" },
      { label: "Background sync", value: "Real-time" },
      { label: "Encrypted tokens", value: "AES-256" },
    ],
    accent: "#10B981",
  },
];
