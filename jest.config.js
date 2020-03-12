/**
 * jest configuring
 * https://jestjs.io/docs/en/configuration
 */

module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/test/(*.test.)+(ts|js)'],
  setupFilesAfterEnv: ['jest-extended']
};
