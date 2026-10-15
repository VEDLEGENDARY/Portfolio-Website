import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const brands = {
    Python: "python", TypeScript: "typescript", "C++": "cplusplus",
    Kotlin: "kotlin", Swift: "swift", React: "react", "Next.js": "nextjs",
    "Node.js": "nodejs", FastAPI: "fastapi", Tailwind: "tailwindcss",
    Docker: "docker", Firebase: "firebase", PyTorch: "pytorch",
    TensorFlow: "tensorflow", OpenCV: "opencv", "Scikit-learn": "scikitlearn",
    Arduino: "arduino", Oracle: "oracle", PostgreSQL: "postgresql", "Jetson Nano": "nvidia",
};
export default function Marquee({ items }) {
    const row = [...items, ...items];
    return (_jsx("div", { className: "marquee", "aria-hidden": "true", children: _jsx("div", { className: "track", children: row.map((name, i) => _jsxs("span", { className: `skill-brand ${brands[name] ? "" : "skill-concept"}`, "data-brand": brands[name], children: [brands[name] && _jsx("img", { src: `/brands/${brands[name]}.svg`, alt: "", width: 52, height: 52, loading: "lazy", decoding: "async" }), _jsx("span", { children: name })] }, i)) }) }));
}
