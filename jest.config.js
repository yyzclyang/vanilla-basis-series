/**
 * jest configuring
 * https://jestjs.io/docs/en/configuration
 */

module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/(*.test.)+(ts|js)'],
  setupFilesAfterEnv: ['jest-extended']
};
