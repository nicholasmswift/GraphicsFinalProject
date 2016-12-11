'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Lathe = undefined;

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

var Lathe = function (_Shape) {
  (0, _inherits3.default)(Lathe, _Shape);

  function Lathe() {
    var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    (0, _classCallCheck3.default)(this, Lathe);

    var _this = (0, _possibleConstructorReturn3.default)(this, Object.getPrototypeOf(Lathe).call(this, params, 'lathe'));

    (0, _api.extend)(params.geometry, {
      points: []
    });

    if (params.build) {
      _this.build(params);
      (0, _get3.default)(Object.getPrototypeOf(Lathe.prototype), 'wrap', _this).call(_this);
    }
    return _this;
  }

  (0, _createClass3.default)(Lathe, [{
    key: 'build',
    value: function build() {
      var _this2 = this;

      var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var material = (0, _api.loadMaterial)(params.material);

      var Mesh = void 0;

      if (this.physics && this.getParams().softbody) Mesh = _index.SoftMesh;else if (this.physics && this.physics.type === 'concave') Mesh = _index.ConcaveMesh;else if (this.physics) Mesh = _index.ConvexMesh;else Mesh = THREE.Mesh;

      return new Promise(function (resolve) {
        _this2.setNative(new Mesh(_this2.buildGeometry(params), material, _this2.getParams()));

        resolve();
      });
    }
  }, {
    key: 'buildGeometry',
    value: function buildGeometry() {
      var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var GConstruct = params.buffer && !params.softbody ? THREE.LatheBufferGeometry : THREE.LatheGeometry;

      return new GConstruct(params.geometry.points);
    }
  }, {
    key: 'clone',
    value: function clone() {
      return new Lathe({ build: false }).copy(this);
    }
  }, {
    key: 'G_points',
    set: function set(val) {
      this._native.geometry = this.buildGeometry(this.updateParams({ geometry: { points: val } }));
    },
    get: function get() {
      return this._native.geometry.parameters.points;
    }
  }]);
  return Lathe;
}(_Shape2.Shape);

exports.Lathe = Lathe;
//# sourceMappingURL=Lathe.js.map
