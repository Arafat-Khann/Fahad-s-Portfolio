// ============================================================
//  portfolioData.js  — Fahad Qaseem Khawar
//  Drop this file into your src/data/ folder and replace all
//  dummy-data imports/references with this file.
//  SAFE TO USE: only data changes — zero layout/style edits.
// ============================================================

// ── ABOUT ME ────────────────────────────────────────────────
// 2-line summary for the hero/about section
export const about = {
  name: "Fahad Qaseem Khawar",
  title: "AI and Software Engineering Intern",
  tagline: "Open to Work",
  email: "fahadq@wayne.edu",
  phone: "(313) 910-3524",
  location: "Detroit, MI, USA",
  linkedin: "https://www.linkedin.com/in/fahadqaseem/",
  github: "https://github.com/fahadqaseem",
  bio: "AI & Software Engineering graduate researcher at Wayne State University, specializing in deep learning, computer vision, and generative AI for medical imaging. Proven leader who has built and scaled teams across multiple industries — from AI data operations to logistics and creative agencies.",
};

// ── EXPERIENCE ──────────────────────────────────────────────
export const experience = [
  {
    id: 1,
    company: "Wayne State University",
    role: "Graduate Research Assistant",
    location: "Detroit, MI, USA",
    period: "August 2025 – Present",
    current: true,
    bullets: [
      "Conduct research in the Machine Vision and Pattern Recognition Lab (MVPRL) under Prof. Ming Dong, developing diffusion-based generative models in PyTorch for temporal super-resolution in breast DCE-MRI.",
      "Designed a Regularized Brownian Bridge (reg-BBrg) framework integrating deep learning and reinforcement learning to reconstruct intermediate MRI frames and enable quantitative imaging biomarker extraction.",
      "Evaluated the method on a 58-patient breast cancer MRI dataset, achieving PSNR 35.49, SSIM 0.94, LPIPS 0.038.",
      "Research published on arXiv: Deterministic Medical Image Translation via High-fidelity Brownian Bridges.",
    ],
    link: "https://arxiv.org/abs/2503.22531",
  },
  {
    id: 2,
    company: "Wayne State University",
    role: "Research Intern (Deep Learning)",
    location: "Detroit, MI, USA",
    period: "May 2025 – July 2025",
    current: false,
    bullets: [
      "Collaborated with Dr. Masoud Nazari on weather-informed power outage risk prediction in Michigan.",
      "Transitioned the model architecture from LSTM to Spatio-Temporal Graph Neural Networks (ST-GNNs), leading to significant performance improvements.",
      "Conducted extensive data preprocessing, feature engineering, and spatial mapping across Michigan counties.",
      "Developed a Scikit-based analytics dashboard to visualize model predictions and outage risk metrics.",
    ],
    link: "https://www.notion.so/fahadqaseem/Weather-Informed-Spatio-Temporal-Graph-Neural-Networks-for-Power-Outage-Risk-Prediction-in-Michigan-216f490045f680ffa362c591a8363083",
  },
  {
    id: 3,
    company: "Image2work",
    role: "AI/ML Training Operations Lead (CEO – Pakistan)",
    location: "Pakistan (HQ: Copenhagen, Denmark)",
    period: "June 2023 – November 2024",
    current: false,
    bullets: [
      "Appointed CEO (Pakistan) at a Denmark-headquartered AI technology company supported by the Pakistan-Danish Business Trade Council.",
      "Scaled the Pakistan division from 1 to 20 team members, establishing operational and managerial frameworks.",
      "Managed large-scale computer vision training datasets, image annotation pipelines, and QA for deep learning segmentation models.",
      "Built and maintained secure SFTP data transfer pipelines ensuring 1-hour and 12-hour SLA delivery commitments.",
      "Sister company Speckral was later acquired by Apple for $30M, leveraging Image2work's deep learning datasets.",
    ],
  },
  {
    id: 4,
    company: "Noble AgroFood",
    role: "Overseas Logistics Lead",
    location: "Toronto, ON, Canada",
    period: "November 2022 – November 2024",
    current: false,
    bullets: [
      "Managed end-to-end import operations ensuring compliance with Canadian customs regulations through the Port of Montreal.",
      "Coordinated with customs brokers, suppliers, and warehouses for seamless logistics of premium European food products.",
      "Oversaw refrigerated shipments for temperature-sensitive goods, optimizing supply chain efficiency.",
      "Prepared and circulated Notices of Arrival (NOA) and Bills of Lading (BOL) to synchronize warehouse and logistics operations.",
    ],
  },
  {
    id: 5,
    company: "Eminent Ecom",
    role: "Graphic Designer",
    location: "United States",
    period: "September 2021 – December 2022",
    current: false,
    bullets: [
      "Designed 100+ brand logos and product visuals for a global e-commerce branding company.",
      "Gained hands-on experience in 3D modeling, typography, color theory, and brand aesthetics.",
      "Contributed to company expansion from 14 to 54 team members; sole regional designer representing Pakistan.",
    ],
  },
  {
    id: 6,
    company: "Truck It In",
    role: "HubSpot / CRM Systems Engineer",
    location: "Islamabad, Pakistan",
    period: "October 2021 – January 2022",
    current: false,
    bullets: [
      "Led evaluation, selection, and implementation of HubSpot CRM during a high-growth phase (88 → 200+ employees).",
      "Developed data dashboards and sales performance reports to track KPIs and identify upselling opportunities.",
      "Trained 20+ team members and created SOPs for consistent CRM adoption across departments.",
      "Contributed during funding growth from $3M seed to $14M total funding.",
    ],
  },
];

