import { AppController } from './app.controller';

describe('AppController', () => {
  it('health responde ok y la versión', () => {
    const controller = new AppController();
    expect(controller.health()).toEqual({ status: 'ok', version: 'dev' });
  });
});
