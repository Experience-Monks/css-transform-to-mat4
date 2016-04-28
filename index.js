var mat4RotateX = require('gl-mat4').rotateX;
var mat4RotateY = require('gl-mat4').rotateY;
var mat4RotateZ = require('gl-mat4').rotateZ;
var mat4Rotate = require('gl-mat4').rotate;
var mat4Scale = require('gl-mat4').scale;
var mat4Translate = require('gl-mat4').translate;
var mat4Multiply = require('gl-mat4').multiply;

// Spec was used for reference http://www.w3.org/TR/2009/WD-css3-3d-transforms-20090320/
module.exports = function cssTransformToMatrix(value) {

  var functions = value.match(/[A-z3]+\([^\)]+/g) || [];
  var outMatrix = createMatrix();
  var matrices = [];

  functions.forEach( function(func) {

    var split = func.split('('); 
    var name = split[ 0 ]
    var value = split[ 1 ];
    var matrix;

    switch(name) {

      /////// 2D FUNCTIONS ///////
      case 'matrix':
        // matrix(
        //   a,b,c,
        //   d,e,f
        // ) is equivalent to 

        // matrix3d(
        //   a, b, 0, 0, 
        //   c, d, 0, 0, 
        //   0, 0, 1, 0, 
        //   e, f, 0, 1)


        value = value.split(',').map(Number.parseFloat);
        matrix = [
          value[ 0 ], value[ 1 ], 0, 0,
          value[ 2 ], value[ 3 ], 0, 0,
          0,          0,          1, 0,
          value[ 4 ], value[ 5 ], 0, 1
        ];
      break;

      case 'matrix3d':
        matrix = value.split(',').map(Number.parseFloat);
      break;

      case 'translate':
      case 'translate3d':
        matrix = createMatrix();
        value = value.split(',').map(Number.parseFloat);

        if(value.length === 2) {
          value.push(0);
        }

        mat4Translate(matrix, matrix, value);
      break;

      case 'translateX':
        matrix = createMatrix();
        value = [ Number.parseFloat(value), 0, 0 ];
        mat4Translate(matrix, matrix, value);
      break;

      case 'translateY':
        matrix = createMatrix();
        value = [ 0, Number.parseFloat(value), 0 ];
        mat4Translate(matrix, matrix, value);
      break;

      case 'translateZ':
        matrix = createMatrix();
        value = [ 0, 0, Number.parseFloat(value) ];
        mat4Translate(matrix, matrix, value);
      break;

      case 'rotate':
      case 'rotateZ':
        matrix = createMatrix();
        value = getRadian(value);
        mat4RotateZ(matrix, matrix, value);
      break;

      case 'scale':
      case 'scale3d':
        matrix = createMatrix();
        value = value.split(',').map(Number.parseFloat);

        if(value.length === 2) {
          value.push(1);  
        }
        
        mat4Scale(matrix, matrix, value);
      break;

      case 'scaleX':
        matrix = createMatrix();
        mat4Scale(matrix, matrix, [Number.parseFloat(value), 1, 1]);
      break;

      case 'scaleY':
        matrix = createMatrix();
        mat4Scale(matrix, matrix, [1, Number.parseFloat(value), 1]);
      break;

      case 'scaleZ':
        matrix = createMatrix();
        mat4Scale(matrix, matrix, [1, 1, Number.parseFloat(value)]);
      break;

      case 'rotateX':
        matrix = createMatrix();
        value = getRadian(value);
        mat4RotateX(matrix, matrix, value);
      break;

      case 'rotateY':
        matrix = createMatrix();
        value = getRadian(value);
        mat4RotateY(matrix, matrix, value);
      break;

      case 'rotate3d':
        matrix = createMatrix();
        value = value.split(',');
        mat4Rotate(matrix, matrix, getRadian(value[3]), value.slice(0, 3).map(Number.parseFloat));
      break;

      case 'perspective':
        // The matrix is computed by starting with an identity matrix and replacing the value at row 3, 
        // column 4 with the value -1/depth. The value for depth must be greater than zero, otherwise 
        // the function is invalid.
        value = Number.parseFloat(value);

        matrix = [
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, -1 / value,
          0, 0, 0, 1
        ];
      break;

      case 'skew':
        matrix = createMatrix();
        value = value.split(',').map(getRadian);
        matrix = [
          1,                    Math.tan(value[ 0 ]), 0, 0,
          Math.tan(value[ 1 ]), 1,                    0, 0,
          0,                    0,                    1, 0,
          0,                    0,                    0, 1
        ];
      break;

      case 'skewX':
        matrix = createMatrix();
        value = getRadian(value);
        matrix = [
          1,               0, 0, 0,
          Math.tan(value), 1, 0, 0,
          0,               0, 1, 0,
          0,               0, 0, 1
        ];
      break;

      case 'skewY':
        matrix = createMatrix();
        value = getRadian(value);
        matrix = [
          1, Math.tan(value), 0, 0,
          0, 1,               0, 0,
          0, 0,               1, 0,
          0, 0,               0, 1
        ];
      break;

      case 'none':
      case 'initial':
      break;

      default:
        throw new Error('unsupported transform function: ' + name);
      break;
    };

    if(matrix) {
      mat4Multiply(outMatrix, outMatrix, matrix);
    }
  });

  return outMatrix;
};

