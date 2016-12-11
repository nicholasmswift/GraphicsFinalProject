'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Model = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _three = require('three');

var THREE = _interopRequireWildcard(_three);

var _index = require('../physics/index.js');

var _Shape2 = require('../core/Shape');

var _api = require('../extras/api');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Model = function (_Shape) {
  (0, _inherits3.default)(Model, _Shape);

  function Model() {
    var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    (0, _classCallCheck3.default)(this, Model);

    var _this = (0, _possibleConstructorReturn3.default)(this, Object.getPrototypeOf(Model).call(this, params, 'model'));

    (0, _api.extend)(params.geometry, {
      path: '',
      physics: '',
      loader: _api.JSONLoader
    });

    if (params.build) {
      _this.build(params);
      (0, _get3.default)(Object.getPrototypeOf(Model.prototype), 'wrap', _this).call(_this, 'wait');
    }
    return _this;
  }

  (0, _createClass3.default)(Model, [{
    key: 'build',
    value: function build() {
      var _this2 = this;

      var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var Mesh = void 0;

      if (this.physics && this.physics.type === 'concave') Mesh = _index.ConcaveMesh;else if (this.physics) Mesh = _index.ConvexMesh;else Mesh = THREE.Mesh;

      var promise = new Promise(function (resolve) {
        var pGeometry = params.geometry;
        var Loader = pGeometry.loader;

        Loader.load(pGeometry.path, function (data, materials) {
          if (pGeometry.physics) {
            Loader.load(pGeometry.physics, function (data2) {
              var material = void 0;

              if (params.material.useVertexColors) {
                material = (0, _api.loadMaterial)((0, _api.extend)(params.material, {
                  morphTargets: true,
                  vertexColors: THREE.FaceColors
                }));
              } else if (!materials || params.material.useCustomMaterial) {
                material = (0, _api.loadMaterial)(params.material);
              } else material = new THREE.MultiMaterial(materials);

              data.computeFaceNormals();
              data.computeVertexNormals();

              _this2.setNative(new Mesh(data, material, _this2.getParams(), data2));

              resolve();
            });
          } else {
            var material = void 0;

            if (params.material.useVertexColors) {
              material = (0, _api.loadMaterial)((0, _api.extend)(params.material, {
                morphTargets: true,
                vertexColors: THREE.FaceColors
              }));
            } else if (!materials || params.material.useCustomMaterial) {
              material = (0, _api.loadMaterial)(params.material);
            } else material = new THREE.MultiMaterial(materials);

            data.computeFaceNormals();
            data.computeVertexNormals();

            console.log(_this2.getParams());

            _this2.setNative(new Mesh(data, material, _this2.getParams()));

            resolve();
          }
        });
      });

      (0, _get3.default)(Object.getPrototypeOf(Model.prototype), 'wait', this).call(this, promise);

      return promise;
    }
  }, {
    key: 'clone',
    value: function clone() {
      return new Model({ build: false }).copy(this);
    }
  }]);
  return Model;
}(_Shape2.Shape);

exports.Model = Model;
//# sourceMappingURL=Model.js.map
