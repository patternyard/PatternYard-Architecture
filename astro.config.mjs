import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import astroD2 from "astro-d2";

// https://astro.build/config
export default defineConfig({
  // Update to the production URL once the docs site has a domain/Vercel URL.
  site: "https://architecture.patternyard.dev",
  integrations: [
    // astro-d2 renders ```d2 fenced code blocks into themed SVG at build time.
    // useD2js runs the D2 compiler as pure JavaScript (D2.js) instead of shelling
    // out to the native `d2` binary. This is what lets the site build on Vercel
    // (and anywhere else) without installing an external binary in the build step.
    astroD2({
      experimental: { useD2js: true },
      // elk ships free and produces clean orthogonal layouts for system maps.
      // (TALA looks best for architecture but needs a licensed native binary,
      // which is incompatible with the binary-free useD2js path.)
      layout: "elk",
      theme: {
        // Theme IDs: https://d2lang.com/tour/themes
        default: "0", // Neutral default for light mode
        dark: "200", // Dark Mauve reads well on Starlight's dark canvas
      },
      sketch: false,
      pad: 20,
    }),
    starlight({
      title: "PatternYard Architecture",
      description:
        "System architecture, operations runbooks, and reference for the PatternYard platform.",
      customCss: ["./src/styles/diagrams.css"],
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/patternyard",
        },
      ],
      sidebar: [
        {
          label: "Overview",
          items: [
            { label: "What is PatternYard", slug: "index" },
            { label: "Success criteria", slug: "success-criteria" },
            { label: "How to use these docs", slug: "using-these-docs" },
          ],
        },
        {
          label: "Architecture",
          items: [{ autogenerate: { directory: "architecture" } }],
        },
        {
          label: "Operations",
          items: [{ autogenerate: { directory: "operations" } }],
        },
        {
          label: "Reference",
          items: [{ autogenerate: { directory: "reference" } }],
        },
      ],
    }),
  ],
});
