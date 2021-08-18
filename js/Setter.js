"use strict";

/*
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
   /** We generate custom, not standard, events. */
   ns.CUSTOM_EVENT = "CustomEvent";

   /**
    * Add behavior to Setter elements.
    */
   ns.Setter = function (element)
   {
     var newElement;
     var values;
     var vars;

     /**
      * On the original trigger event, capture the id of the event source, and use it
      * to construct custom events as per the set. 
      */
     this.handleEvent = function(event)
     {
       const nevents = vars.length;

       for (let i=0; i<nevents; ++i)
       {
         const customEvent = new CustomEvent(vars[i] + "Changed", {
           detail: {
             value: values[i],
             source: "setter"
           },
           bubbles: true,
           cancelable: true,
           composed: false,
         });
         newElement.dispatchEvent(customEvent);
       }

       // No dispatch on click of a link
       event.preventDefault();
     }

     this.init = function(element)
     {
       var content;
       var desc;
       var i;
       var set;
       var sets;
       var tmp;
       var trigger;

       values  = [];
       vars    = [];
       trigger = "click";

       desc = element.getAttribute("data-desc");
       set  = element.getAttribute("data-set");

       if (element.hasAttribute("data-trigger"))
       {
         trigger = element.getAttribute("data-trigger");
       }

       if (element.hasAttribute("data-html"))
       {
         content = element.getAttribute("data-html");
       }

       sets = set.split(",");

       for (i=sets.length-1; i>=0; --i)
       {
         tmp = sets[i].split("=");
         vars.push(tmp[0].trim());
         values.push(tmp[1].trim());
       }

       if (!!desc)
       {
         newElement    = document.createElement("abbr");
         newElement.setAttribute("title", desc);
       }

       tmp           =  document.createElement("button");
       tmp.setAttribute("class", "setter");

       if (typeof content != "undefined")
       {
         tmp.innerHTML = content;
         while (element.firstChild)
         {
           element.removeChild(element.firstChild);
         }
       }

       if (!!newElement)
       {
         newElement.appendChild(tmp);
       }
       else
       {
         newElement = tmp;
       }

       element.insertBefore(newElement,  element.firstChild);
       element.addEventListener(trigger, this.handleEvent.bind(this), false);
     }

     this.init(element);
   }
}(window.vizit.lesson));