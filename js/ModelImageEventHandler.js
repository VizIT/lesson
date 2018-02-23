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

(function (ns)
 {
   /**
    * Listen for events generated within the lesson that require updates to the
    * model image. 
    *
    * @param image           {Image}  The image to be refreshed if appropriate when x changes.
    * @param xName           {String} The name of the free variable, listen for xNameChanged events.
    * @param imagesAndValues {Array}  Unlimited amount of optional parameters. A set of arguments
    *                                 of the form  image_n, x_n, image_n+1, x_n+1, where
    *                                 image_n is used when x_n <= x < x_n+1.
    *
    * @class
    */
   ns.ModelImageEventHandler = function(image_, xName_, imagesAndValues)
   {
     var image;
     var images;
     var values;
     var xName;

     this.handleEvent   = function(event)
     {
       var detail;
       var i;
       var value;

       detail = event.detail;
       value  = detail.value;

       for (i=0, nvalues=values.length; i<nvalues; ++i)
       {
	 if (values[i] > value)
	 {
	   break;
	 }
       }

       image.src = images[i];
     }

     image     = image_;
     images    = new Array();
     values    = new Array();
     xName     = xName_;

     for (var i=0, nargs=imagesAndValues.length; i<nargs; i++)
     {
       if (i%2 == 0)
       {
	 images.push(imagesAndValues[i]);
       }
       else
       {
	 values.push(imagesAndValues[i]);
       }
     }
     document.addEventListener(xName + "Changed",   this.handleEvent.bind(this),    false);
   }
 })(window.vizit.lesson);
