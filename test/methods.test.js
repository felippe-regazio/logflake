describe('Test methods and method chain', () => {
  it('Basic log() usage', () => {
    const log = logger();

    log('Hello world');
    expect(global.console.log).toHaveBeenCalledWith('Hello world');
  });
});