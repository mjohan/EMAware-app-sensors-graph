import { SensorsGraphAngular2Page } from './app.po';

describe('sensors-graph-angular2 App', function() {
  let page: SensorsGraphAngular2Page;

  beforeEach(() => {
    page = new SensorsGraphAngular2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
