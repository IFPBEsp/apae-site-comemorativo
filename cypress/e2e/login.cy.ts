describe('Fluxo de Autenticação (Modo Apresentação)', () => {
  
  beforeEach(() => {
    cy.viewport(1024, 1300);

    // Visita a página
    cy.visit('http://localhost:3001/pages/login'); 
    cy.wait(1000); 
  });

  it('Cenário 1: Tentativa de Login com Senha Incorreta', () => {
    // Digita o usuário
    cy.get('input[name="username"]').type('ADMIN');
    cy.wait(1000); 
    
    // Digita a senha ERRADA
    cy.get('input[name="password"]').type('senha_errada_teste');
    cy.wait(1000);

    // Clica em entrar
    cy.get('button[type="submit"]').click();
    cy.wait(3000); 

    // Verifica se a mensagem de erro apareceu
    cy.get('body').invoke('text').should('match', /credenciais inválidas|erro|unauthorized/i);
      
    // Garante que não entrou
    cy.url().should('include', '/login');
  });

  //teste para entrar
  it('Cenário 2: Login com Sucesso (Administrador)', () => {
    // Digita o usuário
    cy.get('input[name="username"]').type('ADMIN');
    cy.wait(1000);
    
    // Digita a senha CORRETA
    cy.get('input[name="password"]').type('APAEADMINIFPB2023-1', { delay: 50 });
    cy.wait(1000);

    // Clica em entrar
    cy.get('button[type="submit"]').click();

    // Espera o redirecionamento acontecer visualmente
    cy.wait(2000);

    // Verifica que saiu da tela de login (Entrou no sistema)
    cy.url().should('not.include', '/login');
    
    cy.log('Apresentação: Login realizado com sucesso!');
  });

});