// ── PROJECTS ─────────────────────────────────────────────────
export const projects = [
  {
    id: 1,
    title: "Deterministic Medical Image Translation via Brownian Bridges",
    description:
      "Developed a Generative AI–based diffusion model (Regularized Brownian Bridge) for temporal super-resolution of clinical breast DCE-MRI, enabling better pharmacokinetic analysis and precision oncology.",
    tech: ["Python", "PyTorch", "Diffusion Models", "Reinforcement Learning", "Computer Vision"],
    highlights: [
      "PSNR: 35.49 | SSIM: 0.94 | LPIPS: 0.038 — state-of-the-art reconstruction results",
      "Processed 58-patient breast cancer MRI dataset to derive quantitative imaging biomarkers",
      "Published on arXiv",
    ],
    liveUrl: "https://arxiv.org/abs/2503.22531",
    githubUrl: "",
    type: "Research",
  },
  {
    id: 2,
    title: "Weather-Informed Power Outage Risk Prediction in Michigan",
    description:
      "Re-architected a deep learning pipeline from LSTM to Spatio-Temporal Graph Neural Networks (ST-GNNs) to predict power outage risk across Michigan counties using meteorological and infrastructure data.",
    tech: ["Python", "ST-GNNs", "Scikit-learn", "NOAA Weather API", "Git", "Data Visualization"],
    highlights: [
      "Integrated meteorological, geographical, and socioeconomic datasets across Michigan counties",
      "Significant performance improvement over LSTM baseline after ST-GNN transition",
      "Built Scikit-based analytics dashboard for visualizing outage risk metrics",
    ],
    liveUrl:
      "https://www.notion.so/fahadqaseem/Weather-Informed-Spatio-Temporal-Graph-Neural-Networks-for-Power-Outage-Risk-Prediction-in-Michigan-216f490045f680ffa362c591a8363083",
    githubUrl: "",
    type: "Research / Engineering",
  },
  {
    id: 3,
    title: "ML-Driven EMG-Based 3D Prosthetic Arm (5 DOF)",
    description:
      "Co-authored IEEE-published research on a flexible, low-cost, non-invasive prosthetic arm with 5 degrees of freedom using EMG signals and machine learning classifiers.",
    tech: ["Python", "SVM", "ANN", "Decision Trees", "EMG Signal Processing", "Vibrotactile Feedback"],
    highlights: [
      "Achieved up to 92.35% accuracy in real-time gesture recognition",
      "Validated with vibrotactile feedback (p = 0.04, r = 0.9985)",
      "Published at IEEE eIT 2025 Conference",
    ],
    liveUrl: "https://ieeexplore.ieee.org/abstract/document/11103684",
    githubUrl: "",
    type: "Research / Publication",
  },
];

// ── SKILLS ───────────────────────────────────────────────────
export const skills = {
  "AI & Deep Learning": [
    "Deep Learning",
    "Diffusion Models",
    "ST-GNNs",
    "Reinforcement Learning",
    "LLMs",
    "AI Agents",
    "Computer Vision",
    "Medical Imaging",
  ],
  "Languages": [
    "Python",
    "C++",
    "Java",
    "TypeScript",
  ],
  "Libraries & Frameworks": [
    "PyTorch",
    "OpenCV",
    "Pandas",
    "Scikit-learn",
    "Flask",
    "Node.js",
    "Next.js",
  ],
  "Tools & Platforms": [
    "Linux",
    "Git",
    "Docker",
    "AWS",
    "Jupyter Notebooks",
    "Claude Code",
  ],
  "Other": [
    "Feature Engineering",
    "Data Visualization",
  ],
};

