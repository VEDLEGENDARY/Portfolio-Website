import nexdrop from "../../public/nexdrop.png";
import truscope from "../../public/truscope.png";
import navieats from "../../public/navieats.png";
import vfin from "../../public/vfin.png";

export const projects = [
  { name: "NexDrop", category: "Computer vision / GIS", image: nexdrop, alt: "NexDrop satellite imagery and rainwater harvesting analysis interface", description: "Computer vision pipelines using OpenCV and scikit-learn identify building data in satellite imagery, while FastAPI endpoints use Ollama and Qwen2.5 for ROI analysis and lead generation.", tags: ["OpenCV", "Scikit-learn", "FastAPI", "CI/CD"], links: [["View source", "https://github.com/nshah2006/NexDrop/"], ["Live demo", "https://v0-nexdrop.vercel.app"]] },
  { name: "TruScope", category: "NLP / Browser extension", image: truscope, alt: "TruScope article analysis application", description: "An NLP classification tool for identifying bias and clickbait in articles, delivered through a web app and Chrome extension.", tags: ["NLP", "Machine learning", "Chrome extension"], links: [["Website", "https://truscope.app/"], ["Chrome Store", "https://chromewebstore.google.com/detail/truscope/pncjbinbmlfgkgedabggpfgafomgjamn/"]] },
  { name: "NaviEats", category: "Full-stack / Web development", image: navieats, alt: "NaviEats food discovery website", description: "A full-stack web application for discovering food through a navigation-first experience, built around frontend and backend product flows.", tags: ["React", "Node.js", "UX"], links: [["Website", "https://navieats.netlify.app/"]] },
  { name: "VFIN", category: "REST APIs / Mobile architecture", image: vfin, alt: "VFIN financial application screens", description: "RESTful APIs built with JavaScript and PostgreSQL securely process user data and transactions, with Swift and Kotlin interfaces connecting core mobile app flows through MVC architecture.", tags: ["JavaScript", "PostgreSQL", "Swift", "Kotlin"], links: [["Play Store", "https://play.google.com/store/search?q=vfin&c=apps"]] },
];
