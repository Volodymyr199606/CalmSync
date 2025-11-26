/// <reference types="cypress" />

// Custom Cypress commands for CalmSync E2E tests

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to log in via magic link flow (simulated)
       * @param email - User email address
       * @example cy.login('test@example.com')
       */
      login(email: string): Chainable<void>;

      /**
       * Custom command to seed the database with test data
       * @example cy.seedDatabase()
       */
      seedDatabase(): Chainable<void>;

      /**
       * Custom command to clean up test data
       * @example cy.cleanupDatabase()
       */
      cleanupDatabase(): Chainable<void>;
    }
  }
}

/**
 * Login command - simulates magic link authentication
 * In production, you'd intercept the email or use a test API endpoint
 */
Cypress.Commands.add("login", (email: string) => {
  cy.log(`Logging in as ${email}`);
  
  // Visit homepage
  cy.visit("/");
  
  // Fill in email
  cy.get('input[type="email"]').type(email);
  
  // Submit form
  cy.get('button[type="submit"]').click();
  
  // In a real scenario, you'd either:
  // 1. Mock the magic link email service
  // 2. Use a test API endpoint to generate a valid session
  // 3. Directly set session cookies
  
  // For now, we'll assume the app handles test emails specially
  // or we'd implement a /api/test/auth endpoint
});

/**
 * Seed database with test data
 */
Cypress.Commands.add("seedDatabase", () => {
  cy.log("Seeding test database");
  // Call your seed API endpoint
  // cy.request("POST", "/api/test/seed");
});

/**
 * Clean up test data from database
 */
Cypress.Commands.add("cleanupDatabase", () => {
  cy.log("Cleaning up test database");
  // Call your cleanup API endpoint
  // cy.request("POST", "/api/test/cleanup");
});

export {};

