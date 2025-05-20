module.exports = function (api) {
  api.cache(false);
  const plugins = [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '~': './',
        },
      },
    ],
    [
      '@tamagui/babel-plugin',
      {
        components: ['tamagui'],
        config: './tamagui.config.ts',
      },
    ],
    [
      'module:react-native-dotenv',
      {
        envName: 'APP_ENV',
        moduleName: '@env',
        path: '.env',
      },
    ],
  ];

  return {
    presets: ['babel-preset-expo'],

    plugins,
  };
};
