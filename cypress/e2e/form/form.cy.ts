
describe('template spec', () => {
  interface FormDataTypes {
      name: string;
      email:string;
      password:string;
      age:string;
      phone:string;
  }

  interface FormData {
    valid: FormDataTypes;
    invalid: {
      empty: FormDataTypes;
      invalidEmail:FormDataTypes;
      shortPassword:FormDataTypes;
      invalidAge:FormDataTypes;
    }
  }

  const formData: FormData = {
    valid: {
      name :'Test User',
      email: 'test@example.com',
      password: 'Password123',
      age: '30',
      phone: '1234567890',
    },
    invalid: {
      empty: {
        name: '',
        email: '',
        password: '',
        age: '',
        phone: '',
      },
      invalidEmail: {
        name: 'Test User',
        email: 'invalid-email',
        password: 'Password123',
        age: '30',
        phone: '1234567890',
      },
      shortPassword: {
        name: 'Test User',
        email: 'test@example.com',
        password: '123',
        age: '30',
        phone: '1234567890',
      },
      invalidAge: {
        name: 'Test User',
        email: 'test@example.com',
        password: '1235555',
        age: '3',
        phone: '1234567890',
      }
    },
  }


  beforeEach(()=>{
    cy.visit('/')
  })

  it('passed without any error', () => {
    fillForm(formData.valid);
    cy.get('button[type="submit"]').click();
    //assertError('Name is required');
  });

  it('should display errors for all empty fields', () => {
    fillForm(formData.invalid.empty);
    cy.get('button[type="submit"]').click();
    assertError('Name is required');
    assertError('Email is required');
    assertError('Password is required');
    assertError('Age is required');
    assertError('Phone number is required');

  });

  it('should display invalid email error',()=>{
    fillForm(formData.invalid.invalidEmail);
    cy.get('button[type="submit"]').click();
    assertError('Email is invalid')
  })


  it('should display short password error',()=>{
    fillForm(formData.invalid.shortPassword);
    cy.get('button[type="submit"]').click();
    assertError('Password must be at least 6 characters long')
  })

  it('should display less age error',()=>{
    fillForm(formData.invalid.invalidAge);
    cy.get('button[type="submit"]').click();
    assertError('Age should be greater than or equal to 15')
  })






  function fillForm(data :  Partial<FormDataTypes> ) {

    if (data.name) {
      cy.get('input[name="name"]').clear().type(data.name);
    }
    if (data.email) {
      cy.get('input[name="email"]').clear().type(data.email);
    }
    if (data.password) {
      cy.get('input[name="password"]').clear().type(data.password);
    }
    if (data.age) {
      cy.get('input[name="age"]').clear().type(data.age);
    }
    if (data.phone) {
      cy.get('input[name="phone"]').clear().type(data.phone);
    }

  }

  function assertError(message:string) {
    cy.contains(message).should('exist');
  }
})

