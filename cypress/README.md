# Cypress E2E Tests

## Setup

This project uses Cypress for end-to-end testing, following the project rules:

- Tests are in TypeScript under `cypress/e2e/**/*.cy.ts`
- Run against real Next.js dev server on `http://localhost:3000`
- Use semantic queries (roles, labels, visible text)
- Cover auth flow, mood check-in, dashboard, and error states
- Test responsive layouts (mobile ~390px, desktop 1280px)

## Running Tests

```bash
# Open Cypress Test Runner (interactive)
pnpm cypress

# Run tests in headless mode
pnpm cypress:headless

# Run E2E tests with auto-start dev server
pnpm test:e2e
```

## Current Test Coverage

1. **auth.cy.ts** - Magic link authentication flow
   - Landing page display
   - Email validation
   - Form submission
   - Redirect behavior

2. **dashboard.cy.ts** - Dashboard layout and state
   - Welcome message
   - Mood check-in form
   - Empty state
   - Responsive layout (mobile + desktop)

3. **mood-flow.cy.ts** - Mood check-in and experience generation
   - Complete flow
   - Form validation
   - Mobile support
   - Form reset after submission

4. **mood-error-states.cy.ts** - Error handling
   - API failures (mood + experience)
   - Validation errors
   - Network timeouts
   - Unauthorized errors
   - Notes length validation

5. **smoke.cy.ts** - Basic smoke test
   - Homepage loads

## Authentication Note

Many tests are currently stubbed because they require:
1. Test authentication helper (`cy.login()`)
2. Test database seeded with users
3. Test API endpoints or session cookie manipulation

Per project rules, E2E tests should use realistic flows with real route handlers and a dedicated test database (not mocking).

## Future Implementation

To fully implement these tests:
1. Create test database on Neon (separate from dev/prod)
2. Implement `cy.seedDatabase()` and `cy.cleanupDatabase()` commands
3. Add test auth endpoint or configure Resend with test mode
4. Implement `cy.login()` helper for session management
5. Mock only external services (email provider)