// ── LEADERSHIP ACTIVITIES ────────────────────────────────────
export const leadership = [
  {
    id: 1,
    title: "Creative Project Manager & Co-Founder",
    organization: "Ecombranding.co",
    location: "Islamabad, Pakistan",
    period: "February 2021 – November 2024",
    image: "",
    caption: "Creative Agency Co-Founder",
    bullets: [
      "Co-founded a creative agency specializing in product imagery, branding, and PPC video content for e-commerce.",
      "Scaled the agency to 200+ clients and generated $200,000+ in revenue over four years.",
      "Led UI/UX, 3D CGI product visualization, photography, videography, and post-production strategy.",
      "Designed and developed landing pages and websites using Shopify, Webflow, and Next.js.",
    ],
  },
  {
    id: 2,
    title: "Vice President of Merchandising & Marketing",
    organization: "GIKI Alumni Association",
    location: "Islamabad, Pakistan",
    period: "November 2022 – May 2023",
    image: "",
    caption: "GIKI Alumni VP",
    bullets: [
      "Launched the university's first-ever official merchandise initiative.",
      "Developed marketing and branding strategy for the university's souvenir and apparel line.",
      "Collaborated with the President and Board to create a sustainable e-commerce model for student scholarships.",
    ],
  },
  {
    id: 3,
    title: "President / Volunteer Engineer",
    organization: "Team Hammerhead ARC – Shell Eco-Marathon",
    location: "GIK Institute, Pakistan",
    period: "January 2018 – December 2020",
    image: "",
    caption: "Shell Eco-Marathon – 6th Place Globally",
    bullets: [
      "Led a multidisciplinary team designing an energy-efficient electric vehicle for Shell Eco-Marathon Asia (Singapore).",
      "Applied data analysis, embedded systems, and performance optimization to vehicle development.",
      "Achieved 6th place globally, representing Pakistan on an international engineering stage.",
    ],
  },
  {
    id: 4,
    title: "Film Production – Certificate Program",
    organization: "Pakistan National Council of the Arts (PNCA)",
    location: "Islamabad, Pakistan",
    period: "2021",
    image: "",
    caption: "PNCA Film Production",
    bullets: [
      "Majored in direction; studied production design, post-production, scriptwriting, and sound design.",
      "Short film 'Carmaa' won the Special Jury Award with 700K+ views on YouTube.",
      "Won #equallyloud 100K PKR grant from ZeroMM Film Festival to produce 'Doorbell', a film on domestic violence — 800K+ views on YouTube.",
    ],
  },
  {
    id: 5,
    title: "DICE Fellow",
    organization: "British Council",
    location: "Islamabad, Pakistan",
    period: "August 2019",
    image: "",
    caption: "British Council DICE Fellow",
    bullets: [
      "Selected for the Developing Inclusive and Creative Economies (DICE) pilot program by the British Council.",
      "Program addresses entrenched issues of economic and social exclusion through creative economies.",
    ],
  },
];

// ── TESTIMONIALS ─────────────────────────────────────────────
export const testimonials = [
  {
    id: 1,
    quote:
      "[ Testimonial not provided — please add a real quote here ]",
    name: "— Name",
    title: "Title / Relationship to Fahad",
    avatar: "",
  },
  {
    id: 2,
    quote:
      "[ Testimonial not provided — please add a real quote here ]",
    name: "— Name",
    title: "Title / Relationship to Fahad",
    avatar: "",
  },
  {
    id: 3,
    quote:
      "[ Testimonial not provided — please add a real quote here ]",
    name: "— Name",
    title: "Title / Relationship to Fahad",
    avatar: "",
  },
];

// ── PUBLICATIONS ─────────────────────────────────────────────
export const publications = [
  {
    id: 1,
    title:
      "Deterministic Medical Image Translation via High-fidelity Brownian Bridges",
    venue: "arXiv, 2025",
    link: "https://arxiv.org/abs/2503.22531",
  },
  {
    id: 2,
    title:
      "Machine Learning-Driven EMG-Based 3D Prosthetic Arm with 5 Degrees of Freedom",
    venue:
      "2025 IEEE International Conference on Electro Information Technology (eIT), Valparaiso, IN, USA, pp. 330–337",
    doi: "10.1109/eIT64391.2025.11103684",
    link: "https://ieeexplore.ieee.org/abstract/document/11103684",
  },
];
