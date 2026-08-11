export type Project = {
  id: string;
  index: string;
  title: string;
  tagline: string;
  description: string;
  year: string;
  role: string;
  stack: string[];
  apiRoutes: { method: "GET" | "POST" | "PUT" | "DELETE"; path: string; note: string }[];
  authFlow: string[];
  metrics: { label: string; value: string }[];
  accent: string;
};

export const projects: Project[] = [
  {
    id: "atlas",
    index: "01",
    title: "Atlas Commerce",
    tagline: "Distributed e-commerce platform",
    description:
      "A high-throughput storefront and admin suite backed by a Spring Boot microservice cluster, with a React front end streaming live inventory over WebSockets.",
    year: "2025",
    role: "Lead Full-Stack Engineer",
    stack: ["Spring Boot", "React", "TypeScript", "PostgreSQL", "Redis", "Docker"],
    apiRoutes: [
      { method: "POST", path: "/api/v1/auth/login", note: "Issues JWT access + refresh pair" },
      { method: "GET", path: "/api/v1/catalog/products", note: "Paginated, Redis-cached" },
      { method: "POST", path: "/api/v1/orders", note: "Idempotent order creation" },
      { method: "GET", path: "/api/v1/orders/{id}", note: "Role-guarded resource" },
    ],
    authFlow: [
      "Client submits credentials to /auth/login",
      "Spring Security validates & signs a JWT (HS256)",
      "Access token (15m) + refresh token (7d) returned",
      "React stores access token in memory, refresh in httpOnly cookie",
      "Protected calls send Bearer token; filter validates signature",
      "Silent refresh renews the session before expiry",
    ],
    metrics: [
      { label: "p95 latency", value: "82ms" },
      { label: "Uptime", value: "99.98%" },
      { label: "Peak RPS", value: "4.2k" },
    ],
    accent: "#FF1E42",
  },
  {
    id: "sentinel",
    index: "02",
    title: "Sentinel Auth",
    tagline: "Zero-trust identity gateway",
    description:
      "A centralized authentication gateway providing JWT issuance, rotation and OAuth2 federation for a fleet of internal services, with fine-grained RBAC.",
    year: "2024",
    role: "Backend Architect",
    stack: ["Spring Security", "Java", "OAuth2", "JWT", "Keycloak", "Kubernetes"],
    apiRoutes: [
      { method: "POST", path: "/oauth2/token", note: "Client-credentials + password grants" },
      { method: "POST", path: "/auth/refresh", note: "Rotates refresh token, revokes old" },
      { method: "GET", path: "/auth/introspect", note: "Token validity + scopes" },
      { method: "DELETE", path: "/auth/sessions/{id}", note: "Remote session revocation" },
    ],
    authFlow: [
      "Service requests a token via OAuth2 grant",
      "Gateway authenticates the client & scopes the request",
      "Signed JWT minted with tenant + role claims",
      "Downstream services validate locally via JWKS",
      "Refresh rotation invalidates leaked tokens",
      "Audit log records every issuance & revocation",
    ],
    metrics: [
      { label: "Tokens/day", value: "1.1M" },
      { label: "Validation", value: "<3ms" },
      { label: "Services", value: "26" },
    ],
    accent: "#22D3A6",
  },
  {
    id: "pulse",
    index: "03",
    title: "Pulse Analytics",
    tagline: "Real-time metrics dashboard",
    description:
      "An event-driven analytics dashboard ingesting millions of events per hour through Kafka, surfaced in a React canvas-rendered visualization layer at 60 FPS.",
    year: "2024",
    role: "Full-Stack Engineer",
    stack: ["React", "Spring Boot", "Kafka", "TimescaleDB", "GSAP", "WebSocket"],
    apiRoutes: [
      { method: "GET", path: "/api/v1/metrics/stream", note: "SSE live metric feed" },
      { method: "POST", path: "/api/v1/events", note: "Batched ingestion endpoint" },
      { method: "GET", path: "/api/v1/reports/{range}", note: "Aggregated time-series" },
      { method: "PUT", path: "/api/v1/alerts/{id}", note: "Threshold configuration" },
    ],
    authFlow: [
      "Dashboard authenticates with a scoped JWT",
      "WebSocket upgrade carries the Bearer token",
      "Server validates token on handshake",
      "Authorized channels stream metric deltas",
      "Canvas layer diffs & repaints at 60 FPS",
      "Token expiry gracefully closes the socket",
    ],
    metrics: [
      { label: "Events/hr", value: "3.4M" },
      { label: "Render", value: "60 FPS" },
      { label: "Ingest lag", value: "120ms" },
    ],
    accent: "#5B8DEF",
  },
  {
    id: "forge",
    index: "04",
    title: "Forge CI",
    tagline: "Self-hosted deployment engine",
    description:
      "A container-native CI/CD engine that orchestrates build pipelines, with a Next.js control plane visualizing dependency graphs and live log streaming.",
    year: "2023",
    role: "Platform Engineer",
    stack: ["Next.js", "Spring Boot", "Docker", "GraphQL", "TypeScript", "Terraform"],
    apiRoutes: [
      { method: "POST", path: "/api/v1/pipelines/trigger", note: "Signed webhook entrypoint" },
      { method: "GET", path: "/api/v1/pipelines/{id}/logs", note: "Chunked log stream" },
      { method: "POST", path: "/api/v1/artifacts", note: "Immutable artifact upload" },
      { method: "GET", path: "/api/v1/graph", note: "Service dependency DAG" },
    ],
    authFlow: [
      "CI runner presents a machine JWT",
      "Gateway verifies signature & pipeline scope",
      "Short-lived deploy token scoped per job",
      "Control plane authorizes graph mutations",
      "Log stream gated by resource-level claims",
      "Token auto-expires at pipeline completion",
    ],
    metrics: [
      { label: "Builds/wk", value: "820" },
      { label: "Avg build", value: "3.1m" },
      { label: "Cache hit", value: "94%" },
    ],
    accent: "#F5A524",
  },
];
