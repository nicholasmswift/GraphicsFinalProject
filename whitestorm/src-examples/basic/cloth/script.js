const GAME = new WHS.World({
  stats: 'fps', // fps, ms, mb
  autoresize: "window",
  softbody: true,

  gravity: {
    x: 0,
    y: -9.8,
    z: 0
  },

  camera: {
    far: 10000,
    y: 100,
    z: 300
  },

  shadowmap: {
    type: THREE.PCFSoftShadowMap
  },

  background: {
    color: 0xaaaaaa
  }
});

const cloth = new WHS.Plane({ // Softbody (blue).
  geometry: {
    width: 160,
    height: 60,
    wSegments: 20,
    hSegments: 15
  },

  mass: 10,
  softbody: true,

  material: {
    color: 0x0000ff,
    kind: 'phong',
    side: THREE.DoubleSide
  },

  physics: {
    margin: 2
  },

  pos: {
    y: 100
  },

  rot: {
    x: Math.PI / 4
  }
});

cloth.addTo(GAME);

new WHS.Box({ // Rigidbody (green).
  geometry: {
    width: 12,
    height: 12, 
    depth: 12
  },

  mass: 0,

  material: {
    color: 0x00ff00
  },

  pos: {
    y: 56
  }
}).addTo(GAME);

new WHS.Box({
  geometry: {
    width: 2500,
    height: 1,
    depth: 2500
  },

  mass: 0,

  material: {
    color: 0xff0000,
    kind: 'phong'
  },

  pos: {
    x: 0,
    y: -20,
    z: 0
  }
}).addTo(GAME);

new WHS.DirectionalLight({
  light: {
    color: 0xffffff, // 0x00ff00,
    intensity: 1
  },

  pos: {
    x: 0,
    y: 10,
    z: 30
  },

  target: {
    x: 0,
    y: 0,
    z: 0
  }
}).addTo(GAME);

new WHS.AmbientLight({
  light: {
    color: 0xffffff,
    intensity: 0.5
  }
}).addTo(GAME);

GAME.setControls(WHS.orbitControls());
GAME.start();
