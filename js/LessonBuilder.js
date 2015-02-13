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

// Define the global namespace root iff not already defined.
window.vizit        = window.vizit        || {};
window.vizit.lesson = window.vizit.lesson || {};

(function (ns)
 {
   /**
    * A framework to facilitate and simplfy the creation of interactive
    * instructional content, that is lessons.
    */
   ns.LessonBuilder = function()
   {
     /**
      * Query the DOM to find relevant elements, and attach the desired behavior.
      */
     this.init   = function()
     {
       var element;
       var elements;
       var type;

       // TODO search for lessonElement class, then dispatch on data-type attribute.
       // this would then be class="lessonElement" data-type="rangedSource"
       elements = document.getElementsByClassName("lessonElement");

       for(var i=elements.length; i--;)
       {
         element = elements[i];
         if (element.hasAttribute("data-type"))
         {
           type    = element.getAttribute("data-type").toLowerCase();

           // TODO use regex matching
           if (type === "rangedsource")
           {
             new ns.RangedSource(element);
           }
           else if (type === "setter")
           {
             new ns.Setter(element);
           }
         }
       }
     }

     /**
      * Initialize the Lesson package when the DOM is present.
      */
     this.initWhenReady  = function()
     {
       if (document.readyState === "interactive" || document.readyState === "complete")
       {
         this.init();
       }
       else
       {
	   document.addEventListener("DOMContentLoaded", this.init, false);
       }
     }
   }

   var lessonBuilder;

   lessonBuilder = new ns.LessonBuilder();
   lessonBuilder.initWhenReady();

 }(window.vizit.lesson));
