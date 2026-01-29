describe('Gestão de Datas Comemorativas (Admin)', () => {

  // Antes de tudo, fazemos login como ADMIN
  beforeEach(() => {
     cy.viewport(1024, 1300);
    // 1. Login
    cy.visit('http://localhost:3001/pages/login');
    cy.get('input[name="username"]').type('ADMIN');
    cy.get('input[name="password"]').type('APAEADMINIFPB2023-1');
    cy.get('button[type="submit"]').click();
    
    // 2. Navega para a página do calendário
    cy.wait(2000);
    cy.visit('http://localhost:3001/pages/datas-comemorativas'); 
    cy.wait(1000);
  });

  it('Deve realizar o ciclo completo: Criar, Editar e Excluir um evento', () => {
    const dataTeste = '2026-01-30';
    const tituloOriginal = 'Feriado Teste Cypress';
    const tituloEditado = 'Feriado Editado Cypress';
    const descricao = 'Descrição criada via teste automatizado.';

    // =================================================
    // PARTE 1: CRIAR O EVENTO
    // =================================================
    
    // Tenta clicar em um dia vazio no calendário para abrir o modal.
    cy.get('.fc-daygrid-day').eq(15).click();
    cy.wait(1000);

    // Preenche o formulário
    cy.get('#title').type(tituloOriginal);
    cy.get('#date').type(dataTeste);
    cy.get('#description').type(descricao);

    // Salva
    cy.get('button[type="submit"]').contains('Salvar').click();

    // Valida Sucesso
    cy.get('body').should('contain', 'criado com sucesso');
    cy.wait(1000);

    // Verifica se o evento apareceu na tela
    cy.contains(tituloOriginal).should('be.visible');
    cy.wait(3000);


    // =================================================
    // PARTE 2: EDITAR O EVENTO
    // =================================================
    
    // Clica no evento que acabamos de criar
    cy.contains(tituloOriginal).click();
    cy.wait(1000);

    // Altera o título
    cy.get('#title').clear().type(tituloEditado);
    
    // Salva a edição
    cy.get('button[type="submit"]').contains('Salvar').click();

    // Valida Sucesso da Edição
    cy.get('body').should('contain', 'atualizado com sucesso');
    cy.wait(1000);

    // Verifica se o título mudou no calendário
    cy.contains(tituloOriginal).should('not.exist');
    cy.contains(tituloEditado).should('be.visible');
    cy.wait(3000);


    // =================================================
    // PARTE 3: EXCLUIR O EVENTO
    // =================================================

    // Clica no evento editado
    cy.contains(tituloEditado).click();
    cy.wait(1000);

    // 1. Clica no botão "Excluir"
    cy.contains('button', 'Excluir').click();

    // 2. Verifica se apareceu a caixa de confirmação
    cy.contains('Tem certeza que deseja excluir?').should('be.visible');

    // 3. Clica em "Sim, excluir" (Confirmar Exclusão)
    cy.contains('button', 'Sim, excluir').click();

    // Valida Sucesso da Exclusão
    cy.get('body').should('contain', 'Evento excluído com sucesso');
    
    // Verifica se o evento sumiu do calendário
    cy.contains(tituloEditado).should('not.exist');

    cy.wait(3000);
  });

});