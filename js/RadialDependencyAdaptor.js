"use strict";

/**
 *  Copyright 2014 Vizit Solutions
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

window.vizit        = window.vizit        || {};
window.vizit.lesson = window.vizit.lesson || {};

(function(ns)
 {
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
    * @class
    */
   ns.RadialDependancyAdaptor = function(source_, x0_, y0_, z0_, theta_, phi_)
   {
     var source;
     var theta, phi, sinTheta, cosTheta, sinPhi, cosPhi;
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
       return Math.sqrt(field[0] * field[0] + field[1] * field[1] + field[2] * field[2]);
     };

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
   };
})(window.vizit.lesson);

