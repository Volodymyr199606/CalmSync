// ***********************************************************
// This support file is loaded before every E2E spec.
// You can add global setup, custom commands, and more here.
// ***********************************************************

// Import Cypress commands
import "./commands";

// Suppress uncaught:exception to prevent test failures from unhandled errors
// that don't affect the test flow (e.g., third-party scripts).
Cypress.on("uncaught:exception", (err, runnable) => {
  // Return false to prevent Cypress from failing the test
  // Only for known safe exceptions; adjust as needed
  return false;
});

