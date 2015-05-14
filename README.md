# css-transform-to-mat4

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

Will take a string which is a css transform value (2d or 3d) and return a mat4 or 3d transformation matrix from the string.

## Usage

[![NPM](https://nodei.co/npm/css-transform-to-mat4.png)](https://www.npmjs.com/package/css-transform-to-mat4)

### Example:
```javascript
var getMatrix = require('css-transform-to-mat4');

var matrix3DB = getMatrix('translate(40px, 20px)'); // works with 2d transforms
var matrix3DB = getMatrix('perspective(1000px) translate3d(40px, 20px, -1000px)'); // and 3d
```

## License

MIT, see [LICENSE.md](http://github.com/Jam3/css-transform-to-mat4/blob/master/LICENSE.md) for details.
