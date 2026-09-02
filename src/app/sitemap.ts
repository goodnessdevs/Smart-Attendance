import type { MetadataRoute } from "next";

const BASE_URL = "https://smartendance.vercel.app";

/**
 * Public pages only.
 *
 * The Vite sitemap.xml listed all 30 routes including /admin/dashboard,
 * /lecturer/publish-attendance and /lecturer/auth. Authenticated routes have
 * nothing to offer a crawler and advertising them is free reconnaissance.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: BASE_URL, lastModified, priority: 1 },
    { url: `${BASE_URL}/lecturer`, lastModified, priority: 0.8 },
    { url: `${BASE_URL}/admin`, lastModified, priority: 0.5 },
    { url: `${BASE_URL}/login`, lastModified, priority: 0.6 },
    { url: `${BASE_URL}/lecturer/login`, lastModified, priority: 0.5 },
  ];
}
