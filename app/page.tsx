import Hero from "@/components/Home/Hero";
import Projects from "@/components/Home/Projects";
import Skills from "@/components/Home/Skills";
import What from "@/components/Home/What";
import Me from "@/components/Home/Me";
import Brief from "@/components/Home/Brief";
import TopographyBackground from "@/components/Bg/TopographyBackground";
import BCta from "@/components/Home/BCta";
import Cta from "@/components/Home/Cta";
import Footer from "@/components/Home/Footer";

import type { Metadata } from "next";

const SITE_URL = "https://appzvile.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title:
    "Appash A S | Frontend Developer, Graphic Designer & Video Editor in Kerala",
  description:
    "Appash A S is a Kerala-based frontend developer, video editor and graphic designer creating cinematic videos, brands and fast modern websites.",
  keywords: [
    "Appash A S",
    "Appash",
    "Appzvile",
    "video editor Kerala",
    "graphic designer Kerala",
    "frontend developer Kerala",
    "freelance web developer India",
    "Next.js developer",
    "portfolio",
    "visual director",
  ],
  authors: [{ name: "Appash A S", url: SITE_URL }],
  creator: "Appash A S",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Appash A S | Frontend Developer, Graphic Designer & Video Editor",
    description:
      "Cinematic video, design and modern web development by Appash A S, based in Kerala, India.",
    url: SITE_URL,
    siteName: "Appash A S",
    images: [
      {
        url: "/og-image.jpg", // put a 1200x630 image in /public
        width: 1200,
        height: 630,
        alt: "Appash - Frontend Developer, Video Editor and Graphics Designer",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Appash A S | Frontend Developer, Graphic Designer & Video Editor",
    description:
      "Cinematic video, design and modern web development from Kerala, India.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon1.png", sizes: "96x96", type: "image/png" },

    ],
    apple: "/apple-icon.png",
    shortcut: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Appash A S",
      alternateName: ["Appash", "Appzvile"],
      url: SITE_URL,
      image: `${SITE_URL}/og-image.jpg`,
      jobTitle: "Video Editor, Graphic Designer & Frontend Developer",
      address: {
        "@type": "PostalAddress",
        addressRegion: "Kerala",
        addressCountry: "IN",
      },
      knowsAbout: [
        "Video Editing",
        "Graphic Design",
        "Frontend Development",
        "Next.js",
        "Three.js",
        "GSAP",
      ],
      sameAs: [
        // add your real profiles
        "https://www.linkedin.com/in/appash-a-s",
        "https://www.instagram.com/appzvile",
        "https://github.com/appash786",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Appash A S",
      alternateName: "Appzvile",
      inLanguage: "en-IN",
      publisher: { "@id": `${SITE_URL}/#person` },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TopographyBackground />
      <main>
        <Hero />
        <Brief />
        <Me />
        <Skills />
        <What />
        <Projects />
        <BCta />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
