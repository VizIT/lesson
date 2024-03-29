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
    * Handle r changed events from control components, such as XvsYView.
    *
    * TODO Redplace with DirectEventHandlers
    *
    * @param target_   A gaussian surface that has a setRadius method.
    * @param renderer_ An instance of a framework containing the gausian surface.
    *
    * @class
    */
   ns.GaussianSurfaceRChangedEventListiner = function(target_, renderer_)
   {
     var renderer;
     var target;

     renderer      = renderer_;
     target        = target_;

     this.handleRChanged   = function(event)
     {
       var detail;

       detail = event.detail;
       target.setRadius(detail.value);
       renderer.render();
     }

     this.handleHChanged   = function(event)
     {
       var detail;

       detail = event.detail;
       target.setHeight(detail.value);
       renderer.render();
     }
   }
 }(window.vizit.lesson));
