describe('Testing committees', () => {
    const ACTION_URL = 'system/action/handle_request';
    const PRESENTER_URL = 'system/presenter/handle_request';

    let committee: { id: number; name: string };

    it(`is okay...`, () => {});

    // before(() => {
    //     cy.login();
    //     cy.visit('/');
    //     cy.createCommittee().then(_committee => {
    //         committee = _committee;
    //     });
    // });

    // beforeEach(() => {
    //     cy.login();
    //     cy.visit('/');
    //     cy.getAnchorFor('/committees').click();
    //     cy.url().should('include', 'committees');
    // });

    // it('visit committees', () => {
    //     cy.visit(`/`);
    //     cy.getAnchorFor('/committees').click();
    //     cy.url().should('include', 'committees');
    // });

    // it('visits one committee', () => {
    //     cy.getAnchorFor(`/committees/${committee.id}`).click();
    //     cy.url().should('include', committee.id);
    //     cy.contains(committee.name);
    //     cy.getElement('headbarBackButton').click();
    //     cy.url().should('include', 'committees');
    //     cy.url().should('not.include', 'committees/');
    // });

    // it('creates a committee', () => {
    //     cy.intercept({ method: 'POST', url: ACTION_URL }).as('action');
    //     cy.getElement('headbarMainButton').click();
    //     cy.url().should('include', 'create');
    //     const committeeName = `Cypress Committee ${Date.now().toString()}`;
    //     cy.getElement('committeeName').type(committeeName);

    //     cy.getElement('headbarSaveButton').click();
    //     cy.wait('@action');

    //     cy.url().should('not.include', 'create');
    //     cy.contains(committeeName);
    // });

    // it('updates a committee', () => {
    //     cy.intercept({ method: 'POST', url: ACTION_URL }).as('handle_request');
    //     cy.getElement(`committeeListSingleMenuTrigger`).first().click();
    //     cy.getAnchorFor(`/committees/edit-committee?committeeId=${committee.id}`).click();
    //     cy.url().should('include', 'edit-committee');
    //     const committeeDescription = 'Hahaha';
    //     cy.getElement('committeeDescription').type(committeeDescription);
    //     cy.getElement('headbarSaveButton').click();
    //     cy.wait('@handle_request');
    //     cy.url().should('not.include', 'edit-committee');
    //     cy.contains(committeeDescription);
    // });

    // it('deletes a committee', () => {
    //     cy.getElement('committeeListSingleMenuTrigger').first().click();
    //     cy.getElement('committeeListSingleDeleteButton').click();
    //     cy.get('os-choice-dialog button').first().click();
    //     cy.get(committee.name).should('not.exist');
    // });
});
