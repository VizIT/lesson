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
    * Listen for click events, extract the source id as var=value, then generate a
    * varChanged event with {"value": value, "source": id}.
    *
    * @param eventType {String} The type of events that will be listened for, usually click.
    * @param class     {String} The class to which the will attach itself.
    */
   ns.LessonContentIDEventSource = function(eventType_, class_)
   {
     var CUSTOM_EVENT;
     var className;
     var elements;
     var eventType;

     /**
      * On the original event, capture the id of the event source, and use it
      * to construct a custom event. Here this is the original source of the event.
      */
     this.handleEvent   = function(event)
     {
       var event;
       /** Expected to be of the form varName=varValue */
       var id;
       /** Populated with varName, varValue */
       var idElements;


       event.preventDefault();

       id    = this.id;

       if (id)
       {
	 idElements = id.split("=");
	 if (idElements.length >1)
	 {
	   event = document.createEvent(CUSTOM_EVENT);
	   event.initCustomEvent(idElements[0] + "Changed", true, true, {"value": parseInt(idElements[1], 10), "source": id});
	   this.dispatchEvent(event);
	 }
       }
     }

     CUSTOM_EVENT = "CustomEvent";

     eventType    = eventType_;
     className    = class_;

     elements = document.getElementsByClassName(className);

     for (var i=0, nelements=elements.length; i<nelements; i++)
     {
       elements[i].addEventListener(eventType,   this.handleEvent,    false);
     }
   }
})(window.vizit.lesson);
