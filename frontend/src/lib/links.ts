import { toast } from "sonner";

export const newFormHref = (title = "") => `/forms?new=${encodeURIComponent(title)}`;

export const comingSoon = (feature: string) => toast(`${feature} is coming soon`);
