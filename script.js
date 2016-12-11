//import EVENTS from './events';
"use strict";



const APP = {
	bgColor: 0xcccccc, //grey
	//bgColor: 0xffffff, //grey

	basketY: 40,
	ballRadius: 6,
	basketColor: 0xff0000,

	getBasketRadius: () => APP.ballRadius + 2,
	basketTubeRadius: 0.5,

	basketDistance: 80,

	getBasketZ: () => APP.getBasketRadius() + APP.basketTubeRadius * 2 - APP.basketDistance+5,

	//goal
	basketGoalDiff: 2.5,
	basketYGoalDiff: () => 1,
	basketYDeep: () => 1,
	goalDuration: 1800, //ms

	doubleTapTime: 300,

	//other variables
	thrown: false,
	doubletap: false,
	goal: false,
	controlsEnabled: true,

	cursor: {
		x: 0, // Mouse X.
	    y: 0, // Mouse Y.
	    xCenter: window.innerWidth / 2, // Window center X.
	    yCenter: window.innerHeight / 2 // Window center Y.
	},

	force: {
		y: 7, // Kick ball Y force.
    	z: -2, // Kick ball Z force.
	    m: 2400, // Multiplier for kick force.
	    xk: 8 // Kick ball X force multiplier.
	},

	init() {
		APP.world = new WHS.World({

		    autoresize: "window",
		    softbody: true,

		    background: {
		    	color: APP.bgColor //grey
		    }, 

		    //fog: {
		    //	type: 'regular',
		    //	hex: 0xffffff
		    //},

		    gravity: { 
		    	y: -200 
		    },  // Physic gravity.

		    camera: {
		      //position: {
		        //x: 0,
		        z: 80, // Move camera.
		        y: 10, //APP.basketY/4,
		        aspect: 45
		      //}
		    }
		});

		APP.camera = APP.world.getCamera();
		APP.camera.lookAt(new THREE.Vector3(0, APP.basketY/2, -10));

		APP.createScene();
		APP.addLights();
		APP.addBasket();
		APP.addBall();
		APP.initEvents(); // 5

	    // Start the loop.
	    APP.keep_ball = keep_ball(APP);
	    APP.world.addLoop(APP.keep_ball);
	    APP.keep_ball.start();


		APP.world.start();
	},

	initEvents() {
	    EVENTS._move(APP);
	    EVENTS._click(APP);
	    EVENTS._keypress(APP);
	    EVENTS._resize(APP);

	},

  	updateCoords(e) {
	    e.preventDefault();

	    APP.cursor.x = e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX;
	    APP.cursor.y = e.touches && e.touches[0] ? e.touches[0].clientY : e.clientY;
	},

  	checkKeys(e) {
    	e.preventDefault();
    	if (e.code === "Space") APP.thrown = false;
  	},

  	detectDoubleTap() {
	    if (!APP.doubletap) { // Wait for second click.
	      	APP.doubletap = true;

	      	setTimeout(() => {
	      	  	APP.doubletap = false;
	      	}, APP.doubleTapTime);

	      	return false;
	    } else { // Double tap triggered.
	    	APP.thrown = false;
	      	APP.doubletap = true;

	      	return true;
	    }
	},

	createScene() {
		APP.ground = new WHS.Plane({
			geometry: {
				buffer: true,
				width: 1000,
				height:800
			},

			mass: 0,

			material: {
				kind: 'phong',
				color: APP.bgColor,
				map: WHS.texture('textures/floor.png', {repeat: {y: 4, x: 10}}), //offset: {y: 0.3}}),

			},

			pos: {
				y:-20,
				z:120,
			},

			rot: {
				x: -Math.PI/2
			}
		});

		APP.wall = new WHS.Plane({
			geometry: {
				buffer: true,
				width: 1000,
				height:800
			},

			mass: 0,

			material: {
				kind: 'phong',
				color: APP.bgColor,
				map: WHS.texture('textures/background.jpg'), //{repeat: {y: 4, x: 10}}), //offset: {y: 0.3}}),

			},

			pos: {
				y:-20,
				z:120,
			},

			rot: {
				x: -Math.PI/2
			}
		});

		//APP.wall = APP.ground.clone();
				//map: WHS.texture('textures/floor.png', {repeat: {y: 4, x: 10}}), //offset: {y: 0.3}}),

		//APP.ground.__params.material.map = WHS.texture('textures/floor.png', {repeat: {y: 4, x: 10}});
		APP.ground.addTo(APP.world);

		//wall object
		console.log(APP.wall);
		//APP.ground.__params.material.map = 0;

		APP.wall.position.y = 180;
    	APP.wall.position.z = -APP.basketDistance;
    	APP.wall.rotation.x = 0;
    	APP.wall.addTo(APP.world);

	},

	addLights() {
		new WHS.PointLight({
			light: {
				distance: 100,
				intensity: 1,
				angle: Math.PI
			},

			shadowmap: {
		        width: 1024,
		        height: 1024,

		        left: -50,
		        right: 50,
		        top: 50,
		        bottom: -50,

		        far: 80,

		        fov: 90,
	      	},

	      	pos: {
	        	y: 60,
	        	z: -40
	      	},
	    }).addTo(APP.world);

		new WHS.AmbientLight({
	      	light: {
	        	intensity: 0.3
	      	}
	    }).addTo(APP.world);
	},

	addBasket() {
		APP.basket = new WHS.Torus({
			geometry: {
				buffer: true,
				radius: APP.getBasketRadius(),
				tube: APP.basketTubeRadius,
				radialSegments: 16,
				tubularSegments: 16
			},

			mass: 0,

			shadow: {
				cast: false
			},

			material: {
				kind: 'standard',
				color: APP.basketColor,
				metalness: 0.8,
				roughness: 0.5,
				emissive: 0xffccff,
				emissiveIntensity: 0.2
			},

			pos: {
				y: APP.basketY,
				z: APP.getBasketZ()
			},

			physics: { type: 'concave' },

			rot: {
				x: Math.PI/2
			}
		});

		APP.basket.addTo(APP.world);

		APP.backboard = new WHS.Box({
			geometry: {
				buffer: true,
				width: 41,
				depth: 1,
				height: 28
			},

			mass: 0,

			material: {
				kind: 'standard',
				map: WHS.texture('textures/backboard.jpg'),
				normalScale: new THREE.Vector2(.3, .3),
				metalness: 0,
				roughness:0.3
			},

			pos: {
				y:APP.basketY + 10,
				z: APP.getBasketZ() - APP.getBasketRadius()
			}
		});

		APP.backboard.addTo(APP.world);

		APP.post = new WHS.Cylinder({
			geometry: {
				buffer: true,
				radiusTop: 1.5,
				radiusBottom: 1.5,
				depth: 2,
				height: APP.basketY + 35
			},

			mass: 0,

			material: {
				kind: 'standard',
				color: 0xcccccc,
				//map: WHS.texture('textures/backboard.jpg'),
				normalScale: new THREE.Vector2(.3, .3),
				metalness: 0,
				roughness:0.3
			},

			pos: {
				y: 0, //APP.basketY, // + 10,
				z: APP.getBasketZ() - APP.getBasketRadius() -2
			}
		});

		APP.post.addTo(APP.world);

		APP.net = new WHS.Cylinder({
			geometry: {
				radiusTop: APP.getBasketRadius(),
				radiusBottom: APP.getBasketRadius() - 3,
		        height: 15,
		        openEnded: true,
		        heightSegments: APP.isMobile ? 2 : 3,
		        radiusSegments: APP.isMobile ? 8 : 16
		    },

      		shadow: {
        		cast: false
      		},

			physics: {
		        pressure: 2000,
		        friction: 0.02,
		        margin: 0.5,
		        anchorHardness: 0.5,
		        viterations: 2,
		        piterations: 2,
		        diterations: 4,
		        citerations: 0
		    },

		    mass: 30,
		    softbody: true,

		    material: {
		        map: WHS.texture('textures/net4.png', {repeat: {y: 2, x: 3}, offset: {y: 0.3}}), // 0.85, 19
		        transparent: true,
		        opacity: 0.7,
		        kind: 'basic',
		        side: THREE.DoubleSide,
		        depthWrite: false
		    },

		    pos: {
		        y: APP.basketY - 8,
		        z: APP.getBasketZ()
		    }

		});

		APP.net.addTo(APP.world);

		for (let i = 0; i < 16; i++) {
        	APP.net.appendAnchor(APP.world, APP.basket, i, 0.8, true);
      	}

	},

	addBall() {
		APP.ball = new WHS.Sphere({
			geometry: {
				buffer: true,
				radius: APP.ballRadius,
				widthSegments: 32,
				heightSegments: 32
			},

			mass: 120,

			material: {
				kind: 'phong',
				map: WHS.texture('textures/ball.png'),
				normalMap: WHS.texture('textures/ball_normal.png'),
				shininess: 20,
				reflectivity: 2,
				normalScale: new THREE.Vector2(.5,.5)
			},

			physics: {
				restitution: 3
			}
		});

		APP.ball.addTo(APP.world);
	},

	throwBall(e) {
	    e.preventDefault();

	    if (!APP.detectDoubleTap() && APP.controlsEnabled && !APP.thrown) {
	      	const vector = new THREE.Vector3(
	        	APP.force.xk * (APP.cursor.x - APP.cursor.xCenter), 
	        	APP.force.y * APP.force.m,
	        	APP.force.z * APP.force.m
	      	);

	      	APP.ball.setLinearVelocity(new THREE.Vector3(0, 0, 0)); // Reset gravity affect.

	      	APP.ball.applyCentralImpulse(vector);

	      	vector.multiplyScalar(10 / APP.force.m)
	      	vector.y = vector.x;
	      	vector.x = APP.force.y;
		    vector.z = 0;

		    APP.ball.setAngularVelocity(vector); // Reset gravity affect.
		    APP.thrown = true;
		    //APP.menu.attempts++;
	    }
	 },

	keepBall() {
	    const cursor = APP.cursor;

	    const x = (cursor.x - cursor.xCenter) / window.innerWidth * 32;
	    const y = - (cursor.y - cursor.yCenter) / window.innerHeight * 32;

	    APP.ball.position.set(x, y, -36);
	}
	  

};

