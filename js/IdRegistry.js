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

"use strict";

window.vizit                = window.vizit                || {};
window.vizit.lesson         = window.vizit.lesson         || {};
window.vizit.lesson.utility = window.vizit.lesson.utility || {};

(function (ns)
 {
   /**
    * Registry for unique ids on a page. Id's are tracked by a
    * base name and a count. So that the first id for a setter
    * of m1 would be m1-1.
    */
   ns.IdRegistry          = function()
   {
     var registry;

     registry = {};

     this.getIdFor    = function(base)
     {
       if (!registry.hasOwnProperty(base))
       {
         registry[base] = 0;
       }

       return ++registry[base];
     }
   }

   ns.idRegistry = new ns.IdRegistry();
 }(window.vizit.lesson.utility));

