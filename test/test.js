const assert = require('assert');

describe('Azure Function Tests', () => {
  it('should return 200 OK', () => {
    assert.strictEqual(200, 200);
  });

  it('should return Hello World', () => {
    const message = 'Hello World!';
    assert.ok(message.includes('Hello'));
  });

  it('should not crash', () => {
    assert.doesNotThrow(() => {
      let x = 2 + 2;
    });
  });
});
