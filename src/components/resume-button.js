import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function ResumeButton({ href }) {
    return (_jsxs("span", { className: "split", children: [_jsx("a", { className: "btn", href: href, target: "_blank", rel: "noopener noreferrer", children: "View resume" }), _jsx("a", { className: "btn icon", href: href, download: true, "aria-label": "Download resume as PDF", title: "Download PDF", children: _jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: _jsx("path", { d: "M12 3v12m0 0l-5-5m5 5l5-5M4 21h16" }) }) })] }));
}
