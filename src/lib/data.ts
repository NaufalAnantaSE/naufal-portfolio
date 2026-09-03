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
    id: "londri-pos",
    title: "Londri Management System",
    subtitle: "Enterprise Laundry POS & Multi-Role Accrual Accounting",
    description:
      "Latest flagship project: Enterprise laundry operational ecosystem featuring role-based POS, strict cash vs accrual reconciliation, dynamic daily closing charts, automated thermal receipt printing, and staff attendance tracking.",
    tech: ["Express.js", "Next.js", "PostgreSQL", "Prisma", "TailwindCSS"],
    metrics: [
      { label: "Reconciliation", value: "Accrual & Cash" },
      { label: "Roles supported", value: "Staff & Admin" },
      { label: "Target runtime", value: "Node :3000" },
    ],
    repo: "https://github.com/NaufalAnantaSE",
    accent: "from-pink-500 via-rose-500 to-orange-400",
    year: "2026",
  },
  {
    id: "danabiz-qris",
    title: "Dynamic QRIS EMVCo Gateway",
    subtitle: "Static-to-Dynamic Merchant Payment Generator",
    description:
      "EMVCo-compliant payment generator parsing static merchant QRIS strings (DANA Bisnis), injecting custom transaction amounts (tag 54), recalculating CRC16-CCITT checksums, and providing both dual PNG streaming endpoints and a Vue 3 merchant dashboard.",
    tech: ["Express.js", "Vue 3", "Vite", "EMVCo", "TailwindCSS", "Docker"],
    metrics: [
      { label: "Checksum logic", value: "CRC16" },
      { label: "Spec standard", value: "EMVCo" },
      { label: "Output format", value: "PNG & Web" },
    ],
    repo: "https://github.com/NaufalAnantaSE/dynamic-qirs-generator",
    accent: "from-emerald-500 via-teal-500 to-cyan-500",
    year: "2026",
  },
  {
    id: "rest-vs-grpc",
    title: "REST vs gRPC Benchmark",
    subtitle: "High-Throughput Microservice Performance Analysis",
    description:
      "A quantitative comparative analysis evaluating REST vs gRPC protocols under synthetic peak traffic. NestJS microservices orchestrated with Docker Compose, instrumented with Prometheus and Grafana real-time metrics, hammered by K6 stress testing pipelines.",
    tech: ["NestJS", "gRPC", "Protobuf", "Prometheus", "Grafana", "K6", "Docker"],
    metrics: [
      { label: "Throughput gain", value: "7.4×" },
      { label: "p99 latency", value: "12ms" },
      { label: "Test scenarios", value: "24" },
    ],
    repo: "https://github.com/NaufalAnantaSE/performance-comparative-analysis",
    accent: "from-violet-600 via-purple-500 to-blue-500",
    year: "2024",
  },
  {
    id: "hanggar",
    title: "Hanggar Management System",
    subtitle: "Aircraft Operations & Movement Tracking",
    description:
      "Full-cycle management platform for aircraft hangar logistics — flight vehicle movement tracking, maintenance logging, technician assignment, and operational report generation with relational database modeling.",
    tech: ["TypeScript", "Next.js", "PostgreSQL", "Prisma", "TailwindCSS"],
    metrics: [
      { label: "Modules", value: "12" },
      { label: "Audit trail", value: "100%" },
      { label: "Manual work cut", value: "60%" },
    ],
    repo: "https://github.com/NaufalAnantaSE/Sistem-Pendataan-Keluar-Masuk-Hanggar",
    accent: "from-blue-600 via-indigo-500 to-violet-500",
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
      "Entered Telkom University Purwokerto — focused on algorithms, software architecture, and core computer science fundamentals.",
  },
  {
    year: "2023",
    title: "Backend & Microservices Focus",
    description:
      "Specialized in backend ecosystems (NestJS, Express, Python FastAPI), relational data modeling, and distributed system communication.",
  },
  {
    year: "2024",
    title: "Performance Benchmarking & Microservices",
    description:
      "Conducted extensive gRPC vs REST load tests (Prometheus/Grafana/K6) and engineered the Hanggar aircraft operations management system.",
  },
  {
    year: "2025",
    title: "Industry Internship at PT Ardata Digital Asia",
    description:
      "Web Developer Intern contributing to the Eduline platform backend, resolving critical mobile app crashes and optimizing database query pipelines.",
  },
  {
    year: "2026",
    title: "Bachelor of Software Engineering & Production Fintech",
    description:
      "Graduated with GPA 3.52/4.00 (149 credits, Thesis Grade A). Built flagship systems: Londri Multi-Role Management & EMVCo Dynamic QRIS Gateway.",
  },
];

export const socials = {
  email: "mailto:anantanaufal250@gmail.com",
  github: "https://github.com/NaufalAnantaSE",
  linkedin: "https://www.linkedin.com/in/naufalananta",
  instagram: "https://www.instagram.com/naufal_ananta_",
  cv: "https://drive.google.com/file/d/1kBkJSzYI52xX73r9ETeRrCDW5wNvKul7/view?usp=drive_link",
};
