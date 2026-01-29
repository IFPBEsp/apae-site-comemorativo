describe('Sistema APAE - Cadastro de Usuários', () => {

  // PRÉ-REQUISITO: Estar logado como ADMIN
  beforeEach(() => {
    cy.viewport(1024, 1300);
    // 1. Faz o Login primeiro
    cy.visit('http://localhost:3001/pages/login');
    cy.get('input[name="username"]').type('ADMIN');
    cy.get('input[name="password"]').type('APAEADMINIFPB2023-1');
    cy.get('button[type="submit"]').click();
    cy.wait(2000); 
    cy.visit('http://localhost:3001/pages/registro'); 
    cy.wait(1000);
  });

  it('Deve preencher o formulário e cadastrar um Funcionário', () => {
    // GERA DADOS ÚNICOS:
    // Usa a hora atual para criar um nome que nunca se repete.
    // Assim não dá erro de "Usuário já existe".
    const id = Date.now().toString().slice(-4); 
    const nomeFicticio = `Funcionario Demo ${id}`;
    const usuarioFicticio = `func.apae.${id}`;
    const senhaFicticia = '123456';

    // 1. Preenche Nome Completo
    cy.get('input[name="nomeCompleto"]').type(nomeFicticio, { delay: 60 });
    cy.wait(1000);

    // 2. Preenche Usuário
    cy.get('input[name="usuario"]').type(usuarioFicticio, { delay: 60 });
    cy.wait(1000);

    // 3. Preenche Senha
    cy.get('input[name="senha"]').type(senhaFicticia, { delay: 60 });
    cy.wait(1000);

    // 4. Preenche Confirmar Senha
    cy.get('input[name="confirmarSenha"]').type(senhaFicticia, { delay: 60 });
    cy.wait(1000);

    // 5. Seleciona "Funcionário"
    cy.get('input[value="Funcionario"]').check({ force: true });
    cy.wait(1500);

    // 6. Clica em Cadastrar
    cy.get('button[type="submit"]').click();

    // 7. VERIFICAÇÃO (Sucesso)
    cy.wait(2000);
    
    // Procura pela mensagem de sucesso: 
    cy.get('body').invoke('text').should('match', /cadastrado com sucesso/i);

    cy.log(`Cadastro do usuário ${usuarioFicticio} realizado!`);
  });

});
