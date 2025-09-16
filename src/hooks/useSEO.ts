import { useEffect } from "react";

type SEOProps = {
  title: string;
  description: string;
  url?: string;   // optional for OG
  type?: string;  // default: "website"
};

export function useSEO({ title, description, url, type = "website" }: SEOProps) {
  useEffect(() => {
    // --- Page title ---
    if (title) document.title = title;

    // --- Meta description ---
    updateMetaTag("name", "description", description);

    // --- Open Graph (Facebook/LinkedIn/WhatsApp) ---
    updateMetaTag("property", "og:title", title);
    updateMetaTag("property", "og:description", description);
    if (url) updateMetaTag("property", "og:url", url);
    updateMetaTag("property", "og:type", type);

    // --- Twitter cards ---
    updateMetaTag("name", "twitter:title", title);
    updateMetaTag("name", "twitter:description", description);
    updateMetaTag("name", "twitter:card", "summary_large_image");
  }, [title, description, url, type]);
}

/**
 * Utility to create or update meta tags dynamically
 */
function updateMetaTag(attr: "name" | "property", key: string, value: string) {
  if (!value) return;

  let element = document.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`
  );

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", value);
}
