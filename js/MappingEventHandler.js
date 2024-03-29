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
    * Generic event handler to accept a user defined mapping,
    * via a text configuration such as JSON.
    *
    * @param {Function} updater  The function invoked to update the system
    * @param {string}   variable The name of the external variable that triggers the update.
    * @param {string}   mapping  An expression that transforms the variable into the value
    *                            set by the updater.
    *
    * @class
    */
   ns.MappingEventHandler = function(updater_, variable, mapping_, framework_)
   {
     var framework;
     var mapping;
     /** function that updates the desired value when an event is recieved. */
     var updater;

     this.handleUpdate = function(event)
     {
       var detail;

       detail = event.detail;

       updater(mapping(detail.value));
       framework.requestRender();
     }

     mapping   = new Function(variable, "return " + mapping_ + ";");
     framework = framework_l
     updater   = updater_;
   }
 }(window.vizit.lesson));
