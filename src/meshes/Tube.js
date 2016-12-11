import * as THREE from 'three';
import {ConvexMesh, ConcaveMesh, SoftMesh} from '../physics/index.js';

import {Shape} from '../core/Shape';
import {extend, loadMaterial} from '../extras/api';

class Tube extends Shape {
  constructor(params = {}) {
    super(params, 'tube');

    extend(params.geometry, {
      path: false,
      segments: 20,
      radius: 2,
      radiusSegments: 8,
      closed: false
    });

    if (params.build) {
      this.build(params);
      super.wrap();
    }
  }

  build(params = {}) {
    const material = loadMaterial(params.material);

    let Mesh;

    if (this.physics && this.getParams().softbody) Mesh = SoftMesh;
    else if (this.physics && this.physics.type === 'concave') Mesh = ConcaveMesh;
    else if (this.physics) Mesh = ConvexMesh;
    else Mesh = THREE.Mesh;

    return new Promise((resolve) => {
      this.setNative(new Mesh(
        this.buildGeometry(params),
        material,
        this.getParams()
      ));

      resolve();
    });
  }

  buildGeometry(params = {}) {
    const GConstruct = params.buffer && !params.softbody ? THREE.TubeBufferGeometry : THREE.TubeGeometry;

    const geometry = new GConstruct(
      params.geometry.path,
      params.geometry.segments,
      params.geometry.radius,
      params.geometry.radiusSegments,
      params.geometry.closed
    );

    if (params.softbody) this.proccessSoftbodyGeometry(geometry);

    return geometry;
  }

  set G_path(val) {
    this._native.geometry = this.buildGeometry(this.updateParams({geometry: {path: val}}));
  }

  get G_path() {
    return this._native.geometry.parameters.path;
  }

  set G_segments(val) {
    this._native.geometry = this.buildGeometry(this.updateParams({geometry: {segments: val}}));
  }

  get G_segments() {
    return this._native.geometry.parameters.segments;
  }

  set G_radius(val) {
    this._native.geometry = this.buildGeometry(this.updateParams({geometry: {radius: val}}));
  }

  get G_radius() {
    return this._native.geometry.parameters.radius;
  }

  set G_radiusSegments(val) {
    this._native.geometry = this.buildGeometry(this.updateParams({geometry: {radiusSegments: val}}));
  }

  get G_radiusSegments() {
    return this._native.geometry.parameters.radiusSegments;
  }

  set G_closed(val) {
    this._native.geometry = this.buildGeometry(this.updateParams({geometry: {closed: val}}));
  }

  get G_closed() {
    return this._native.geometry.parameters.closed;
  }

  clone() {
    return new Tube({build: false}).copy(this);
  }
}

export {
  Tube
};
