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
    * Handle mouse and touch events for lesson controler graphics.
    * TODO Change the name to better reflect the purpose
    */
   ns.LessonControlEventHandler = function(target_, svg_)
   {
     var activeTouches;
     // Is the mouse pressed in the canvas. Ignore mouse event if not.
     var inprogress;
     var lastX;
     var lastY;
     var point;
     var svg;
     var target;
     var targetID;

     activeTouches = new Array();
     inprogress    = false;
     lastX         = null;
     lastY         = null;
     svg           = svg_;
     target        = target_;
     targetID      = target.getID();

     // Can be operated on with SVG transformations.
     point         = svg.createSVGPoint();

     this.toSVGCoordinates      = function(svg, event)
     {
       point.x = event.clientX;
       point.y = event.clientY;

       return point.matrixTransform(svg.getScreenCTM().inverse());
     }

     this.findTouchByIdentifier = function(identifier_)
     {
       var i;
       var identifier;

       for (i=0; i<activeTouches.length; i++)
       {
	 identifier = activeTouches[i].identifier;

	 if (identifier == identifier_)
	 {
	   return i;
	 }
       }
       // Never found a match
       return -1;
     }

     /**
      * On start of a touch, position the radius pointer at the current X position,
      * just as with a mouse event.
      */
     this.handleTouchStart = function(event)
     {
       var i;
       var touch;
       var touches;

       // We only care abut touches that at least started out in the
       // element.
       touches = event.targetTouches;

       if (activeTouches.length == 0 && touches.length == 1)
       {
	 target.setScreenX(this.toSVGCoordinates(svg,touches[0]).x);
       }

       for (i=0; i<touches.length; i++)
       {
	 touch = touches[i];
	 if (this.findTouchByIdentifier(touch.identifier) == -1)
	 {
	   activeTouches.push(touch);
	 }
       }

       // Indicate we have done all needed processing on this event
       if (event.preventDefault)
       {
	 event.preventDefault();
       }
       else
       {
	 return false;
       }
     }

     this.handleTouchEnd = function(event)
     {
       var i;
       var index;
       var touches;

       // The touches that triggered the event.
       touches = event.changedTouches;

       for(i=0; i<touches.length; i++)
       {
	 index = this.findTouchByIdentifier(touches[i].identifier);
	 if (index != -1)
	 {
	   // Remove the one entry at index from the array.
	   activeTouches.splice(index, 1);

	   // Indicate we have done all needed processing on this event
	   event.preventDefault();
	 }
       }
     }

     /*
      * Touch move events when there is one active touch are delegated
      * to this method. Set x value for pointer.
      */
     this.handleOneActiveMove = function(event)
     {
	 var touch, oldTouch;

       touch    = event.changedTouches[0];
       oldTouch = activeTouches[0];
       if (oldTouch != null)
       {
	 activeTouches.splice(0, 1, touch); 
       }
       else
       {
	 activeTouches.push(touch);
       }

       target.setScreenX(this.toSVGCoordinates(svg,touch).x);

       // Indicate we have done all needed processing on this event
       if (event.preventDefault)
       {
	 event.preventDefault();
       }
       else
       {
	 return false;
       }
     }

     /*
      * Handle a move event with two active touches. This will correspond to
      * a scale event.
      */
     this.handleTwoActiveMove = function(event)
     {
       var deltaScale;
       var deltaX;
       var deltaY;
       var i;
       var identifier;
       var r0;
       var r1;
       var touch;
       var touch0;
       var touch1;
       var touches;

       touch0  = activeTouches[0];
       touch1  = activeTouches[1];
       deltaX  = touch1.pageX - touch0.pageX;
       deltaY  = touch1.pageY - touch0.pageY;
       r0      = Math.sqrt(deltaX*deltaX + deltaY*deltaY);

       touches = event.changedTouches;

       for(i=0; i<touches.length; i++)
       {
	 touch      = touches[i];
	 identifier = touch.identifier;
	 // Replace the touch that matches the identifier of the changed touch
	 if (touch0.identifier == identifier)
	 {
	   touch0 = touch;
	   activeTouches.splice(0, 1, touch);
	 }
	 else if (touch1.identifier == identifier)
	 {
	   touch1 = touch;
	   activeTouches.splice(1, 1, touch);
	 }
       }
       deltaX     = touch1.pageX - touch0.pageX;
       deltaY     = touch1.pageY - touch0.pageY;
       r1         = Math.sqrt(deltaX*deltaX + deltaY*deltaY);

       deltaScale = r1/r0;

       target.zoomBy(deltaScale);

       // Indicate we have done all needed processing on this event
       if (event.preventDefault)
       {
	 event.preventDefault();
       }
       else
       {
	 return false;
       }
     }

     this.handleTouchMove = function(event)
     {

       if (activeTouches.length == 1)
       {
	 return this.handleOneActiveMove(event);
       }
       else if (activeTouches.length == 2)
       {
	 return this.handleTwoActiveMove(event);
       }
       return true;
     }

     this.handleMouseDown = function(event)
     {
       inprogress = true;
       this.handleMouseMove(event);
     }

     this.handleMouseUp  = function(event)
     {
       inprogress = false;
     }

     this.handleMouseMove = function(event)
     {
       if (!inprogress)
       {
	 return;
       }

       target.setScreenX(this.toSVGCoordinates(svg,event).x);
     }

     this.handleMouseWheel = function(event_)
     {
       var event;
       var factor;

       //equalize event object
       event=window.event || event_;

       // event.deltaY for firefox and i.e., wheelDeltaY for chrome.
       factor = event.deltaY ? -event.deltaY : event.wheelDeltaY;

       if (factor > 0)
       {
	 factor = 2;
       }
       else
       {
	 factor = 0.5;
       }

       target.zoomBy(factor);

       // Indicate we have done all needed processing on this event
       if (event.preventDefault)
       {
	   event.preventDefault();
       }
       else
       {
	   return false;
       }
     }

     this.handleXChanged   = function(event)
     {
       var detail;

       detail = event.detail;
       // Don't propagate data changed events back to the original source.
       // TODO: Can we just compair x values?
       if (detail.source != targetID)
       {
	 target.setX(detail.value);
       }
     }
   }
})(window.vizit.lesson);

