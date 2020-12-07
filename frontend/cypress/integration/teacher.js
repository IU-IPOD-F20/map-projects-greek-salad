const { default: Password } = require("antd/lib/input/Password");

describe("Teacher testing", () => {
  it("Visit inital page", () => {
    cy.visit("/");

    cy.contains("Teacher").click();
    cy.url().should("include", "/teacher");
  });

  it("sets auth cookie when logging in via form submission", function () {
    // destructuring assignment of the this.currentUser object
    // const { username, password } = this.currentUser
    const password = "a";

    cy.visit("/login");

    cy.get("#basic_email").type("a@a.ru");

    // {enter} causes the form to submit
    cy.get("#basic_password").type(`${password}{enter}`);

    // we should be redirected to /dashboard
    cy.url().should("include", "/teacher");

    // our auth cookie should be present
    // cy.getCookie("fastapiusersauth").should("");
    // cy.getCookie("").should("exist");

    // UI should reflect this user being logged in
    // cy.get("h1").should("contain", "jane.lane");
  });
});