function getRadian(value) {
  if(value.indexOf("deg") != -1) {
    return parseFloat(value,10) * (Math.PI * 2 / 360);
  } else if (value.indexOf("grad") != -1) {
    return parseFloat(value,10) * (Math.PI/200);
  } else {
    return parseFloat(value,10);
  }
}

function createMatrix() {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ];
}



// computeMatrix: function(ruleValue) {
  
//     //Split the webkit functions and loop through them
//     var functions = ruleValue.match(/[A-z]+\([^\)]+/g) || [];
//     var matrices = [];
    
//     for (var k=0; k < functions.length; k++) {
    
//       //Prepare the function name and its value
//       var func = functions[k].split('(')[0],
//         value = functions[k].split('(')[1];
    
//       //Now we rotate through the functions and add it to our matrix
//       switch(func) {
//         case 'matrix': //Attention: Matrix in IE doesn't support e,f = tx,ty = translation
//           var values = value.split(',');
//           matrices.push($M([
//             [values[0], values[2],  0],
//             [values[1], values[3],  0],
//             [0,         0,  1]
//           ]));
//           break;
//         case 'rotate':
//           var a = Transformie.toRadian(value);
//           matrices.push($M([
//             [Math.cos(a), -Math.sin(a), 0],
//             [Math.sin(a), Math.cos(a),  0],
//             [0,       0,        1]
//           ]));
//           break;
//         case 'scale':
//           matrices.push($M([
//             [value, 0,    0],
//             [0,   value,  0],
//             [0,   0,    1]
//           ]));
//           break;
//         case 'scaleX':
//           matrices.push($M([
//             [value, 0,    0],
//             [0,   1,    0],
//             [0,   0,    1]
//           ]));
//           break;
//         case 'scaleY':
//           matrices.push($M([
//             [1,   0,    0],
//             [0,   value,  0],
//             [0,   0,    1]
//           ]));
//           break;
//         case 'skew':
//           var a = Transformie.toRadian(value);
//           matrices.push($M([
//             [1,       0,  0],
//             [Math.tan(a), 1,  0],
//             [0,       0,  1]
//           ]));
//         case 'skewX':
//           var a = Transformie.toRadian(value);
//           matrices.push($M([
//             [1,   Math.tan(a),0],
//             [0,   1,      0],
//             [0,   0,      1]
//           ]));
//           break;
//         case 'skewY':
//           var a = Transformie.toRadian(value);
//           matrices.push($M([
//             [1,       0,  0],
//             [Math.tan(a), 1,  0],
//             [0,       0,  1]
//           ]));
//           break;
//       };
      
//     };
    
//     if(!matrices.length)
//       return;
    
//     //Calculate the resulting matrix
//     var matrix = matrices[0];
//     for (var k=0; k < matrices.length; k++) {
//       if(matrices[k+1]) matrix = matrix.x(matrices[k+1]);
//     };

//     return matrix;
    
//   }