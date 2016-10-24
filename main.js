require.config({
    paths: {
        //libs
        'requirejs': 'node_modules/requirejs/require',
        'p5': 'node_modules/p5/lib/p5',

        //modules
        'app': 'app/app',
        'gorilla': 'app/gorilla',
        'vector2': 'app/vector2',
        
        //plugins
        'p5.sound': 'node_modules/p5/lib/addons/p5.sound'
    }
});

// Start the main app logic.
require(['app']);