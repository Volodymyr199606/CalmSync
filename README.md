# CalmSync

Your personal relaxation companion - a mood-based relaxation experience generator.

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Testing**: Vitest + @testing-library/react
- **Auth**: NextAuth.js (Google OAuth)
- **Monitoring**: Sentry
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL database (Neon recommended)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd CalmSync
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

Edit `.env.local` with your actual values.

4. Set up the database:
```bash
pnpm prisma:migrate
pnpm prisma:generate
```

5. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm test` - Run tests
- `pnpm test:ui` - Run tests with UI
- `pnpm prisma:generate` - Generate Prisma client
- `pnpm prisma:migrate` - Run database migrations
- `pnpm prisma:studio` - Open Prisma Studio

## Project Structure

```
calmsync/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   └── ui/            # shadcn/ui components
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries
│   ├── prisma.ts      # Prisma client
│   └── utils.ts       # Helper functions
├── prisma/            # Prisma schema and migrations
├── tests/             # Test files
└── types/             # TypeScript type definitions
```

## Development Guidelines

See [project.mdc](./project.mdc) for comprehensive development rules and guidelines.

## License

ISC

