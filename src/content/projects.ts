import nexdrop from "../../public/nexdrop.png";
import truscope from "../../public/truscope.png";
import navieats from "../../public/navieats.png";
import vfin from "../../public/vfin.png";

export const projects = [
  { name: "NexDrop", category: "Computer vision / MLH winner", image: nexdrop, alt: "NexDrop satellite imagery and rainwater harvesting analysis interface", description: "A computer-vision pipeline that extracts roof areas from satellite imagery and scores rainwater-harvesting ROI, with automated precipitation and surface-area analysis.", tags: ["OpenCV", "TensorFlow", "Scikit-learn", "CI/CD"], links: [["View source", "https://github.com/nshah2006/NexDrop/"], ["Live demo", "https://v0-nexdrop.vercel.app"]] },
  { name: "TruScope", category: "Language models / Browser extension", image: truscope, alt: "TruScope article analysis application", description: "A fine-tuned language model that helps readers identify bias and clickbait, available through a web app and Chrome extension.", tags: ["LLM", "Classification", "Chrome extension"], links: [["Website", "https://truscope.app/"], ["Chrome Store", "https://chromewebstore.google.com/detail/truscope/pncjbinbmlfgkgedabggpfgafomgjamn/"]] },
  { name: "NaviEats", category: "Full-stack / 1st place, national TSA", image: navieats, alt: "NaviEats food discovery website", description: "Navigation-first food discovery with a full-stack experience, ranked first nationally at TSA Web Development.", tags: ["Web development", "Backend", "UX"], links: [["Website", "https://navieats.netlify.app/"]] },
  { name: "VFIN", category: "Fintech / Production systems", image: vfin, alt: "VFIN financial application screens", description: "A Node.js and Python API layer serving 500+ accounts, syncing 6,000+ fund entries daily, and powering 12 investment calculators on iOS and Android.", tags: ["Node.js", "Python", "PostgreSQL"], links: [["Play Store", "https://play.google.com/store/search?q=vfin&c=apps"]] },
];
