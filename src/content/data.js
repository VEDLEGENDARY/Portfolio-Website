export const profile = {
    name: "Ved Patel",
    line: "Computer science student at UT Dallas. I build retrieval systems, AI applications, and robot software.",
    lead: "Computer science student at UT Dallas.",
    main: "I build retrieval systems, AI applications, and robot software.",
    github: "https://github.com/VEDLEGENDARY",
    linkedin: "https://www.linkedin.com/in/vedspatel/",
    resume: "/Resume_VedPatel.pdf",
    email: "ved.sp@outlook.com",
    timezone: "America/Chicago",
};

export const statement = "I study computer science at UT Dallas and build software around real problems. My work spans research tools that connect answers to source evidence, APIs and mobile interfaces for financial services, and localization systems for competition robots.";

export const stats = [
    { value: 10, suffix: "+", label: "REST APIs developed", detail: "JavaScript and PostgreSQL at VisorFin" },
    { value: 20, label: "Hours saved each week", detail: "Pipeline automation at VisorFin" },
    { value: 5, label: "Students mentored", detail: "Google Developer Group at UT Dallas" },
    { value: 26, suffix: "th", label: "International VEXU placement", detail: "With Comet Robotics" },
];

export const projects = [
    {
        slug: "retrievec",
        name: "RetrieVec",
        line: "A research workspace built around source evidence",
        href: "https://github.com/VEDLEGENDARY/RetrieVec",
        points: [
            "Upload papers and notes, find relevant passages, and save or export cited answers alongside their sources.",
            "Combines lexical and dense retrieval with optional reranking. Immutable snapshots keep the question, model, and source evidence together.",
            "A Go retrieval engine, Python ingestion and FastAPI services, and a React interface, backed by PostgreSQL and Docker.",
        ],
        stack: ["Go", "Python", "FastAPI", "React", "TypeScript", "Tailwind", "PostgreSQL", "Docker", "BM25", "Dense retrieval", "Cross-encoder", "gRPC"],
        cover: { kind: "image", src: "/work/retrievec.png", alt: "RetrieVec research workspace showing a paper collection, source search, and evidence workbench" },
    },
    {
        slug: "nexdrop",
        name: "NexDrop",
        line: "Satellite imagery to water-harvesting opportunities",
        href: "https://github.com/nshah2006/NexDrop",
        points: [
            "Uses OpenCV and scikit-learn to extract building data from satellite imagery, then combines roof area and rainfall data to assess water-harvesting potential.",
            "FastAPI and local Qwen 2.5 analysis through Ollama support ROI estimates and lead generation.",
            "A React and TypeScript dashboard brings the results onto a Mapbox map, with PostgreSQL storage and CI/CD automation.",
        ],
        stack: ["Python", "OpenCV", "Scikit-learn", "FastAPI", "Ollama", "React", "TypeScript", "Tailwind", "PostgreSQL", "Mapbox", "CI/CD"],
        cover: { kind: "image", src: "/work/nexdrop.jpg", alt: "NexDrop dashboard with a satellite map, viability score, and rainfall and roof area panels" },
    },
    {
        slug: "askutd",
        name: "GDG AskUTD",
        line: "A campus assistant grounded in university sources",
        badge: "In development",
        href: "https://github.com/VEDLEGENDARY/GDG-AskUTD",
        points: [
            "Building a self-correcting RAG assistant for UT Dallas information, starting with a collected corpus of university PDFs and web pages.",
            "Developing hybrid BM25 and dense retrieval, query decomposition, conversational memory, and local cross-encoder reranking.",
            "Preparing a FastAPI service with local models through Ollama and RAGAS evaluation to measure retrieval and answer quality.",
        ],
        stack: ["Python", "FastAPI", "PyTorch", "ChromaDB", "BM25", "Dense retrieval", "Cross-encoder", "Ollama", "RAGAS"],
        cover: { kind: "art", art: "rag", alt: "Diagram of a query retrieving document passages and selecting evidence for an answer" },
    },
    {
        slug: "genetris",
        name: "GeneTris",
        line: "Teaching an agent to play Tetris",
        href: "https://github.com/VEDLEGENDARY/GeneTris",
        points: [
            "A Deep Q-Network learns from cleared lines, holes, bumpiness, and board height using experience replay and epsilon-greedy exploration.",
            "TensorFlow and Keras handle training with saved checkpoints, so runs can resume without starting over.",
            "A CustomTkinter desktop interface keeps training and visualization on separate threads, with Matplotlib charts for progress.",
        ],
        stack: ["Python", "TensorFlow", "Keras", "NumPy", "Reinforcement learning", "CustomTkinter", "Matplotlib"],
        cover: { kind: "art", art: "tetris", alt: "Illustration of a Tetris board and the possible placements evaluated by a learning agent" },
    },
    {
        slug: "cometnow",
        name: "CometNow",
        line: "Campus events, mapped and personalized",
        badge: "HackUTD",
        href: "https://github.com/Pranav593/hackutd-cometnow",
        points: [
            "A Next.js progressive web app for discovering UT Dallas events through an interactive campus map, filters, and personalized recommendations.",
            "Firebase Authentication and Firestore support profiles, onboarding, events, and rewards. Leaflet places events on the campus map.",
            "Gemini powers event recommendations and an advisor chat that helps students explore campus activities.",
        ],
        stack: ["Next.js", "React", "TypeScript", "Tailwind", "Firebase", "Firestore", "Leaflet", "Gemini", "PWA"],
        cover: { kind: "art", art: "campus", alt: "Illustration of campus buildings, paths, and event locations on a map" },
    },
];

