"use strict";

/**
 *  Copyright 2021 Vizit Solutions
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
    * Rerender the scene after updating the state.
    */
   ns.RenderingEventHandler = class extends ns.EventHandler {
     /**
      *
      * @param {Function} updater A Function that updates the desired value on an
      *                           element of the visualization.
      * @param {Object} renderable_ An object that implements the requestRender method.
      */
     constructor(updater_, renderable_) {
       super(updater_)
       this.renderable = renderable_;
     }

     handleUpdate (event) {
       super.handleUpdate(event);
       this.renderable.requestRender();
     }
   }
 }(window.vizit.lesson));
