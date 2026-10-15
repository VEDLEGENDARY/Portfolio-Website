import { jsx as _jsx } from "react/jsx-runtime";
export default function Marquee({ items }) {
    const row = [...items, ...items];
    return (_jsx("div", { className: "marquee", "aria-hidden": "true", children: _jsx("div", { className: "track", children: row.map((t, i) => _jsx("span", { children: t }, i)) }) }));
}
