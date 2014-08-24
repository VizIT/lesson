/**
 * Adaptor to map a field(r) to field(x,y,z) for a radially
 * symmetric charge distribution centered at the origin. 
 *
 * @param  field  A charge or charge configuration that
 *                implements getField(x, y, z)
 * @param  x0     The x coordinate of the r=0 point.
 * @param  y0     The y coordinate of the r=0 point.
 * @param  z0     The z coordinate of the r=0 point.
 * @param  theta  The angle between r and the z axis.
 * @param  phi    The angle between r and the x axis.
 * 
 * @constructor
 */
function DotRAdapter(source_, x0_, y0_, z0_, theta_, phi_)
{
  var source;
  var theta, phi, sinTheta, cosTheta, sinPhi, cosPhi;
  /** Components of the unit vector in the r direction (r hat). */
  var rx, ry, rz;
  var x0, y0, z0;

  this.f    = function(r)
  {
    var field;
    var rho;
    var x, y, z;

    if (r == 0)
    {
      // Fudge factor to avoid issues at r=0.
      r = 1.0E-10;
    }

    rho     = r*sinPhi;
    z       = z0 + r*cosPhi;
    y       = y0 + rho*sinTheta;
    x       = x0 + rho*cosTheta;

    field   = source.getField(x, y, z);
    return field[0] * rx + field[1] * ry + field[2] * rz;
  }

  source = source_;
  x0     = x0_;
  y0     = y0_;
  z0     = z0_;
  theta  = theta_;
  phi    = phi_;

  sinTheta    = Math.sin(theta);
  cosTheta    = Math.cos(theta);
  sinPhi      = Math.sin(phi);
  cosPhi      = Math.cos(phi);

  rx      = cosTheta*sinPhi;
  ry      = sinTheta*sinPhi;
  rz      = cosPhi;
}