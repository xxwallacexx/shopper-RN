const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Use process.cwd() as the project root
const projectRoot = process.cwd();

module.exports = (() => {
  const config = getDefaultConfig(projectRoot);

  const { transformer, resolver } = config;

  config.resetCache = true;
  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...resolver.sourceExts, 'svg'],
  };

  return config;
})();
