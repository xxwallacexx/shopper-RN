module.exports = function(api) {
  api.cache(true);
  const plugins = [
    [
      "module:react-native-dotenv",
      {
        envName: "APP_ENV",
        moduleName: "@env",
        path: ".env"
      }
    ],
    [
      'module-resolver',
      {
        root: ["./"],
        alias: {
          "~": './',
        },
      },
    ],
    [
      '@tamagui/babel-plugin',
      {
        components: ['tamagui'],
        config: './tamagui.config.ts',
      },
    ]
  ];


  return {
    presets: ['babel-preset-expo'],

    plugins,
  };
};
