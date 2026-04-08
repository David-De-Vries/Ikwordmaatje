# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### Careibu Mobile (`artifacts/mobile/`)
- **Framework**: Expo (React Native) with Expo Router file-based routing
- **Purpose**: 11-step volunteer onboarding flow for Careibu (Dutch senior-volunteer platform)
- **Design**: MUI-inspired design system; teal background `#8CBFBB`, crimson primary `#A01550`, white cards
- **Language**: Dutch (UI labels, button text, copy)
- **Persistence**: AsyncStorage via `context/OnboardingContext.tsx`

#### Design System
- `constants/design-system.ts` — Full DS with Figma conversion comments (palette, typography, spacing, shape, shadows, z-index)
- `constants/colors.ts` — Brand color tokens
- `components/ui/` — MUI-inspired component library (Button, TextField, Typography, Card, Banner, IconBadge, Chip)
- `components/ProgressHeader.tsx` — Segmented step bar header
- `components/SelectCard.tsx` — Single/multi-select cards
- `components/SliderInput.tsx` — Touch-based range slider

#### Screen Flow
1. `/signup` — Account creation
2. `/step1` — About You (personal info)
3. `/step2` — Project Selection (8 project types)
4. `/step3` — Context (read-only explainer)
5. `/step4` — Preferences (activities, dementia experience, comfort slider)
6. `/step5` — Availability & Location
7. `/step7` — Expectations (read-only)
8. `/step8` — Profile Summary (editable sections)
9. `/loading` — Animated saving state (auto-navigates to step9)
10. `/step9` — Matches (3 senior profiles)
11. `/step10` — Schedule & Contact Prefs
12. `/step11` — Completion / Welcome

#### Navigation
- `app/(tabs)/_layout.tsx` — Stack navigator (no tabs), `headerShown: false`, `gestureEnabled: false`
- `app/_layout.tsx` — Root layout wrapping everything in `OnboardingProvider`

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
