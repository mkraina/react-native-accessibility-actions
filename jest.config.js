module.exports = {
  preset: 'react-native',
  testMatch: ['<rootDir>/**/*.test.(t|j)s?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/'],
  clearMocks: true,
  cacheDirectory: '.jest/cache',
  transformIgnorePatterns: [
    'node_modules/(?!@react-native|react-native|any-react-native-esm-package)',
  ],
};
