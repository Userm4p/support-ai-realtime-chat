module.exports = {
  connect: jest.fn(() => ({
    on: jest.fn(),
    publish: jest.fn(),
    subscribe: jest.fn(),
    end: jest.fn(),
  })),
};
