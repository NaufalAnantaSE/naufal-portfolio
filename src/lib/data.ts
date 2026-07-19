export type Project = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tech: string[];
  metrics: { label: string; value: string }[];
  repo: string;
  demo?: string;
  accent: string; // gradient stops
  year: string;
};

export const projects: Project[] = [
  {
    id: "rest-vs-grpc",
    title: "REST vs gRPC",
    subtitle: "Performance Comparative Analysis",
    description:
      "A deep-dive benchmark comparing REST and gRPC under real production-like load. NestJS microservices instrumented with Prometheus, visualized in Grafana, and hammered with K6 scenarios — measuring latency percentiles, throughput, and payload overhead.",
    tech: ["NestJS", "gRPC", "Prometheus", "Grafana", "K6", "Docker"],
    metrics: [
      { label: "Throughput gain", value: "7.4×" },
      { label: "p99 latency", value: "12ms" },
      { label: "Test scenarios", value: "24" },
    ],
    repo: "https://github.com/NaufalAnantaSE",
    accent: "from-violet-600 via-purple-500 to-blue-500",
    year: "2024",
  },
  {
    id: "devflow",
    title: "DevFlow",
    subtitle: "NestJS Developer Platform Backend",
    description:
      "A production-grade Q&A platform backend built with NestJS — modular architecture, JWT auth with refresh rotation, role-based access, Redis caching, and a cleanly versioned REST API. Designed as a reference implementation for scalable NestJS systems.",
    tech: ["NestJS", "PostgreSQL", "Redis", "TypeORM", "JWT", "Docker"],
    metrics: [
      { label: "API endpoints", value: "40+" },
      { label: "Test coverage", value: "85%" },
      { label: "Response time", value: "<50ms" },
    ],
    repo: "https://github.com/NaufalAnantaSE",
    accent: "from-blue-600 via-indigo-500 to-violet-500",
    year: "2024",
  },
  {
    id: "destination-api",
    title: "Destination API",
    subtitle: "Python Tourism Intelligence Service",
    description:
      "A FastAPI service powering destination discovery — geospatial queries, ML-based recommendations, and an async data pipeline. Containerized, documented with OpenAPI, and deployed with CI/CD automation.",
    tech: ["Python", "FastAPI", "PostgreSQL", "SQLAlchemy", "Docker"],
    metrics: [
      { label: "Destinations", value: "1.2K+" },
      { label: "Avg latency", value: "38ms" },
      { label: "Uptime", value: "99.9%" },
    ],
    repo: "https://github.com/NaufalAnantaSE",
    accent: "from-orange-500 via-amber-500 to-yellow-400",
    year: "2023",
  },
  {
    id: "hanggar",
    title: "Hanggar",
    subtitle: "Aircraft Hangar Management System",
    description:
      "End-to-end management system for aircraft hangar operations — scheduling, maintenance tracking, inventory and reporting. Built with a relational-first design and a dashboard that turns raw operational data into decisions.",
    tech: ["Laravel", "MySQL", "Livewire", "TailwindCSS"],
    metrics: [
      { label: "Modules", value: "12" },
      { label: "Records managed", value: "10K+" },
      { label: "Manual work cut", value: "60%" },
    ],
    repo: "https://github.com/NaufalAnantaSE",
    accent: "from-emerald-500 via-teal-500 to-cyan-500",
    year: "2023",
  },
  {
    id: "portfolio-backend",
    title: "Naufal Ananta Portfolio",
    subtitle: "Interactive Portfolio Experience",
    description:
      "An immersive portfolio experience for Naufal Ananta, combining editorial typography, motion, 3D scenes, and a clear view into backend, AI, and cloud work.",
    tech: ["NestJS", "PostgreSQL", "Docker", "AWS", "Nginx"],
    metrics: [
      { label: "Cold start", value: "<200ms" },
      { label: "Cache hit rate", value: "94%" },
      { label: "Deploy time", value: "45s" },
    ],
    repo: "https://astro-portfolio-git-main-naufalanantases-projects.vercel.app/",
    demo: "https://astro-portfolio-git-main-naufalanantases-projects.vercel.app/",
    accent: "from-pink-500 via-rose-500 to-orange-400",
    year: "2024",
  },
];

export type TechItem = {
  name: string;
  category: "Frontend" | "Backend" | "Database" | "Cloud" | "DevOps" | "AI";
  color: string;
};

export const techStack: TechItem[] = [
  { name: "React", category: "Frontend", color: "#61dafb" },
  { name: "Next.js", category: "Frontend", color: "#ffffff" },
  { name: "TypeScript", category: "Frontend", color: "#3178c6" },
  { name: "TailwindCSS", category: "Frontend", color: "#38bdf8" },
  { name: "NestJS", category: "Backend", color: "#ea2845" },
  { name: "Node.js", category: "Backend", color: "#68a063" },
  { name: "Python", category: "Backend", color: "#ffd343" },
  { name: "FastAPI", category: "Backend", color: "#05998b" },
  { name: "gRPC", category: "Backend", color: "#5ac5c9" },
  { name: "Laravel", category: "Backend", color: "#ff2d20" },
  { name: "PostgreSQL", category: "Database", color: "#336791" },
  { name: "MySQL", category: "Database", color: "#00758f" },
  { name: "Redis", category: "Database", color: "#dc382d" },
  { name: "MongoDB", category: "Database", color: "#47a248" },
  { name: "AWS", category: "Cloud", color: "#ff9900" },
  { name: "GCP", category: "Cloud", color: "#4285f4" },
  { name: "Vercel", category: "Cloud", color: "#ffffff" },
  { name: "Docker", category: "DevOps", color: "#2496ed" },
  { name: "Kubernetes", category: "DevOps", color: "#326ce5" },
  { name: "Nginx", category: "DevOps", color: "#009639" },
  { name: "GitHub Actions", category: "DevOps", color: "#2088ff" },
  { name: "TensorFlow", category: "AI", color: "#ff6f00" },
  { name: "PyTorch", category: "AI", color: "#ee4c2c" },
  { name: "LangChain", category: "AI", color: "#1c3c3c" },
  { name: "OpenAI", category: "AI", color: "#74aa9c" },
];

export const categories = [
  "Frontend",
  "Backend",
  "Database",
  "Cloud",
  "DevOps",
  "AI",
] as const;

export const timeline = [
  {
    year: "2022",
    title: "Started Software Engineering",
    description:
      "Began the journey at Telkom University Purwokerto — first lines of code, first bugs, first all-nighters.",
  },
  {
    year: "2022",
    title: "Learned React",
    description:
      "Fell in love with component-driven UI. Built SPAs, learned state management and the modern frontend ecosystem.",
  },
  {
    year: "2023",
    title: "Learned NestJS",
    description:
      "Discovered the backend rabbit hole. Dependency injection, modular architecture, and TypeScript end-to-end.",
  },
  {
    year: "2023",
    title: "Built Microservices",
    description:
      "Designed distributed systems — message queues, API gateways, service discovery, and the art of graceful failure.",
  },
  {
    year: "2024",
    title: "Started AI Projects",
    description:
      "Integrated LLMs and ML pipelines into real products. RAG systems, embeddings, and AI-powered backends.",
  },
  {
    year: "2024",
    title: "Open Source Contributions",
    description:
      "Giving back to the ecosystem — 60+ public repositories, contributions, and tools built in the open.",
  },
];

export const socials = {
  email: "https://github.com/NaufalAnantaSE",
  github: "https://github.com/NaufalAnantaSE",
  linkedin: "https://www.linkedin.com/in/naufalananta",
  instagram: "https://www.instagram.com/naufalananta",
};
