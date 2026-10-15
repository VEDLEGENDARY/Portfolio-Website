export const profile = {
    name: "Ved Patel",
    line: "Computer science student at UT Dallas. I build web products, AI tooling, and robot software.",
    lead: "Computer science student at UT Dallas.",
    main: "I build web products, AI tooling, and robot software.",
    github: "https://github.com/VEDLEGENDARY",
    resume: "/Resume_VedPatel.pdf",
    email: "ved.sp@outlook.com",
    location: "Irving, TX",
    timezone: "America/Chicago",
};
export const statement = "I'm a computer science student at UT Dallas who builds web products, AI tooling, and robot software. I've built APIs for tax and investment data, fine-tuned a language model on an Intel Arc GPU, and worked on particle filters for a competition robot.";
export const highlights = [
    { title: "1st place nationally", detail: "TSA Web Development, with NaviEats" },
    { title: "MLH Award", detail: "HackSMU, with NexDrop" },
    { title: "26th place", detail: "International VEXU Robotics Competition, with Comet Robotics" },
    { title: "5.0 rating", detail: "TruScope on the Chrome Web Store" },
];
export const stats = [
    { value: 1, suffix: "st", label: "Place nationally", detail: "TSA Web Development, with NaviEats" },
    { value: 5, decimals: 1, label: "Chrome Web Store rating", detail: "TruScope" },
    { value: 6000, suffix: "+", label: "Daily fund updates automated", detail: "VisorFin, Python and PostgreSQL" },
    { value: 90, suffix: "+", label: "Students taught robotics", detail: "Carrollton-Farmers Branch ISD" },
];
export const projects = [
    {
        slug: "navieats",
        name: "NaviEats",
        line: "Navigation-first food discovery",
        badge: "1st place, national TSA Web Dev",
        points: [
            "Full-stack web app built around navigation first and food discovery second.",
            "Ranked first nationally in the Technology Student Association Web Development event.",
        ],
        stack: ["Next.js", "TypeScript", "Maps"],
        cover: { kind: "image", src: "/work/navieats.jpg", alt: "NaviEats seasonal favorites page with three dish cards" },
    },
    {
        slug: "nexdrop",
        name: "NexDrop",
        line: "Satellite imagery to investment scores",
        badge: "MLH Award, HackSMU",
        points: [
            "Computer vision pipelines with OpenCV and TensorFlow extract building roof areas from raw satellite images.",
            "Automated CI/CD pipelines combine rainfall history with roof area to score ROI for water-harvesting firms.",
            "Built to streamline lead generation for those firms.",
        ],
        stack: ["OpenCV", "TensorFlow", "Scikit-learn", "CI/CD"],
        cover: { kind: "image", src: "/work/nexdrop.jpg", alt: "NexDrop dashboard with a satellite map, viability score, and rainfall and roof area panels" },
    },
    {
        slug: "truscope",
        name: "TruScope",
        line: "Bias and clickbait detector for news",
        badge: "5.0 on Chrome Web Store",
        points: [
            "Chrome extension and web app that flags bias and clickbait in online news.",
            "Fine-tuned RoBERTa model in PyTorch, containerized with Docker and deployed on Firebase.",
            "Co-built as an equal two-person team.",
        ],
        stack: ["PyTorch", "RoBERTa", "Docker", "Firebase"],
        cover: { kind: "image", src: "/work/truscope.jpg", alt: "TruScope on the Chrome Web Store with a 5.0 rating" },
    },
    {
        slug: "vfin",
        name: "vfin",
        line: "Mutual fund and SIP investing app",
        badge: "5.0 on Google Play",
        points: [
            "Internship project at VisorFin Tech Services, spanning backend and mobile work for a mutual fund and SIP investing app.",
            "REST APIs in Node.js and Python for tax and investment data, plus 6,000+ daily mutual fund updates automated with PostgreSQL.",
            "12 systematic calculators built into the Kotlin Android and Swift iOS apps.",
        ],
        stack: ["Node.js", "Python", "PostgreSQL", "Kotlin", "Swift"],
        cover: { kind: "image", src: "/work/vfin.jpg", alt: "The vfin app listing on Google Play with a 5.0 rating and app screenshots" },
    },
    {
        slug: "retrievec",
        name: "RetrieVec",
        line: "Self-correcting RAG assistant",
        points: [
            "Answers questions over thousands of research documents.",
            "Hybrid retrieval, cross-encoder reranking, and RAGAS evaluation keep answers accurate.",
            "Runs on local LLMs behind FastAPI, so it stays light and free to operate.",
        ],
        stack: ["FastAPI", "RAGAS", "Cross-encoder", "Local LLMs"],
        cover: { kind: "art", art: "rag", alt: "Illustration of a query retrieving the closest document chunks from a field of documents" },
    },
    {
        slug: "tugwar",
        name: "TugWar.io",
        line: "Real-time click-battle debates",
        points: [
            "Two sides click to pull a rope across the screen while a debate plays out live.",
            "Animated SVG rope physics, dynamic data loading, and virtualized lists.",
        ],
        stack: ["React", "WebSockets", "SVG"],
        cover: { kind: "art", art: "rope", alt: "Illustration of a rope pulled between two crowds with its marker off center" },
    },
    {
        slug: "humanizeai",
        name: "HumanizeAI",
        line: "Llama 3.2 1B fine-tuned on an Intel Arc GPU",
        points: [
            "LoRA fine-tuning on an Intel Arc XPU with ipex-llm.",
            "Resolved quantization and memory errors, and added tooling that audits truncated training samples.",
        ],
        stack: ["PyTorch", "LoRA", "ipex-llm"],
        cover: { kind: "art", art: "lora", alt: "Illustration of a large weight matrix plus two thin low-rank adapter matrices" },
    },
];
export const experience = [
    {
        org: "Comet Robotics, UT Dallas",
        role: "Programmer",
        when: "Aug 2025 to present",
        points: [
            "Programmed automated control systems and worked on particle filtering.",
            "Integrated the control system with sensors and a Jetson Nano to run complex algorithms quickly.",
            "Placed 26th at the International VEXU Robotics Competition.",
        ],
    },
    {
        org: "GDSC Sprints, UT Dallas",
        role: "Sprint Mentor",
        when: "Sep 2026 to present",
        points: [
            "Mentor five students on backend development and AI/ML integration for a full-stack project.",
            "Teach MVC architecture, REST API design, Docker, and cloud deployment, and lead architecture reviews.",
        ],
    },
    {
        org: "VisorFin Tech Services",
        role: "Junior Full Stack Developer Intern, Gurugram, India",
        when: "Jun 2025 to Feb 2026",
        points: [
            "Architected about 10 REST APIs in Node.js and Python for tax and investment data, supporting 500+ accounts and 9,000+ transactions.",
            "Automated 6,000+ daily mutual fund updates with Python and PostgreSQL, saving 20+ hours of manual entry each week.",
            "Built 12 systematic calculators into Kotlin Android and Swift iOS apps.",
        ],
    },
    {
        org: "Carrollton-Farmers Branch ISD",
        role: "Technology and Robotics Mentor",
        when: "Sep 2024 to May 2025",
        points: [
            "Ran robotics workshops for 90+ students across the district, teaching robotics, Python, and Arduino.",
            "Designed hands-on lessons on sensors, control logic, and iterative debugging.",
        ],
    },
    {
        org: "Navix Designs",
        role: "Founder, freelance web development",
        when: "Ongoing",
        points: ["Designs and builds websites for small clients."],
    },
];
export const skillGroups = [
    { name: "Languages", items: ["Python", "TypeScript", "C++", "Kotlin", "Swift", "SQL"], used: "APIs, mobile apps, and coursework in C++" },
    { name: "Web and APIs", items: ["React", "Next.js", "Node.js", "FastAPI", "Tailwind", "Docker", "Firebase"], used: "NaviEats, TruScope, VisorFin" },
    { name: "AI and data", items: ["PyTorch", "LoRA", "TensorFlow", "OpenCV", "Scikit-learn", "RAG", "RAGAS"], used: "NexDrop, RetrieVec, HumanizeAI" },
    { name: "Robotics and systems", items: ["Jetson Nano", "Particle filtering", "Control systems", "Arduino", "Sensors"], used: "Comet Robotics, CFBISD workshops" },
    { name: "Visualization and BI", items: ["Tableau", "Power BI", "Oracle", "PostgreSQL"], used: "Business and Information Systems minor" },
];
export const education = {
    school: "University of Texas at Dallas, Erik Jonsson School of Engineering and Computer Science",
    degree: "B.S. Computer Science, sophomore",
    minors: ["Marketing and Entrepreneurship", "Business and Information Systems"],
    coursework: ["C++ and object-oriented design", "Linear algebra", "Discrete mathematics"],
    certs: ["CS50x, Harvard University", "Python Certified, CodeHS"],
};
