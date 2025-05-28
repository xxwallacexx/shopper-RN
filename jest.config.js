module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|tamagui|@tamagui)/)',
  ],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/$1',
  },
}; 