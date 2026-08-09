import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const email = process.env.ADMIN_EMAIL || "axinbodyindia@gmail.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const hash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    update: { password: hash },
    create: { email, password: hash, role: "admin" },
  });

  // Theme
  await prisma.themeSettings.deleteMany();
  await prisma.themeSettings.create({
    data: {
      colors: JSON.stringify({
        bg: "#07080a",
        bg2: "#0e1013",
        bg3: "#17191d",
        accent: "#D6FF3F",
        accent2: "#8C5CFF",
        white: "#F5F5F0",
        grey: "#9A9A9A",
        grey2: "#5C5C5C",
        border: "rgba(255,255,255,0.07)",
      }),
      fonts: JSON.stringify({
        head: "'Bricolage Grotesque', sans-serif",
        body: "'Inter', sans-serif",
        sub: "'Space Grotesk', sans-serif",
      }),
      spacing: JSON.stringify({
        sectionPadding: "100px 5%",
        radius: "12px",
      }),
    },
  });

  // Sections (wipe + reseed)
  await prisma.contentBlock.deleteMany();
  await prisma.section.deleteMany();

  const sections: Array<{
    type: string;
    order: number;
    blocks: Record<string, unknown>;
  }> = [
    {
      type: "nav",
      order: 0,
      blocks: {
        logo: "AMIN",
        logoAccent: ".",
        links: [
          { label: "About", href: "#about" },
          { label: "Services", href: "#services" },
          { label: "Work", href: "#projects" },
          { label: "Gallery", href: "/gallery" },
          { label: "Process", href: "#process" },
          { label: "Reviews", href: "#testimonials" },
        ],
        ctaLabel: "Let's Talk",
        ctaHref: "#contact",
      },
    },
    {
      type: "hero",
      order: 1,
      blocks: {
        eyebrow: "Available for Projects — 2026",
        headline: [
          { text: "I don't just", style: "plain" },
          { text: "design visuals —", style: "outline" },
          { text: "I build", style: "gradient" },
          { text: "brands.", style: "plain" },
        ],
        sub: "Graphic Designer · Motion Designer · Video Editor · Creative Director.\nHelping brands grow through bold design, strategic video, and visual storytelling.",
        primaryCta: { label: "View My Work", href: "#projects" },
        secondaryCta: { label: "Let's Work Together", href: "#contact" },
        fanTiles: [
          { icon: "🎨", label: "Design" },
          { icon: "✨", label: "Motion" },
          { icon: "🎥", label: "Video" },
          { icon: "🧠", label: "Strategy" },
          { icon: "📈", label: "Growth" },
        ],
      },
    },
    {
      type: "stats",
      order: 2,
      blocks: {
        items: [
          { count: 50, label: "Projects Delivered" },
          { count: 30, label: "Happy Clients" },
          { count: 5, label: "Years Experience" },
          { count: 10, label: "Brands Elevated" },
        ],
      },
    },
    {
      type: "marquee",
      order: 3,
      blocks: {
        items: [
          "Graphic Design",
          "Brand Identity",
          "Motion Graphics",
          "Visual Direction",
          "Video Editing",
          "Social Media Strategy",
          "B2C Marketing",
          "Creative Leadership",
        ],
      },
    },
    {
      type: "problem",
      order: 4,
      blocks: {
        label: "The Problem",
        title: "Great Footage,\nBut No Real Story?",
        titleAccentLine: 2,
        sub: "You're capturing great moments, but raw footage sitting on a drive doesn't grow a brand. The gap usually isn't the content — it's what happens to it after the camera stops rolling.",
        cards: [
          {
            mockup: "chart",
            title: "Views That Don't Convert",
            desc: "High view counts look good on paper, but without a hook and a real story arc, that attention rarely turns into results.",
          },
          {
            mockup: "ring",
            title: "Edits That Take Too Long",
            desc: "Every week a video sits unedited is momentum lost — slow turnaround quietly kills the consistency platforms reward.",
          },
          {
            mockup: "grid",
            title: "No System, No Consistency",
            desc: "Posting whenever inspiration strikes instead of on a plan leads to inconsistent growth and an audience that never quite builds.",
          },
        ],
      },
    },
    {
      type: "showreel",
      order: 5,
      blocks: {
        label: "Showreel",
        title: "Watch the\nMagic Happen",
        titleAccentLine: 2,
        body: "A curated selection of my best edits — brand films, reels, motion graphics, and storytelling that drives results.",
        playLabel: "Play Showreel — 2026",
        duration: "00:30",
        tag: "Best of 2024–2026",
        videoUrl: "",
        thumbUrl: "",
      },
    },
    {
      type: "about",
      order: 6,
      blocks: {
        label: "About Me",
        title: "The Mind\nBehind the\nFrame",
        titleAccentLine: 3,
        photoUrl: "",
        initials: "AS",
        badgeBig: "5+",
        badgeText: "Years of\nCraft",
        paragraphs: [
          "I'm a graphic designer at heart — and a complete creative partner in practice. My journey started with a passion for visual storytelling, and over the past 5+ years I've evolved into a multi-disciplined creative professional who bridges design, motion, video, and marketing strategy.",
          "I've helped brands, businesses, and individuals cut through the noise with visuals that don't just look good — they convert. From brand identities and campaign design to motion graphics and cinematic edits, I bring both the technical skill and the strategic thinking every project needs.",
          "My approach? **Obsess over the craft. Lead with purpose. Deliver results.**",
        ],
        skills: [
          "Photoshop",
          "Illustrator",
          "Figma",
          "After Effects",
          "Premiere Pro",
          "DaVinci Resolve",
          "Cinema 4D",
          "Brand Identity",
          "Color Grading",
          "Team Leadership",
        ],
      },
    },
    {
      type: "services",
      order: 7,
      blocks: {
        label: "How I Fix It",
        title: "One Partner,\nEvery Deliverable",
        titleAccentLine: 2,
        body: "End-to-end creative solutions — from raw footage to a finished campaign that performs.",
        cards: [
          {
            icon: "🎨",
            category: "Design & Motion",
            name: "Graphic &\nMotion",
            desc: "Eye-catching visuals and fluid animations that elevate your brand identity.",
            list: [
              "Graphic Design",
              "Branding & Visual Identity",
              "Motion Graphics & Animation",
              "Thumbnail & Cover Design",
              "Ad Creatives",
            ],
          },
          {
            icon: "🎥",
            category: "Production",
            name: "Video &\nEditing",
            desc: "Cinematic cuts that tell your story and keep audiences watching till the end.",
            list: [
              "Professional Video Editing",
              "Videography & Shooting",
              "YouTube Channel Edits",
              "Reels & Short-Form Content",
              "Color Grading & LUTs",
            ],
          },
          {
            icon: "📈",
            category: "Strategy & Growth",
            name: "Social &\nMarketing",
            desc: "Data-informed strategies that translate creative output into real business growth.",
            list: [
              "Social Media Management",
              "Content Strategy",
              "B2C Marketing Execution",
              "Campaign Planning",
              "Performance Analytics",
            ],
          },
          {
            icon: "🧠",
            category: "Leadership",
            name: "Creative\nDirection",
            desc: "Visionary leadership that aligns creative teams around one powerful brand story.",
            list: [
              "Creative Direction",
              "Visual Direction",
              "Team Handling & Management",
              "Project Execution",
              "Brand Consultation",
            ],
          },
        ],
      },
    },
    {
      type: "platforms",
      order: 8,
      blocks: {
        label: "Platforms",
        title: "Fluent in Every\nMajor Editing Tool",
        titleAccentLine: 2,
        sub: "Whatever software your footage lives in, I already know it — no ramp-up time, no delays, just great edits.",
        tiles: [
          { icon: "davinciresolve", name: "DaVinci Resolve", color: "#233A51" },
          { icon: "photoshop", name: "Photoshop", color: "#31A8FF" },
          { icon: "illustrator", name: "Illustrator", color: "#FF9A00" },
          { icon: "openai", name: "AI (ChatGPT)", color: "#412991" },
          { icon: "blender", name: "Blender", color: "#E87D0D" },
        ],
      },
    },
    {
      type: "projects",
      order: 9,
      blocks: {
        label: "Case Studies",
        title: "Selected\nWork",
        titleAccentLine: 2,
        body: "Real projects. Real results. Real impact.",
        cards: [
          {
            bgGradient: "linear-gradient(135deg, #1a0a00, #2d1500)",
            bgLabel: "BRAND",
            category: "Brand Film",
            year: "2025",
            title: "Luxury Product Launch Film",
            desc: "Directed and edited a cinematic brand film for a premium product launch — combining slow-motion footage, motion graphics, and a carefully crafted narrative to position the brand as aspirational and high-end.",
            results: ["2.4M Views", "+340% Engagement", "12K Shares"],
          },
          {
            bgGradient: "linear-gradient(135deg, #000d1a, #001a35)",
            bgLabel: "REELS",
            category: "Social Reels",
            year: "2025",
            title: "60-Day Instagram Growth Campaign",
            desc: "Created and managed a complete social media content strategy — 30 high-energy reels, graphic posts, and stories — resulting in explosive follower growth and significantly higher reach for a fitness brand.",
            results: ["+180K Followers", "Avg 500K Reach", "3× Sales"],
          },
          {
            bgGradient: "linear-gradient(135deg, #0a000d, #1a0020)",
            bgLabel: "MOTION",
            category: "Motion Graphics",
            year: "2024",
            title: "Product Ad — B2C Campaign",
            desc: "Conceptualized and produced a full-motion ad campaign for a D2C brand — from scripting and storyboarding to editing and delivery. Designed to convert cold audiences into buyers within the first 5 seconds.",
            results: ["4.2% CTR", "ROAS 6.8×", "₹12L Revenue"],
          },
        ],
      },
    },
    {
      type: "process",
      order: 10,
      blocks: {
        label: "My Approach",
        title: "The Creative\nProcess",
        titleAccentLine: 2,
        body: "Every project I take on follows a proven framework — from discovery to delivery, nothing is left to chance.",
        steps: [
          {
            n: "01",
            title: "Discover",
            desc: "Deep dive into your brand, goals, and target audience to understand the real challenge.",
          },
          {
            n: "02",
            title: "Strategy",
            desc: "Build a content and creative strategy that aligns with business outcomes — not just aesthetics.",
          },
          {
            n: "03",
            title: "Concept",
            desc: "Develop visual concepts, moodboards, and storyboards before a single frame is cut.",
          },
          {
            n: "04",
            title: "Execute",
            desc: "Craft the actual content — editing, animation, design — with obsessive attention to detail.",
          },
          {
            n: "05",
            title: "Refine",
            desc: "Review, gather feedback, and iterate until the result is exactly right — or better.",
          },
          {
            n: "06",
            title: "Deliver",
            desc: "Final delivery in every required format, optimized for maximum performance.",
          },
        ],
      },
    },
    {
      type: "testimonials",
      order: 11,
      blocks: {
        label: "Testimonials",
        title: "What Clients\nSay",
        titleAccentLine: 2,
        cards: [
          {
            stars: 5,
            quote:
              "Working with Amin was a game-changer. He didn't just edit our video — he completely transformed our brand story. The results spoke for themselves: our best-performing content ever.",
            avatar: "R",
            name: "Rahul Sharma",
            role: "Founder, HealthPlus India",
          },
          {
            stars: 5,
            quote:
              "The motion graphics work was absolutely stunning. He understood our brand in a way that surprised us — and delivered well before deadline. Highly recommended for any brand that wants to stand out.",
            avatar: "P",
            name: "Priya Mehta",
            role: "Marketing Head, D2C Brand",
          },
          {
            stars: 5,
            quote:
              "Not only a brilliant editor but a true creative director. He led our entire content team for 3 months and the output quality went from average to exceptional. A rare find.",
            avatar: "S",
            name: "Sameer Khan",
            role: "CEO, Agency X",
          },
        ],
      },
    },
    {
      type: "pricing",
      order: 12,
      blocks: {
        label: "Pricing",
        title: "Simple Plans Built\nAround Your Content",
        titleAccentLine: 2,
        sub: "Every project is different, so pricing is scoped to your goals and volume — here's the general shape of how we can work together.",
        plans: [
          {
            name: "Starter",
            desc: "Perfect for a single campaign or one-off project.",
            price: "Custom Quote",
            unit: "",
            featured: false,
            features: [
              "1–2 short-form or long-form edits",
              "Color grading & sound design",
              "Platform-ready export formats",
              "Standard turnaround",
            ],
            ctaLabel: "Get a Quote",
            ctaHref: "#contact",
          },
          {
            name: "Ongoing Partner",
            desc: "For creators and brands publishing consistently.",
            price: "Custom Quote",
            unit: "",
            featured: true,
            features: [
              "Monthly content retainer",
              "Priority turnaround",
              "Motion graphics & thumbnails included",
              "Regular strategy check-ins",
            ],
            ctaLabel: "Let's Talk",
            ctaHref: "#contact",
          },
          {
            name: "Full-Service",
            desc: "End-to-end creative direction for a brand or team.",
            price: "Custom Quote",
            unit: "",
            featured: false,
            features: [
              "Creative direction & strategy",
              "Team leadership & pipeline setup",
              "Full production + post",
              "Dedicated point of contact",
            ],
            ctaLabel: "Get a Quote",
            ctaHref: "#contact",
          },
        ],
      },
    },
    {
      type: "galleryTeaser",
      order: 13,
      blocks: {
        label: "Full Portfolio",
        title: "Explore the\nComplete Gallery",
        titleAccentLine: 2,
        body: "Browse every project, sorted by skill — Video Editing, Motion Graphics, Graphic Design, Social Media, Visual Direction, B2C Marketing, and more. Unlimited works per category.",
        chips: [
          "🎨 Graphic Design",
          "✨ Motion Graphics",
          "🎥 Video Editing",
          "📱 Social Media",
          "📈 Marketing",
          "+ More",
        ],
        ctaLabel: "View Full Gallery →",
        ctaHref: "/gallery",
      },
    },
    {
      type: "faq",
      order: 14,
      blocks: {
        label: "FAQ",
        title: "Everything You\nNeed to Know",
        titleAccentLine: 2,
        sub: "Still deciding if we're a fit? Here are the questions I get asked most.",
        items: [
          {
            q: "What kind of projects do you take on?",
            a: "Everything from brand films and social reels to full campaign motion graphics and long-form YouTube edits — if it involves video, design, or a story that needs telling, it's likely in scope.",
          },
          {
            q: "Do you only edit, or help with strategy too?",
            a: "Both. Every project starts with understanding the goal, not just the footage, so the final edit is built to perform, not just look good.",
          },
          {
            q: "Can I request revisions?",
            a: "Yes — every project includes a review round so we can refine the edit together until it's right.",
          },
          {
            q: "What tools do you work in?",
            a: "Premiere Pro, After Effects, DaVinci Resolve, Photoshop, Illustrator, and Cinema 4D, among others — whatever the project calls for.",
          },
          {
            q: "How do we get started?",
            a: "Reach out through the contact section with a bit about your project, and we'll figure out the right scope and plan together.",
          },
        ],
      },
    },
    {
      type: "contact",
      order: 15,
      blocks: {
        label: "Let's Collaborate",
        title: "Let's Create\nSomething\nRemarkable.",
        titleAccentLine: 2,
        body: "Whether you have a project in mind or just want to explore possibilities — my inbox is open. Let's turn your vision into something the world can't ignore.",
        email: "axinbodyindia@gmail.com",
        links: [
          { icon: "✉", label: "Email Me", href: "mailto:axinbodyindia@gmail.com" },
          { icon: "📱", label: "WhatsApp", href: "https://wa.me/91XXXXXXXXXX" },
          { icon: "📸", label: "Instagram", href: "https://instagram.com/" },
          { icon: "💼", label: "LinkedIn", href: "https://linkedin.com/" },
        ],
      },
    },
    {
      type: "footer",
      order: 16,
      blocks: {
        logo: "AMIN",
        logoAccent: ".",
        copy: "© 2026 Amin Shaikh. All rights reserved. Built with ❤",
        links: [
          { label: "About", href: "#about" },
          { label: "Services", href: "#services" },
          { label: "Work", href: "#projects" },
          { label: "Contact", href: "#contact" },
        ],
      },
    },
  ];

  for (const s of sections) {
    const created = await prisma.section.create({
      data: { type: s.type, order: s.order, isVisible: true },
    });
    for (const [key, value] of Object.entries(s.blocks)) {
      await prisma.contentBlock.create({
        data: {
          sectionId: created.id,
          key,
          value: JSON.stringify(value),
        },
      });
    }
  }

  // Gallery page settings
  await prisma.galleryPage.deleteMany();
  await prisma.galleryPage.create({
    data: {
      eyebrow: "Creative Portfolio — 2026",
      titleLine1: "Work",
      titleLine2: "Gallery",
      titleLine3: "& Showcase",
      description:
        "Every project is a story. Browse through my complete body of work — sorted by skill, filtered by style. Click any card to explore the details.",
      bannerTitle: "Ready to Start a Project?",
      bannerSub:
        "Let's turn your next idea into something the world won't ignore.",
      bannerCta: "Get In Touch →",
      bannerHref: "/#contact",
    },
  });

  // Gallery skills + works
  await prisma.galleryWork.deleteMany();
  await prisma.gallerySkill.deleteMany();

  const skills = [
    {
      key: "video-editing",
      order: 2,
      label: "Video Editing",
      icon: "🎥",
      color: "#FFB86B",
      bg: "linear-gradient(135deg,#1a0d00,#2e1800)",
      emptyCount: 3,
      works: [
        { title: "Brand Film Edit", type: "Brand Film", result: "2.4M Views", year: "2025", desc: "Cinematic brand film for a premium product launch — slow-mo, motion graphics, and narrative arc." },
        { title: "YouTube Podcast Edit", type: "YouTube", result: "180K Subs", year: "2025", desc: "Long-form podcast edited for maximum retention with custom lower thirds and chapter markers." },
        { title: "Wedding Highlight", type: "Event", result: "Client Loved ❤", year: "2024", desc: "Emotionally driven 5-min wedding film with cinematic colour grade and custom music sync." },
        { title: "Product Unboxing", type: "Product", result: "+60% Watch Time", year: "2024", desc: "Highly engaging product unboxing edited for maximum hook and retention in the first 3 seconds." },
        { title: "Travel Reel", type: "Travel", result: "500K Reach", year: "2025", desc: "Fast-cut travel reel synced perfectly to music — 30 seconds of visual storytelling." },
        { title: "Corporate Edit", type: "Corporate", result: "Client Approved", year: "2024", desc: "Clean, professional corporate video for an annual report and investor presentation." },
      ],
    },
    {
      key: "videography",
      order: 3,
      label: "Videography",
      icon: "📹",
      color: "#4ECDC4",
      bg: "linear-gradient(135deg,#001a1a,#002e2c)",
      emptyCount: 4,
      works: [
        { title: "Product Shoot", type: "Commercial", result: "Used in Ads", year: "2025", desc: "Full-day product shoot for a D2C brand — overhead angles, macro shots, lifestyle footage." },
        { title: "Brand Event Coverage", type: "Event", result: "3 Deliverables", year: "2025", desc: "Live event coverage for a brand launch — interviews, b-roll, highlight reel, and recap." },
        { title: "Short Film", type: "Narrative", result: "Film Festival", year: "2024", desc: "Short narrative film shot on cinema lenses — 10-minute story with a 3-person crew." },
        { title: "Reel Shoot", type: "Social", result: "1.2M Reach", year: "2025", desc: "Shot and edited a 30-second reel from scratch — concept, shoot, edit, delivery in 48 hours." },
      ],
    },
    {
      key: "motion-graphics",
      order: 1,
      label: "Motion Graphics",
      icon: "✨",
      color: "#8C5CFF",
      bg: "linear-gradient(135deg,#1a0000,#2e0a0a)",
      emptyCount: 3,
      works: [
        { title: "Logo Animation", type: "Branding", result: "Brand Identity", year: "2025", desc: "Smooth, premium logo reveal animation with sound design — delivered in 4 formats." },
        { title: "Ad Motion Graphics", type: "Paid Ads", result: "4.2% CTR", year: "2025", desc: "Motion graphics package for a performance ad campaign — 3 sizes, 5 variations." },
        { title: "Kinetic Typography", type: "Social", result: "Viral Reel", year: "2024", desc: "Kinetic typography video for a quote-based Instagram campaign — 12 videos, weekly cadence." },
        { title: "Infographic Animation", type: "Explainer", result: "50K Views", year: "2025", desc: "Animated infographic explaining a complex product in 60 seconds with motion and icons." },
        { title: "Intro/Outro Pack", type: "YouTube", result: "Channel Branding", year: "2024", desc: "Custom YouTube intro, outro, and lower thirds pack for a creator channel." },
      ],
    },
    {
      key: "graphic-design",
      order: 0,
      label: "Graphic Design",
      icon: "🎨",
      color: "#D6FF3F",
      bg: "linear-gradient(135deg,#00101a,#001a2e)",
      emptyCount: 3,
      works: [
        { title: "Brand Identity Kit", type: "Branding", result: "Full Rebrand", year: "2025", desc: "Complete brand identity — logo, colour palette, typography, brand guidelines document." },
        { title: "Social Media Templates", type: "Social", result: "30 Templates", year: "2025", desc: "Canva + Photoshop template pack for consistent social media posting — 6 content types." },
        { title: "Packaging Design", type: "Product", result: "Print Ready", year: "2024", desc: "Premium packaging design for a D2C product — box, label, and insert card." },
        { title: "Thumbnail Pack", type: "YouTube", result: "+35% CTR", year: "2025", desc: "Custom YouTube thumbnail system for a creator — consistent style, high click-through rate." },
        { title: "Event Poster Series", type: "Print", result: "10 Designs", year: "2024", desc: "Print-ready event poster series for a cultural brand — 3 sizes, 10 unique designs." },
        { title: "Pitch Deck Design", type: "Business", result: "Deal Closed", year: "2025", desc: "Investor pitch deck design — 18 slides, premium layout, data visualization." },
      ],
    },
    {
      key: "social-media",
      order: 4,
      label: "Social Media Management",
      icon: "📱",
      color: "#A29BFE",
      bg: "linear-gradient(135deg,#0a0014,#140028)",
      emptyCount: 4,
      works: [
        { title: "60-Day IG Growth", type: "Instagram", result: "+180K Followers", year: "2025", desc: "Full content strategy + creation for a fitness brand — 3 posts/day, 60 days, 30 reels." },
        { title: "YouTube Channel Growth", type: "YouTube", result: "0→50K Subs", year: "2025", desc: "Strategy, content calendar, editing, and SEO for a YouTube channel from scratch to 50K." },
        { title: "LinkedIn Campaign", type: "LinkedIn", result: "10K Profile Views", year: "2024", desc: "Content strategy and post design for a professional — weekly LinkedIn posts for 3 months." },
        { title: "Brand Twitter/X", type: "Twitter/X", result: "2M Impressions", year: "2025", desc: "Managed a brand's Twitter presence — scheduling, creative content, and engagement strategy." },
      ],
    },
    {
      key: "visual-direction",
      order: 5,
      label: "Visual Direction",
      icon: "🎯",
      color: "#FD79A8",
      bg: "linear-gradient(135deg,#1a0010,#2e0018)",
      emptyCount: 5,
      works: [
        { title: "Campaign Visual Direction", type: "Campaign", result: "Award Nominated", year: "2025", desc: "Art directed a full 360 campaign for a fashion brand — moodboard to final delivery." },
        { title: "Lookbook Direction", type: "Fashion", result: "Photoshoot", year: "2024", desc: "Directed a 2-day brand lookbook shoot — 3 locations, 6 outfits, 120 selects." },
        { title: "Brand Style Guide", type: "Branding", result: "Full System", year: "2025", desc: "Created a full visual style guide — photography direction, colour system, tone of voice." },
      ],
    },
    {
      key: "marketing",
      order: 6,
      label: "B2C Marketing",
      icon: "📈",
      color: "#FF7675",
      bg: "linear-gradient(135deg,#1a0500,#2e0d00)",
      emptyCount: 4,
      works: [
        { title: "D2C Launch Campaign", type: "Performance", result: "ROAS 6.8×", year: "2025", desc: "Conceptualized and executed a full D2C product launch — ads, landing page copy, creatives." },
        { title: "Festive Sale Campaign", type: "Campaign", result: "₹12L Revenue", year: "2024", desc: "End-to-end festive season marketing campaign — Facebook Ads, Instagram Reels, email." },
        { title: "Influencer Campaign", type: "Influencer", result: "+40% Sales", year: "2025", desc: "Managed 8 micro-influencer collaborations for a skincare brand with tracking + briefs." },
        { title: "Email Marketing Flow", type: "Email", result: "42% Open Rate", year: "2025", desc: "Designed and wrote a 7-email welcome flow with segmentation and personalisation." },
      ],
    },
    {
      key: "leadership",
      order: 7,
      label: "Leadership",
      icon: "🧠",
      color: "#55EFC4",
      bg: "linear-gradient(135deg,#001a10,#002e1a)",
      emptyCount: 5,
      works: [
        { title: "Creative Team — Agency", type: "Team Lead", result: "8-Person Team", year: "2025", desc: "Led creative output for a digital agency — video, design, social — for 6 months." },
        { title: "Content Production Pipeline", type: "Ops", result: "3× Output", year: "2024", desc: "Designed and implemented a full content production pipeline, tripling the team output." },
        { title: "Brand Rebrand Project", type: "Direction", result: "Full Rebrand", year: "2025", desc: "Led a 3-month brand rebrand — coordinating designers, editors, and strategists." },
      ],
    },
  ];

  for (let i = 0; i < skills.length; i++) {
    const s = skills[i];
    const created = await prisma.gallerySkill.create({
      data: {
        key: s.key,
        label: s.label,
        icon: s.icon,
        color: s.color,
        bg: s.bg,
        order: s.order,
        emptyCount: s.emptyCount,
        isVisible: true,
      },
    });
    for (let j = 0; j < s.works.length; j++) {
      const w = s.works[j];
      await prisma.galleryWork.create({
        data: {
          skillId: created.id,
          title: w.title,
          type: w.type,
          result: w.result,
          year: w.year,
          desc: w.desc,
          order: j,
        },
      });
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