export const experience = [
    {
        org: "Google Developer Group, UT Dallas",
        graphName: "GDG mentoring",
        role: "Sprint Mentor",
        when: "Aug 2026 to present",
        points: [
            "Mentor five students on backend development and AI/ML integration for a full-stack project.",
            "Guide REST API design, software architecture, Docker, and cloud deployment through code reviews and hands-on debugging.",
        ],
        stack: ["REST APIs", "Docker"],
    },
    {
        org: "Comet Robotics, UT Dallas",
        graphName: "Comet Robotics",
        role: "Programmer",
        when: "Aug 2025 to present",
        points: [
            "Work in a four-person autonomous control systems team, using particle filtering for real-time robot localization.",
            "Integrate sensors and an NVIDIA Jetson Nano to run localization and control algorithms on the robot.",
            "Placed 26th at the International VEXU Robotics Competition with Comet Robotics.",
        ],
        stack: ["Jetson Nano", "Particle filtering", "Sensors", "Control systems"],
    },
    {
        org: "VisorFin Tech Services",
        graphName: "VisorFin",
        role: "Software Engineering Intern, Dallas, TX",
        when: "Jun 2025 to Feb 2026",
        points: [
            "Developed 10+ REST APIs in JavaScript with PostgreSQL and pgAdmin 4 for secure user data and financial transactions.",
            "Automated architecture and data pipelines with Google Cloud, saving 20 hours of manual work each week.",
            "Built mobile interfaces in Swift and Kotlin using MVC, collaborating with senior engineers and executives on architecture and prototypes.",
        ],
        stack: ["JavaScript", "SQL", "PostgreSQL", "Google Cloud", "Swift", "Kotlin", "REST APIs", "MVC"],
    },
];

export const skillGroups = [
    { name: "Languages", items: ["Python", "Go", "JavaScript", "TypeScript", "SQL", "C++", "Swift", "Kotlin"], used: "RetrieVec, NexDrop, CometNow, VisorFin, and computer science coursework" },
    { name: "Web and APIs", items: ["React", "Next.js", "FastAPI", "Tailwind", "gRPC", "REST APIs", "MVC"], used: "RetrieVec, NexDrop, CometNow, AskUTD, VisorFin, and GDG mentoring" },
    { name: "AI and retrieval", items: ["BM25", "Dense retrieval", "Cross-encoder", "PyTorch", "TensorFlow", "Keras", "NumPy", "OpenCV", "Scikit-learn", "Ollama", "ChromaDB", "RAGAS", "Reinforcement learning", "Gemini"], used: "RetrieVec, NexDrop, AskUTD, GeneTris, and CometNow" },
    { name: "Data and cloud", items: ["PostgreSQL", "Docker", "Google Cloud", "Firebase", "Firestore", "CI/CD"], used: "RetrieVec, NexDrop, CometNow, VisorFin, and GDG mentoring" },
    { name: "Systems and maps", items: ["Mapbox", "Leaflet", "PWA", "CustomTkinter", "Matplotlib", "Jetson Nano", "Particle filtering", "Sensors", "Control systems"], used: "NexDrop, CometNow, GeneTris, and Comet Robotics" },
];

export const education = {
    school: "The University of Texas at Dallas",
    degree: "B.S. Computer Science · Expected May 2028",
    minor: "Innovation & Entrepreneurship",
    coursework: ["Computer Science II", "Computer Architecture", "Professional and Technical Communication", "Probability and Statistics in Computer Science and Software Engineering"],
};
