import { Joost.ClientPage } from './app.po';

describe('joost.client App', () => {
  let page: Joost.ClientPage;

  beforeEach(() => {
    page = new Joost.ClientPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
