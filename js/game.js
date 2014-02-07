window.addEventListener('load', function() {

	Physics(function(world){
    
    var viewWidth = window.innerWidth;
    var viewHeight = window.innerHeight;
    var el = document.getElementsByClassName('character'); 

    var characterWidth = el[0].width;
    var characterHeight = el[0].height;

    var renderer = Physics.renderer('canvas', {
        el: 'page',
        width: viewWidth,
        height: viewHeight,
        meta: false // don't display meta data
       
    });
    
    // add the renderer
    world.add( renderer );

    
    // bounds of the window
    var viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight);
    
    // constrain objects to these bounds
    world.add(Physics.behavior('edge-collision-detection', {
        aabb: viewportBounds,
        restitution: 0.5,
        cof: 0.99
    }));

	for(var i=0;i<el.length;i++) {
		var myEL = Physics.body('convex-polygon', {
	        x: (el[i].offsetLeft + el[i].width) / 2,
	        y: (el[i].offsetTop + el[i].height) / 2,
	        vx: Math.random(1),
	        restitution: Math.random(1),
	        mass: Math.random(1),
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

    
    // ensure objects bounce when edge collision is detected
    world.add( Physics.behavior('body-collision-detection') );
    world.add( Physics.behavior('sweep-prune') );
    world.add( Physics.behavior('body-impulse-response') );    
    // add some gravity
    var gravity = Physics.behavior('constant-acceleration');
    world.add( gravity );    
	// subscribe to ticker to advance the simulation
	Physics.util.ticker.subscribe(function( time, dt ){
	    world.step( time );
	});


	// start the ticker
	Physics.util.ticker.start();
	world.subscribe('step', function(){
	    world.render();
	});

});

});