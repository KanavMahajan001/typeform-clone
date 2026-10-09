export interface NavItem {
  label: string;
  sub?: string;
  isNew?: boolean;
}

export interface NavColumn {
  heading: string;
  icon: string;
  items?: NavItem[];
  more?: string;
  feature?: { image: string; text: string; cta: string };
}

export interface NavMenu {
  label: string;
  columns: NavColumn[];
}

export const NAV_MENUS: NavMenu[] = [
  {
    label: "Platform",
    columns: [
      {
        heading: "Platform",
        icon: "by-workflow",
        items: [
          { label: "Platform overview", sub: "What is Typeform?" },
          { label: "Typeform AI", sub: "Your AI know-pilot" },
          { label: "Typeform MCP", sub: "Use Typeform from your AI tools", isNew: true },
          { label: "Growth Flow", sub: "Automated workflows for GTM teams", isNew: true },
          { label: "Research Flow", sub: "AI-moderated research studies", isNew: true },
          { label: "Contacts & Automations", sub: "Automated workflows to grow your business" },
          { label: "Video engagement", sub: "Interactive video forms" },
          { label: "Analytics and reporting", sub: "Answers you can act on" },
          { label: "Integrations", sub: "Connect all your apps" },
        ],
      },
      {
        heading: "Tools",
        icon: "tools",
        items: [
          { label: "Form builder" },
          { label: "Survey maker" },
          { label: "Quiz maker" },
          { label: "Test maker" },
          { label: "Poll builder" },
          { label: "Application form builder" },
          { label: "Landing page builder" },
          { label: "NPS form builder" },
          { label: "Registration form builder" },
          { label: "Short form builder" },
        ],
      },
      {
        heading: "Templates",
        icon: "templates",
        feature: {
          image: "/images/templates.webp",
          text: "Free form, survey, and quiz templates",
          cta: "Choose one →",
        },
      },
    ],
  },
  {
    label: "Solutions",
    columns: [
      {
        heading: "Teams",
        icon: "by-team",
        items: [
          { label: "Marketing", sub: "For B2B and B2C marketing" },
          { label: "Product", sub: "For product, UX, and research" },
          { label: "Human resources", sub: "For HR, ops, and talent" },
          { label: "Customer success", sub: "For CS and education" },
        ],
      },
      {
        heading: "Use cases",
        icon: "by-goal",
        items: [
          { label: "Lead generation" },
          { label: "Employee onboarding" },
          { label: "Employee satisfaction" },
          { label: "Employee engagement" },
          { label: "Customer feedback" },
        ],
        more: "View all use cases →",
      },
      {
        heading: "Plans",
        icon: "by-workflow",
        items: [
          { label: "Core", sub: "Plans for everyone" },
          { label: "Growth", sub: "Plans for GTM teams", isNew: true },
          { label: "Research Flow", sub: "Plans for research teams", isNew: true },
          { label: "Talent", sub: "Plans for HR and people teams" },
          { label: "Enterprise", sub: "Plans for larger orgs" },
        ],
      },
    ],
  },
  {
    label: "Resources",
    columns: [
      {
        heading: "Support",
        icon: "support",
        items: [
          { label: "Help center", sub: "Find quick answers" },
          { label: "Community", sub: "Share and interact" },
          { label: "Contact us", sub: "Speak to our team" },
        ],
      },
      {
        heading: "Company",
        icon: "company",
        items: [
          { label: "Partners", sub: "Browse or join" },
          { label: "Careers", sub: "Join our team" },
          { label: "Webinars", sub: "Learn and get inspired" },
        ],
      },
      {
        heading: "Blog",
        icon: "blog",
        feature: {
          image: "/images/blog.webp",
          text: "Our guides, latest news, and more.",
          cta: "Browse blog →",
        },
      },
    ],
  },
];

export const RESEARCH_FEATURE = {
  heading: "Research Flow",
  icon: "star",
  feature: {
    image: "/images/research-flow.avif",
    text: "Run in-depth AI-moderated studies in hours",
    cta: "Learn more →",
  },
};
