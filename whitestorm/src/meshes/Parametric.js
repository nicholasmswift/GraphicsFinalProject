import * as THREE from 'three';
import {ConvexMesh, ConcaveMesh, SoftMesh} from '../physics/index.js';

import {Shape} from '../core/Shape';
import {extend, loadMaterial} from '../extras/api';

class Parametric extends Shape {
  constructor(params = {}) {
    super(params, 'parametric');

    extend(params.geometry, {
      func() {},
      slices: 10,
      stacks: 10
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
    const GConstruct = params.buffer && !params.softbody ? THREE.ParametricBufferGeometry : THREE.ParametricGeometry;

    return new GConstruct(
      params.geometry.func,
      params.geometry.slices,
      params.geometry.stacks
    );
  }

  set G_func(val) {
    this._native.geometry = this.buildGeometry(this.updateParams({geometry: {func: val}}));
  }

  get G_func() {
    return this._native.geometry.parameters.func;
  }

  set G_slices(val) {
    this._native.geometry = this.buildGeometry(this.updateParams({geometry: {slices: val}}));
  }

  get G_slices() {
    return this._native.geometry.parameters.slices;
  }

  set G_stacks(val) {
    this._native.geometry = this.buildGeometry(this.updateParams({geometry: {stacks: val}}));
  }

  get G_stacks() {
    return this._native.geometry.parameters.stacks;
  }

  clone() {
    return new Parametric({build: false}).copy(this);
  }
}

export {
  Parametric
};
