describe('User Authentication Frontend Tests', () => {
  beforeEach(() => {
    // Visit the login page (adjust URL as needed)
    cy.visit('http://localhost:3000/login');
  });

  it('shows the login form', () => {
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('button[type="submit"]').contains('Login');
  });

  it('displays an error for invalid credentials', () => {
    cy.get('input[name="email"]').type('wrong@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // Check for the error message your frontend shows on invalid credentials
    cy.contains('Invalid email or password').should('be.visible');
  });

  it('logs in successfully with correct credentials', () => {
    cy.get('input[name="email"]').type('khadrawyahmed1@gmail.com');
    cy.get('input[name="password"]').type('Trials500');
    cy.get('button[type="submit"]').click();

  });
});




//Register Test
describe('User Registration Frontend Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/register');
  });

  it('displays the registration form', () => {
    cy.get('input[name="name"]').should('exist');
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('button[type="submit"]').contains('Register');
  });

  it('registers a new user successfully', () => {
    cy.get('input[name="name"]').type('TestUser');
    cy.get('input[name="email"]').type('newuser@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Check for whatever your frontend shows on success
    cy.contains('User registered successfully').should('be.visible');
  });

  it('displays error for missing fields', () => {
    cy.get('input[name="email"]').type('incompleteuser@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

  });

  it('displays error for invalid email format', () => {
    cy.get('input[name="name"]').type('Invalid Email User');
    cy.get('input[name="email"]').type('invalidEmail');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

  });

  it('displays error for duplicate email', () => {
    cy.get('input[name="name"]').type('Ahmed');
    cy.get('input[name="email"]').type('khadrawyahmed1@gmail.com');
    cy.get('input[name="password"]').type('Trials500');
    cy.get('button[type="submit"]').click();

    cy.contains('Email already exists');
  });
});
