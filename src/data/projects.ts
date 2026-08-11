export type Project = {
  id: string;
  index: string;
  title: string;
  tagline: string;
  description: string;
  year: string;
  role: string;
  liveUrl: string;
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
    tagline: "Reddit-inspired social platform",
    description:
      "A full-stack social network with communities, image posts, likes, comments and emoji reactions — plus real-time direct messaging and live notifications over Socket.IO.",
    year: "2025",
    role: "Full-Stack Developer",
    liveUrl: "https://socialmediaapplic.netlify.app/",
    repoUrl: "https://github.com/Hmmzza12/SOCIALMEDIA-APP",
    stack: [
      "React 19",
      "Vite",
      "Tailwind CSS",
      "Express 5",
      "TypeScript",
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
      "Organizations, projects, tasks, labels and a drag-and-drop Kanban board — all driven by one Fastify REST API that serves both a React web app and a Commander-based CLI client.",
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
      { label: "Drag & drop", value: "Kanban" },
    ],
    accent: "#F5A524",
  },
];
