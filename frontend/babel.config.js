module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            'react-native-maps': './src/mocks/react-native-maps.js',
            'react-native-svg/lib/commonjs/elements/Svg': './src/mocks/svg.js',
            'react-native-svg/lib/commonjs/elements/Circle': './src/mocks/circle.js',
            'react-native-svg/lib/commonjs/elements/Defs': './src/mocks/defs.js',
            'react-native-svg/lib/commonjs/elements/LinearGradient': './src/mocks/lineargradient.js',
            'react-native-svg/lib/commonjs/elements/Path': './src/mocks/path.js',
            'react-native-svg/lib/commonjs/elements/Stop': './src/mocks/stop.js'
          }
        }
      ]
    ]
  };
};
