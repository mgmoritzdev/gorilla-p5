require.config({

  baseUrl: 'app',
  paths: {
    //libs
    'requirejs': '../node_modules/requirejs/require',
    'p5': ['https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.4/p5.min', '../node_modules/p5/lib/p5'],

    //modules
    'app': 'app',
    'gorilla': 'gorilla',
    'vector2': 'vector2',
    'geometry': 'geometry',
    'banana': 'banana',
    'physics': 'physics',
    'collider': 'collider',

    //plugins
    'p5.sound': ['https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.4/addons/p5.sound.min', '../node_modules/p5/lib/addons/p5.sound']
  }
});

// Start the main app logic.
require(['app']);
