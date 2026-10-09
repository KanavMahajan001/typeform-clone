"use client";

import { useState } from "react";
import { API_URL } from "@/lib/api";
import { newFormHref } from "@/lib/links";
import { NavLink } from "./NavLink";

type Entry = string | { label: string; items: string[] };

const HREFS: Record<string, string> = {
  "Developers / API": `${API_URL}/docs`,
  "Contact sales": "/forms",
};

const SOCIAL_URL: Record<string, string> = {
  Facebook: "https://www.facebook.com/typeform",
  X: "https://x.com/typeform",
  Instagram: "https://www.instagram.com/typeform",
  YouTube: "https://www.youtube.com/typeform",
  LinkedIn: "https://www.linkedin.com/company/typeform",
};

const hrefFor = (group: string, label: string) => (group.endsWith("templates") ? newFormHref(label) : HREFS[label]);

const COLUMNS: { heading: string; entries: Entry[] }[] = [
  {
    heading: "Product",
    entries: ["Pricing", { label: "Enterprise", items: ["Enterprise Overview", "Healthcare"] }],
  },
  {
    heading: "Templates",
    entries: [
      {
        label: "Popular templates",
        items: ["Interactive story template", "Trivia quiz", "Job application form", "Event registration form", "NPS survey"],
      },
      {
        label: "Recent templates",
        items: [
          "Photo upload form",
          "Customer satisfaction form",
          "Website questionnaire template",
          "Beta product feedback survey",
          "Pre-order form template",
        ],
      },
      {
        label: "Popular categories",
        items: ["Lead gen forms", "Lead gen quizzes", "Registration forms", "Customer success forms"],
      },
      {
        label: "Recent categories",
        items: ["File upload forms", "Job application forms", "Application forms", "Event forms", "Educational templates"],
      },
    ],
  },
  {
    heading: "Integrations",
    entries: [
      {
        label: "Popular integration apps",
        items: ["Slack integration", "Mailchimp integration", "Klaviyo integration", "Wordpress integration", "Pipedrive integration"],
      },
      {
        label: "More integration apps",
        items: ["Google Calendar integration", "Zoho integration", "Office 365 integration", "Zendesk integration"],
      },
      {
        label: "Popular app categories",
        items: [
          "Analytics reporting integration",
          "Sales and CRM Integration",
          "Payments integration",
          "Scheduling integration",
          "Email marketing integration",
        ],
      },
      {
        label: "More app categories",
        items: [
          "Customer Support integration",
          "Automation integration",
          "Documents integration",
          "Rewards integration",
          "Collaboration integration",
        ],
      },
    ],
  },
  {
    heading: "Resources",
    entries: [
      "Blog",
      "Guides",
      "Help center",
      "Community",
      "Tutorials",
      "FAQs",
      { label: "Why Typeform?", items: ["Typeform vs Jotform", "Typeform vs Formstack"] },
      "Referral program",
      { label: "Partners", items: ["Agency", "Technology", "Agency directory", "Startups"] },
      "System status",
      "Developers / API",
      "AI Info",
    ],
  },
  {
    heading: "Get to know us",
    entries: ["About us", "Brand", "Careers", "Contact sales", "Legal", "Newsletter"],
  },
];

const SOCIAL = [
  {
    name: "Facebook",
    path: "M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07z",
  },
  {
    name: "X",
    path: "M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64z",
  },
  {
    name: "Instagram",
    path: "M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z",
  },
  {
    name: "YouTube",
    path: "M23.5 6.2a3 3 0 0 0-2.12-2.12C19.5 3.58 12 3.58 12 3.58s-7.5 0-9.38.5A3 3 0 0 0 .5 6.2C0 8.07 0 12 0 12s0 3.93.5 5.8a3 3 0 0 0 2.12 2.12c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3 3 0 0 0 2.12-2.12C24 15.93 24 12 24 12s0-3.93-.5-5.8zM9.6 15.6V8.4l6.24 3.6-6.24 3.6z",
  },
  {
    name: "LinkedIn",
    path: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z",
  },
];

function Group({ entry }: { entry: Entry }) {
  const [open, setOpen] = useState(false);
  if (typeof entry === "string") {
    return <NavLink label={entry} href={hrefFor("", entry)} className="block text-base leading-[1.4]" />;
  }
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-8 items-center gap-2 text-base leading-[1.4] transition-colors hover:text-ink-300"
      >
        {entry.label}
        <svg viewBox="0 0 16 16" className={`h-[1.125rem] w-[1.125rem] transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.7803 5.88971C13.0732 6.18261 13.0732 6.65748 12.7803 6.95037L8.88387 10.8468C8.39572 11.335 7.60426 11.335 7.11611 10.8468L3.21967 6.95037C2.92678 6.65748 2.92678 6.18261 3.21967 5.88971C3.51256 5.59682 3.98744 5.59682 4.28033 5.88971L7.99999 9.60938L11.7197 5.88971C12.0126 5.59682 12.4874 5.59682 12.7803 5.88971Z"
            fill="currentColor"
          />
        </svg>
      </button>
      {open && (
        <div className="flex flex-col gap-4 pb-2 pl-4 pt-3">
          {entry.items.map((item) => (
            <NavLink key={item} label={item} href={hrefFor(entry.label, item)} className="text-base leading-[1.4]" />
          ))}
        </div>
      )}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink text-ink-25">
      <div className="border-b border-ink-800 py-20">
        <div className="container-site grid grid-cols-1 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {COLUMNS.map((column) => (
            <div key={column.heading}>
              <h3 className="mb-8 text-base font-bold uppercase">{column.heading}</h3>
              <ul className="flex flex-col gap-4">
                {column.entries.map((entry) => (
                  <li key={typeof entry === "string" ? entry : entry.label}>
                    <Group entry={entry} />
                  </li>
                ))}
              </ul>
              {column.heading === "Get to know us" && (
                <div className="mt-8 flex gap-2">
                  {SOCIAL.map((social) => (
                    <NavLink key={social.name} label={social.name} href={SOCIAL_URL[social.name]} className="h-6 w-6 transition-colors hover:text-purple-400">
                      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
                        <path d={social.path} />
                      </svg>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="py-8">
        <div className="container-site flex flex-col justify-between gap-4 text-sm sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-4">
            <NavLink label="Cookie settings" />
            <NavLink label="Cookies policy">Check our cookies policy to delete cookies</NavLink>
            <NavLink label="Report abuse" />
          </div>
          <div>© Typeform</div>
        </div>
      </div>
    </footer>
  );
}
