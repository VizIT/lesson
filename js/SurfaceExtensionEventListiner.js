/**
 * Handle h changed events for a surface such that the given edge remains fixed.
 * That is only one end of the surface moves.
 *
 * @param target_   A gaussian surface that has setHeight and setOrigin methods.
 * @param renderer_ An instance of a framework containing the gausian surface.
 *
 * @constructor
 */
function SurfaceExtensionEventListiner(target_, renderer_)
{
  var theta, phi, sinTheta, cosTheta, sinPhi, cosPhi;
  var renderer;
  var target;

  this.handleHChanged   = function(event)
  {
    var detail;
    var h0, dh;
    var origin;
    var xcap, xnew, dx;

    origin     = target.getOrigin();
    h0         = target.getHeight();

    xcap       = origin[0] + h0*cosTheta*sinPhi/2.0;
    detail     = event.detail;
    xnew       = detail.value;
    dx         = xnew - xcap;
    dh         = dx/(cosTheta*sinPhi);


    origin[0] += dh*cosTheta*sinPhi/2;
    origin[1] += dh*sinTheta*sinPhi/2;
    origin[2] += dh*cosPhi/2;
    
    target.setHeight(h0+dh);
    target.setOrigin(origin);

    renderer.render();
  }

  renderer      = renderer_;
  target        = target_;
  // Theta and phi are reversed in the efield code.
  theta         = target.getPhi();
  phi           = target.getTheta();

  sinTheta      = Math.sin(theta);
  cosTheta      = Math.cos(theta);
  sinPhi        = Math.sin(phi);
  cosPhi        = Math.cos(phi);
}

