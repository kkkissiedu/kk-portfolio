# Kwabena Kwayisi Kissiedu — Portfolio Project Context

## Project
Personal portfolio for Kwabena Kwayisi Kissiedu — Structural Engineer, ML Researcher, 3D Designer.

## Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (theme tokens in `app/globals.css`)
- **Animation:** GSAP + ScrollTrigger
- **3D:** Three.js, @react-three/fiber, @react-three/drei (used by `Model3DViewer` for 3D Design project models)
- **CMS:** Sanity (next-sanity, @sanity/image-url)
- **Email:** Resend
- **Hosting:** Vercel

## Brand — Deep Navy (Light Mode, Zebra)
| Token | Hex | Use |
|-------|-----|-----|
| `--color-anthracite` | `#0A1A33` | Dark navy surface (Hero overlay + Footer only) |
| `--color-cream` | `#F4F6FA` | Off-white alternating section bg |
| `--color-surface` | `#FFFFFF` | White alternating section bg |
| `--color-dark-text` | `#1A1F2E` | Body text |
| `--color-gold` | `#0F2C5C` | Primary navy accent |
| `--color-gold-highlight` | `#1B4396` | Accent hover |
| `--color-gold-dark` | `#0A1F44` | Darker accent variant |
| `--color-gold-heading` | `#0A1A33` | Heading-tone accent |

Token names retained from Anthracite codebase (gold/anthracite/cream) to minimize diff; semantics now navy-light-mode.

## Typography
- **Headings:** Cormorant Garamond
- **Body:** Inter

## Sanity Project
- **Project ID:** `jv5ghckv`
- **Dataset:** `production`
- **Env var:** `NEXT_PUBLIC_SANITY_PROJECT_ID=jv5ghckv` in `.env.local`
- **Studio:** to be deployed at `kk-portfolio.sanity.studio` (run `npx sanity deploy` after first studio build)

### Schema Types
- `siteSettings` (singleton) — Hero, About (bio + photo + 2 CV files + Anthracite link), What I Do, Toolkit (3 editable category titles + editable icon lists), Channel, Contact, Footer, sub-page hero overrides
- `project` — title, slug, category (`structural-engineering` | `ml-research` | `3d-design`), subcategory, shortDescription, overview (PortableText), mainImage, gallery, year, client, location, tools, videoUrl, videoFile, model3d (3D Design only), panorama, githubUrl, youtubeVideoId, progressPdfUrl, featured, order
- `publication` — title, authors, venue, year, status (`accepted` | `published` | `in-progress`), url, abstract, order
- `testimonial` — quote, name, role, order
- `galleryGroup` — name, order, items[] (each: type `image`/`youtube`, image OR youtubeUrl, caption)

CV files (`academicCv`, `professionalCv`) live as file assets on `siteSettings`.

## Homepage Section Order
1. Navbar
2. Hero
3. About
4. What I Do (single row, 3 cards: ML & Research | Structural Engineering | 3D Design)
5. Featured Projects
6. Publications
7. My Toolkit
8. From the Channel (YouTube embed)
9. Testimonials
10. Contact
11. Footer

## Routes
- `/` — homepage (sections above)
- `/work/structural-engineering` — Structural project grid
- `/work/ml-research` — ML project grid + Publications list
- `/work/3d-design` — 3D project grid
- `/gallery` — grouped gallery (images + YouTube embeds)
- `/api/contact` — Resend POST
- `/api/revalidate` — Sanity webhook

## Navbar
`Home · About · Work · Publications · YouTube · Gallery · Contact`

## Contact / Resend
- Send to: `kissiedukwabena4@gmail.com`
- Subject: `[Portfolio] New message from {name}`
- `replyTo` set to sender email
- Reuses existing `RESEND_API_KEY`

## ProjectModal
"View on GitHub" button shown only when `githubUrl` is set AND `category === "ml-research"`.

## Git Workflow
Always commit before merging. Use `git push origin HEAD:main`. Never `git push origin main`. **Do not add Claude as a collaborator on the GitHub repo.**

## GitHub
Remote: `git@github.com:kkkissiedu/kk-portfolio.git`

## Vercel
Project name: `kk-portfolio`

## Sanity Deployment

`.env.local` may live in the main project root. When running `npx sanity deploy` and `NEXT_PUBLIC_SANITY_PROJECT_ID` is missing, prefix inline:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=jv5ghckv npx sanity deploy
```

Project ID is also visible at https://sanity.io/manage.
