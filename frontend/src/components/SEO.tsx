import React, { useEffect } from "react";

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
}

const DEFAULT_TITLE = "Vault | Personal Productivity & Tracking Suite";
const DEFAULT_DESC =
  "Vault (ConnectVault & TasteVault) helps you manage relationships and rate dining experiences in one unified personal productivity suite.";
const DEFAULT_IMAGE = "https://www.example.com/og-cover.png";
const SITE_URL = "https://www.example.com";

// Helper to set or update a meta tag
function upsertMeta(
  selector: { name?: string; property?: string },
  content: string | undefined
) {
  if (!content) return;
  const key = selector.name ? "name" : "property";
  const value = selector.name || selector.property || "";
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${key}="${value}"]`
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(key, value);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  image,
  keywords = [],
  noIndex = false,
}) => {
  useEffect(() => {
    const fullTitle = title ? `${title} | Vault` : DEFAULT_TITLE;
    const metaDescription = description || DEFAULT_DESC;
    const metaImage = image || DEFAULT_IMAGE;
    const canonicalUrl = canonical || SITE_URL;
    const keywordContent = keywords.length ? keywords.join(", ") : undefined;

    // Title
    document.title = fullTitle;

    // Basic meta
    upsertMeta({ name: "description" }, metaDescription);
    if (keywordContent) upsertMeta({ name: "keywords" }, keywordContent);
    if (noIndex) {
      upsertMeta({ name: "robots" }, "noindex,nofollow");
    } else {
      // Ensure robots tag reflects index when not noIndex
      upsertMeta({ name: "robots" }, "index,follow");
    }

    // Canonical link
    let linkEl = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );
    if (!linkEl) {
      linkEl = document.createElement("link");
      linkEl.setAttribute("rel", "canonical");
      document.head.appendChild(linkEl);
    }
    linkEl.setAttribute("href", canonicalUrl);

    // Open Graph
    upsertMeta({ property: "og:title" }, fullTitle);
    upsertMeta({ property: "og:description" }, metaDescription);
    upsertMeta({ property: "og:type" }, "website");
    upsertMeta({ property: "og:url" }, canonicalUrl);
    upsertMeta({ property: "og:image" }, metaImage);

    // Twitter
    upsertMeta({ name: "twitter:card" }, "summary_large_image");
    upsertMeta({ name: "twitter:title" }, fullTitle);
    upsertMeta({ name: "twitter:description" }, metaDescription);
    upsertMeta({ name: "twitter:image" }, metaImage);
  }, [title, description, canonical, image, keywords, noIndex]);

  return null;
};

export default SEO;
