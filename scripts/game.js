require.config({
    baseUrl: './',
    // ...
    packages: [
    {
      name: 'physicsjs',
      location: 'scripts/vendor/physics',
      main: 'physicsjs-0.5.4.min'
  }
  ],
    //...
});


define('game',
    ['physicsjs', 
    'physicsjs/bodies/convex-polygon',
    'physicsjs/renderers/canvas',
    'physicsjs/behaviors/edge-collision-detection',
    'physicsjs/behaviors/body-collision-detection',
    'physicsjs/behaviors/body-impulse-response',
    'physicsjs/behaviors/constant-acceleration',
    'physicsjs/behaviors/sweep-prune',

    ], function(Physics) {

        var world = Physics();
        
        var viewWidth = window.innerWidth;
        var viewHeight = window.innerHeight;

        function renderCanvas() {
            var renderer = Physics.renderer('canvas', {
                el: 'canvas-page',
                width: viewWidth,
                height: viewHeight,
                meta: false // don't display meta data

            });
            world.add( renderer );
        }

        function addEdgeCollision() {
            // bounds of the window
            var viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight);
            
            // constrain objects to these bounds
            world.add(Physics.behavior('edge-collision-detection', {
                aabb: viewportBounds,
                restitution: 0.5,
                cof: 0.99
            }));    
        }

        function makeAllElementsBodies() {
            var el = document.getElementsByClassName('character'); 

            var characterWidth, characterHeight, myEL, i;
            for(i=0;i<el.length;i++) {
                characterWidth = el[i].width;
                characterHeight = el[i].height;
                myEL = Physics.body('convex-polygon', {
                    x: (el[i].offsetLeft + characterWidth) / 2,
                    y: (el[i].offsetTop + characterHeight) / 2,
                    vx: Math.random(1) * (-1^i),
                    restitution: Math.random(1),
                    mass: Math.random(10),
                    vertices: [
                    {x: 0, y: 0},
                    {x: 0, y: characterHeight},
                    {x: characterWidth, y: characterHeight},
                    {x: characterWidth, y: 0}
                    ],
                    angle: Math.random(1) * 365

                });
                myEL.view = el[i];
                world.add( myEL );

            }       
        }

        function addBehaviours() {
           //ensure objects bounce when edge collision is detected
           addEdgeCollision();
           world.add( Physics.behavior('body-collision-detection') );
           world.add( Physics.behavior('sweep-prune') );
           world.add( Physics.behavior('body-impulse-response') );    
            // add some gravity
            var gravity = Physics.behavior('constant-acceleration');
            world.add( gravity );     
        }

        function startPhysics() {
          // subscribe to ticker to advance the simulation
          Physics.util.ticker.subscribe(function( time, dt ){
            world.step( time );
        });


            // start the ticker
            Physics.util.ticker.start();
            world.subscribe('step', function(){
                world.render();
            });  
        }

        function init() {
            renderCanvas();
            makeAllElementsBodies();
            addBehaviours();
            startPhysics();
        }

    return {
        init: init
    };

});

