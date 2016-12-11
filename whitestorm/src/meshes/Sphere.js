import * as THREE from 'three';
import {SphereMesh, SoftMesh} from '../physics/index.js';

import {Shape} from '../core/Shape';
import {extend, loadMaterial} from '../extras/api';

class Sphere extends Shape {
  constructor(params = {}) {
    super(params, 'sphere');

    extend(params.geometry, {
      radius: 1,
      widthSegments: 8,
      heightSegments: 6
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
    else if (this.physics) Mesh = SphereMesh;
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
    const GConstruct = params.buffer && !params.softbody ? THREE.SphereBufferGeometry : THREE.SphereGeometry;

    const geometry = new GConstruct(
      params.geometry.radius,
      params.geometry.widthSegments,
      params.geometry.heightSegments
    );

    if (params.softbody) this.proccessSoftbodyGeometry(geometry);

    return geometry;
  }

  set G_radius(val) {
    this._native.geometry = this.buildGeometry(this.updateParams({geometry: {radius: val}}));
  }

  get G_radius() {
    return this._native.geometry.parameters.radius;
  }

  set G_widthSegments(val) {
    this._native.geometry = this.buildGeometry(this.updateParams({geometry: {widthSegments: val}}));
  }

  get G_widthSegments() {
    return this._native.geometry.parameters.widthSegments;
  }

  set G_heightSegments(val) {
    this._native.geometry = this.buildGeometry(this.updateParams({geometry: {widthSegments: val}}));
  }

  get G_heightSegments() {
    return this._native.geometry.parameters.widthSegments;
  }

  clone() {
    return this.getParams().softbody ? new Sphere(this.getParams()) : new Sphere({build: false}).copy(this);
  }
}

export {
  Sphere
};
