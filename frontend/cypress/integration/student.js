describe("Student testing", () => {
  it("Visit inital page", () => {
    cy.visit("http://localhost:3000/");

    cy.contains("Student").click();
    cy.url().should("include", "/student");
  });

  it('Start quiz', () => {
    cy.visit('http://localhost:3000/student');

    cy.get('#code').type('990090');
    cy.get('#login').type('aidar');

    cy.get('.ant-btn').click();

  })
});
