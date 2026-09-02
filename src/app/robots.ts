import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        "/dashboard",
        "/onboarding",
        "/account-profile",
        "/register-courses",
        "/all-courses",
        "/inbox",
        "/course/",
        "/attendance/",
        "/lecturer/dashboard",
        "/lecturer/publish-attendance",
        "/lecturer/attendance/",
        "/lecturer/register-courses",
        "/lecturer/account-profile",
        "/lecturer/inbox",
        "/lecturer/onboarding",
      ],
    },
    sitemap: "https://smartendance.vercel.app/sitemap.xml",
  };
}
