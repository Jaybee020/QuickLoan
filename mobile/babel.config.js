module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    '@babel/plugin-transform-flow-strip-types',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-private-methods',
    // ['@babel/plugin-transform-private-methods', {loose: true}],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
      },
    ],
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@lib': './src/lib',
          '@utils': './src/utils',
          '@hooks': './src/hooks',
          '@assets': './src/assets',
          '@typings': './src/types',
          '@screens': './src/screens',
          '@context': './src/context',
          '@helpers': './src/helpers',
          '@constants': './src/constants',
          '@components': './src/components',
        },
      },
    ],
  ],
};
