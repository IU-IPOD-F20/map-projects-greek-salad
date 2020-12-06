describe("Teacher testing", () => {
  it("Visit inital page", () => {
    cy.visit("http://localhost:3000/");

    cy.contains("Teacher").click();
    cy.url().should("include", "/teacher");
  });
});
