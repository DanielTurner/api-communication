import { html, fixture, expect } from '@open-wc/testing';

import '../api-communication.js';

describe('ApiCommunication', () => {
  it('has a default title "Hey there" and counter 5', async () => {
    const el = await fixture(html`
      <api-communication></api-communication>
    `);

    expect(el.title).to.equal('Hey there');
    expect(el.counter).to.equal(5);
  });

  it('replace soon', async () => {
    const el = await fixture(html`
      <api-communication></api-communication>
    `);

    expect(el).shadowDom.to.equal(`
      <h2>Hey there Nr. 5!</h2>
      <button>increment</button>
    `);
  });

  it('increases the counter on button click', async () => {
    const el = await fixture(html`
      <api-communication></api-communication>
    `);
    el.shadowRoot.querySelector('button').click();

    expect(el.counter).to.equal(6);
  });

  it('can override the title via attribute', async () => {
    const el = await fixture(html`
      <api-communication title="attribute title"></api-communication>
    `);

    expect(el.title).to.equal('attribute title');
  });
});
