/**
 * E2E Test: Smoke Test
 * Basic test to verify Cypress setup and app accessibility
 */

describe("Smoke Test", () => {
  it("should load the homepage", () => {
    cy.visit("/");
    cy.contains("CalmSync").should("be.visible");
  });
});

