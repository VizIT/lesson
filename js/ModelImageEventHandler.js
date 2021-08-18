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
       const detail  = event.detail;
       const value   = detail.value;
       const nvalues = values.length;
       let i = 0;

       for (i=0; i < nvalues; ++i) {
         if (values[i] > value) {
           break;
         }
       }
       image.src = images[i];
     }

     image     = image_;
     images    = new Array();
     values    = new Array();
     xName     = xName_;

     const nargs = imagesAndValues.length;
     for (let j = 0; j < nargs; j++) {
       if (j % 2 === 0) {
         images.push(imagesAndValues[j]);
       } else {
         values.push(imagesAndValues[j]);
       }
     }

     document.addEventListener(xName + "Changed",   this.handleEvent.bind(this),    false);
   }
 }(window.vizit.lesson));
