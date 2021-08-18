/*
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
   /** We generate custom, not standard, events. */
   ns.SNAPSHOT_EVENT = "vizit.snapshot";
   ns.captionAttributeName = "caption";
   ns.imageSourceAttributeName = "src";

   /**
    * Display a canvas snapshot in a repositionable and collapsable container.
    *
    * @type {{new(): Window.vizit.lesson.CanvasSnapshot, readonly observedAttributes: [Window.vizit.lesson.imageSourceAttributeName, Window.vizit.lesson.captionAttributeName], imageSourceAttributeName: string, captionAttributeName: string, imageSourceValue: String, captionValue: String, innerHTML: string, prototype: CanvasSnapshot}}
    */
   ns.CanvasSnapshot = class extends HTMLElement {

     constructor() {
       super();
       this.shown = true;
     }

     // Listen for changes to these attributes.
     static get observedAttributes() {
       return [ns.imageSourceAttributeName, ns.captionAttributeName];
     }

     /**
      * When an attribute changes
      *
      * @param {String} attrName The name of the changed attribute
      * @param {String} oldValue The prior value of the attribute
      * @param {String} newValue The new value for the attribute
      *
      * @see observedAttributes
      */
     attributeChangedCallback(attrName, oldValue, newValue) {
       switch (attrName) {
         case ns.imageSourceAttributeName:
           this.imageSourceValue = newValue;
           break;
         case ns.captionAttributeName:
           this.captionValue = newValue;
           break;
       }
     }

     connectedCallback() {
       const snapshotDiv = document.createElement("div");
       snapshotDiv.classList.add("snapshot");
       snapshotDiv.classList.add(vizit.lesson.draggableClass);
       snapshotDiv.setAttribute("draggable", "true");

       if (this.hasAttributes()) {
         const myAttributes = this.attributes;
         for(let i = myAttributes.length - 1; i >= 0; i--) {
           switch (myAttributes[i].name) {
             case ns.captionAttributeName:
               this.captionValue = myAttributes[i].value;
               break;
             case ns.imageSourceAttributeName:
               this.imageSourceValue = myAttributes[i].value;
               break;
             default:
               snapshotDiv.setAttribute(myAttributes[i].name, myAttributes[i].value);
           }
         }
       }

       const headerDiv = document.createElement("div");
       headerDiv.classList.add("snapshotHeader");
       // Yes, the header may include HTML markup.
       headerDiv.innerHTML = this.captionValue;

       const closeButton = document.createElement("button");
       closeButton.classList.add("divControl");
       closeButton.appendChild(document.createTextNode("X"))
       closeButton.addEventListener("click", this.close.bind(this), false);
       headerDiv.appendChild(closeButton);

       const hideButton = document.createElement("button");
       hideButton.classList.add("divControl");
       hideButton.appendChild(document.createTextNode("_"))
       hideButton.addEventListener("click", this.toggleShown.bind(this), false);
       headerDiv.appendChild(hideButton);

       snapshotDiv.appendChild(headerDiv);

       this.imageElement = document.createElement("img");
       this.imageElement.src = this.imageSourceValue;
       this.imageElement.classList.add("snapshot");
       snapshotDiv.appendChild(this.imageElement);

       this.appendChild(snapshotDiv);
     }

     toggleShown() {
       this.shown = !this.shown;
       this.imageElement.style.height = this.shown ? "unset" : "0";
     }

     close(event) {
      this.parentElement.removeChild(this);
      event.preventDefault();
     }
   }

   /**
    * Capture snapshots of a Canvas element.
    */
   ns.CanvasSnapshooter = class {

     /**
      * Capture snapshots of a Canvas element.
      * @param {HTMLElement } _parentElement The logical parent for the snapshots.
      *                                      Snapshots are absolutely positioned within this element.
      * @param {canvas} _canvasElement The canvas element we capture data from.
      * @parma {String} _id We trigger on snapshot events for this target.
      */
     constructor (_parentElement, _canvasElement, _id) {
       this.canvasElement = _canvasElement;
       this.parentElement = _parentElement;
       this.id = _id;
       // We compute an offset from the number of snapshots taken.
       this.taken = 0;
       document.addEventListener(ns.SNAPSHOT_EVENT, this.handleEvent.bind(this), false);
     }

     /**
      * Captures a snapshot of the canvas into a floating div with the
      * given header, if any
      * @param {String} HTML or Text for the div caption
      */
     capture(caption) {
       var newElement = document.createElement("canvas-snapshot");
       this.taken++;
       newElement.setAttribute("style", `top: ${this.taken*2}em; left: ${this.taken}em;`)
       newElement.setAttribute(ns.captionAttributeName, caption);
       newElement.setAttribute(ns.imageSourceAttributeName, this.canvasElement.toDataURL());
       this.parentElement.appendChild(newElement);
     }

     /**
      * When we are triggered by an event - the actual work id done by capture.
      */
     handleEvent(event) {
       if (event.detail.target &&  event.detail.target === this.id) {
         this.capture(event.detail.caption)
       }
     }
   }

   ns.variableAttributeName = 'var';
   ns.eventAttributeName = "event";
   ns.methodAttributeName = "method";

   /**
    * Defines the captions for snapshots, expected to be used within a canvas-snapshooter
    * element.
    *
    * @type {{new(): Window.vizit.lesson.SnapshotCaption, prototype: SnapshotCaption}}
    */
   ns.SnapshotCaption = class extends HTMLElement {

     constructor() {
       // CE Spec requires call to super here.
       super();
     }

     // Listen for changes to these attributes.
     static get observedAttributes() {
       return [ns.variableAttributeName, ns.eventAttributeName, ns.methodAttributeName];
     }

     // When an attribute changes
     attributeChangedCallback(attrName, oldValue, newValue) {
       switch (attrName) {
         case ns.variableAttributeName:
           this.variableName = newValue;
           break;
         case ns.eventAttributeName:
           this.eventName = newValue;
           break;
         case ns.methodAttributeName:
           this.dataMethod = newValue;
           break;
       }
     }

     connectedCallback() {
       // The caption element is never rendered in place
       this.hidden = true;
     }
   }

   ns.CanvasSnapshooterButton  = class extends HTMLElement {

     constructor() {
       // CE Spec requires call to super here.
       super();
       this.targetAttributeName = 'target';
     }

     // Listen for changes to these attributes.
     static get observedAttributes() {
       return [this.targetAttributeName];
     }

     // When an attribute changes
     attributeChangedCallback(attrName, oldValue, newValue) {
       if (attrName === this.targetAttributeName) {
         this.target = newValue;
       }
     }

     /**
      * When the user clicks on our button, fire a custom event to trigger snapshotting the target.
      * @param event The click - ignored.
      */
     handleClick(event) {
       let snapshotCaption;
       let command;
       if (this.snapshotCaptionTemplate) {
         // The snapshot caption may or may not contain a variable.
         if (this.snapshotCaptionVariable && this.snapshotCaptionEvent) {
             // We catch events and use the data to set the variable
             command = `var ${this.snapshotCaptionVariable} = ${this.snapshotCaptionVariableValue};`;
         }

         if (command) {
           command += "`" + this.snapshotCaptionTemplate + "`";
         } else {
           command = "`" + this.snapshotCaptionTemplate + "`";
         }
         snapshotCaption = eval(command);
       }
       const newEvent = new CustomEvent(ns.SNAPSHOT_EVENT, {
         detail: {
           target: this.target,
           caption: snapshotCaption
         },
         bubbles: true,
         cancelable: true,
         composed: false,
       });
       this.dispatchEvent(newEvent);
     }

     /**
      * Capture the value from a variable changed event.
      * @param {event} event A lesson framework value changed event
      */
     handleCaptionValueEvent(event) {
      this.snapshotCaptionVariableValue = event.detail.value;
     }

     snapshotCaptionDefined(node) {
       if (node.localName === "snapshot-caption") {
         this.snapshotCaptionNode     = node
         this.snapshotCaptionVariable = node.getAttribute("var");
         this.snapshotCaptionEvent    = node.getAttribute("event");
         if (this.snapshotCaptionEvent) {
           document.addEventListener(this.snapshotCaptionEvent, this.handleCaptionValueEvent.bind(this) , false);
         }
         this.snapshotCaptionMehod    = node.getAttribute("method");
       } else if (this.snapshotCaptionNode && this.snapshotCaptionNode.contains(node)) {
         this.snapshotCaptionTemplate = this.snapshotCaptionNode.innerHTML;
       }
     }

     /**
      * Handle changes to child elements
      * @param {MutationRecord[]} mutations One record for each mutation
      * @param {MutationObserver} The mutation observer, as setup below
      */
     mutationHandler(mutations, observer) {
       for(const mutation of mutations) {
          switch (mutation.type) {
            case "childList":
              console.log("Children: " + mutation);
              mutation.addedNodes.forEach(this.snapshotCaptionDefined.bind(this));
              break;
            case "attributes":
              console.log("Attributes: " + mutation);
              break;
            case "characterData":
              console.log("Characters: " + mutation);
              break;
          }
       }
     }

     /**
      * When we are connected to the DOM.
      */
     connectedCallback() {
       if (this.isConnected) {
         // The canvas we will capture
         this.target = this.getAttribute(this.targetAttributeName);

         // The button to trigger the capture
         const captureButton = document.createElement("button");
         //captureButton.appendChild(document.createTextNode("📷"));
         captureButton.innerHTML = "📷<br/>Capture";
         this.appendChild(captureButton);
         this.addEventListener('click', this.handleClick, false);

         // The child elements specify the caption for the captured image
         this.mutationObserver = new MutationObserver(this.mutationHandler.bind(this));

         // configuration of the observer:
         const observerConfig = {
           subtree:true,       // We want attributes and text from our children
           attributes: true,   // Attribute changes like the variable and events
           childList: true,    // Children like the caption element
           characterData: true // Character data like the caption text
         };

         // pass in the target node, as well as the observer options
         this.mutationObserver.observe(this, observerConfig);
       }
     }

     disconnectedCallback() {
       if (!this.isConnected) {
         this.removeEventListener('click', this.handleClick, false);
         this.mutationObserver.disconnect();
       }
     }
   }

   customElements.define('canvas-snapshooter', ns.CanvasSnapshooterButton);
   customElements.define('snapshot-caption',   ns.SnapshotCaption);
   customElements.define('canvas-snapshot',   ns.CanvasSnapshot);

 }(window.vizit.lesson));