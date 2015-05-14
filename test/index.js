var cssTransformToMatrix = require('./..');

document.body.style[ 'text-align' ] = 'right';
document.body.style[ 'font-family' ] = 'Helvetica, sans serif';
document.body.style.width = '100%';
document.body.style.margin = '0';
document.body.innerHTML = '<div>The following is a test of converting css transform value strings to mat4 and then reapplying via css transform: matrix3d()</div>' +
                          '<div>The left side is applying css transform value as is. The right side is applying returned mat4 via css transform: matrix3d()</div>';

createTest('none');
createTest('initial');

createTest('matrix(0.5, 0, 0, 0.5, 0, 0)');
createTest('matrix(0.353553390593274, 0.353553390593274, 0, -0.0707106781186548, 0.0707106781186548, 0)');
createTest('matrix3d(0.766044443118978, 0.642787609686539, 0, 0, -0.642787609686539, 0.766044443118978, 0, 0, 0, 0, 1, 0, 63.748692118167, 20.5996498310335, 0, 1)');
createTest('translate(40px, 20px)');
createTest('translateX(40px)');
createTest('translateY(40px)');
createTest('rotate(20deg)');
createTest('scale(0.5, 0.5)');
createTest('scaleX(0.5)');
createTest('scaleY(0.5)');
createTest('skew(30deg, 20deg)');
createTest('skewX(30deg)');
createTest('skewY(30deg)');
createTest('skewY(30deg)');
createTest('perspective(1000px) translate3d(40px, 20px, -1000px)');
createTest('translate3d(40px, 20px, -1000px)', true);
createTest('translateZ(-1000px)', true);
createTest('scale3d(0.5, 0.35, 0.3)', true);
createTest('scaleZ(0.3)', true);
createTest('rotateX(45deg)', true);
createTest('rotateY(45deg)', true);
createTest('rotateZ(45deg)', true);
createTest('rotate3d(1, 1, 0, 45deg)', true);
createTest('rotate(45deg) scale(0.5, 0.1)');
createTest('translateZ(-1000px) scale(1, 1.3) rotateX(30deg) scaleZ(0.5)', true);

function createTest(transform, addPerspective) {

  var container = document.createElement('div');
  var leftParent = getParent();
  var rightParent = getParent();
  var left = getToTransform('#CAFE00');
  var right = getToTransform('#00BABE');

  container.style.width = '100%';
  container.style.height = '200px';
  container.style.margin = '30px 0px 30px 0px';

  rightParent.style.left = '50%';

  if(!addPerspective) {
    left.style.transform = transform;
    right.style.transform = 'matrix3d(' + ( cssTransformToMatrix(transform).join(',') ) + ')';
  } else {
    left.style.transform = 'perspective(1000px) ' + transform;
    right.style.transform = 'perspective(1000px) matrix3d(' + ( cssTransformToMatrix(transform).join(',') ) + ')';
  }
  

  container.innerHTML = transform;


  leftParent.appendChild(left);
  rightParent.appendChild(right);
  container.appendChild(leftParent);
  container.appendChild(rightParent);
  document.body.appendChild(container);
}

function getParent() {
  var el = document.createElement('div');

  el.style.position = 'absolute';
  el.style.width = '50%';
  el.style.height = '200px';
  el.style.border = '1px solid #999';

  return el;
}

function getToTransform(colour) {

  var el = document.createElement('div');

  el.style.position = 'absolute';
  el.style.left = '0px';
  el.style.top = '0px';
  el.style.background = colour;
  el.style.width = '100px';
  el.style.height = '100px';

  return el;
}