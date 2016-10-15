require.config({
  baseUrl: '/app',
  paths: {
    p5: '../node_modules/p5/lib/p5',
    p5sound: '../node_modules/p5/lib/addons/p5.sound',
    gorilla: ''
  },
  shim: {
    'p5': {
      exports: 'p5'
    },
    'p5sound:': {
      exports: 'p5sound'
    }
  }
});

require(['gorilla']);