const EVENTS = {
	_click(APP) {
    window.addEventListener('click', APP.throwBall);
    window.addEventListener('click', () => {
      const el = APP.world.getRenderer().domElement;
      
      if (!el.fullscreenElement && APP.isMobile) {
        if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
        if (el.mozRequestFullscreen) el.mozRequestFullscreen();
        if (el.msRequestFullscreen) el.msRequestFullscreen();
        if (el.requestFullscreen) el.requestFullscreen();
      }
    });
  },

  _move(APP) {
    ['mousemove', 'touchmove'].forEach((e) => {
      window.addEventListener(e, APP.updateCoords);
    });
  },

  _keypress(APP) {
    window.addEventListener('keypress', APP.checkKeys);
  },

  _resize(APP) {
    APP.cursor.xCenter = window.innerWidth / 2;
    APP.cursor.yCenter = window.innerHeight / 2;

    window.addEventListener('resize', () => {
      const style = document.querySelector('.whs canvas').style;

      style.width = '100%';
      style.height = '100%';
    });
  }

}

const keep_ball = (APP) => {
  return new WHS.Loop(() => {
    if (!APP.thrown) APP.keepBall();

    const BLpos = APP.ball.position;
    const BSpos = APP.basket.position

    if (BLpos.distanceTo(BSpos) < APP.basketGoalDiff
      && Math.abs(BLpos.y - BSpos.y + APP.basketYDeep()) < APP.basketYGoalDiff() 
      && !APP.goal) APP.onGoal(BLpos, BSpos);
  });
}


APP.init();


 // Start animations and physics simulation.


