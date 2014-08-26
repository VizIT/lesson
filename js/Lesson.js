/**
 *  @license Copyright 2014 Vizit Solutions
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

// TODO look to js only pubsub, benchmarks indicate it's faster.
/** We generate custom, not standard, events. */
Lesson.CUSTOM_EVENT = "CustomEvent";

/**
 * Route the data from an input element to an output element.
 * TODO Add formatting, as printf. Replace with general listener?
 *
 * @param {HTMLInputElement}  source An HTML input element generating input events.
 * @param {HTMLOutputElement} target An HTML output element for the given input element.
 */
Lesson.ValueOutputHandler  = function(source_, output_)
{
  var source;
  var output;

  this.handleEvent = function(event)
  {
    output.value = source.value;
  }

  source = source_;
  output = output_;
}

/**
 * Indicate to any observers that the user originated a change in
 * variables through the source input element.
 *
 * @param {HTMLInputElement}  source An HTML input element generating input events.
 * @param {String}            name   A string giving the name of the input variable.
 */
Lesson.XChangedEventHandler = function(source_, name_)
{
  var source;
  var name;

  this.emitEvent    = function()
  {
    var event;
    var details;
    // Consider separate object for this. How do object literals effect JS optimization?
    details =
    {
      "source": source.id,
      "name":   name,
      "value":  source.value
    }

    event = document.createEvent(Lesson.CUSTOM_EVENT);
    event.initCustomEvent(name + "Changed", true, true, details);
    // Default returned, true if any handler invoked prevent default - do we care?
    source.dispatchEvent(event);
  }

  this.handleEvent  = function(event)
  {
    var changeEvent;
    var details;

    details = event.detail;

    console.log("Got event from " + details.source + " for " + details.name + " to " + details.value);

    if (details.source != source.id)
    {
      console.log("Setting " + details.value + " on " + source);
      source.value = details.value;
      // Force a changed event so listeners, such as the output element, will update.
      // Don't use input events here, those are for user updates that trigger Lesson events.
      changeEvent  = document.createEvent("HTMLEvents");
      changeEvent.initEvent("change", false, true);
      source.dispatchEvent(changeEvent);
    }
  }

  source = source_;
  name   = name_;
}

/**
 * A framework to facilitate and simplfy the creation of interactive
 * instructional content, that is lessons.
 */
function Lesson()
{
  var desiredState;
  var idRegistry;
  var waiting;
  var waitingOn;

  /**
   * Registry for unique ids on a page. Id's are tracked by a
   * base name and a count. So that the first id for a setter
   * of m1 would be m1-0.
   */
  Lesson.IdRegistry          = function()
  {
    var registry;

    registry = {};

    this.getIdFor    = function(base)
    {
      if (!registry.hasOwnProperty(base))
      {
        registry[base] = 0;
      }

      return registry[base]++;
    }
  }

  /**
   * Inner class to manage the lessonRangedSource elements.
   */
  function RangedSource(element, idRegistry)
  {
    var content;
    /* TODO replace with generalized bind for common event handlers */
    var eventHandler;
    var id;
    var inElement;
    var name;
    var min;
    var max;
    var outElement;
    var outputHandler;
    var step;
    var theElment;
    var tmp;
    var value;

    theElement = element;
    name       = theElement.getAttribute("data-name");
    max        = theElement.getAttribute("data-max");
    min        = theElement.getAttribute("data-min");
    step       = theElement.getAttribute("data-step");
    value      = theElement.getAttribute("data-value");
    id         = name + "_" + idRegistry.getIdFor(name);

    if (typeof value === 'undefined')
    {
      value = theElement.innerHTML;
    }

    console.log("Min: " + min + ", Max: " + max + ", Name: " + name + ", id: " + id);

    theElement.classList.add("lessonRangedSource");
    theElement.textContent = '';

    inElement = document.createElement("input");
    inElement.setAttribute("class", "lessonRangedSource");
    inElement.setAttribute("type",  "range");
    inElement.setAttribute("value", value);
    inElement.setAttribute("min",   min);
    inElement.setAttribute("max",   max);
    inElement.setAttribute("step",  step);
    inElement.setAttribute("id",    "rinput_"+id);

    outElement = document.createElement("output");
    outElement.setAttribute("id",  "routput_" + id);
    outElement.setAttribute("for", "rinput_" + id);

    content    = document.createTextNode(value);

    outElement.appendChild(content);
    theElement.appendChild(outElement);
    theElement.appendChild(inElement);

    // Whenever the inElement value changes, copy the value to the output element.
    outputHandler = new Lesson.ValueOutputHandler(inElement, outElement);
    inElement.addEventListener("input",  outputHandler.handleEvent.bind(outputHandler));
    inElement.addEventListener("change", outputHandler.handleEvent.bind(outputHandler));

    // On user input, emit a var changed event, and on a var changed event chenge the
    // range and output elements.
    eventHandler  = new Lesson.XChangedEventHandler(inElement, name);
    inElement.addEventListener("input", eventHandler.emitEvent.bind(eventHandler));
    document.addEventListener(name + "Changed", eventHandler.handleEvent.bind(eventHandler));
  }

  this.findElements   = function()
  {
    var elements;

    elements = document.getElementsByClassName("lessonRangedSource");

    for(var i=elements.length; i--;)
    {
      new RangedSource(elements[i], idRegistry);
      console.log(elements[i]);
    }
  }

  this.checkState     = function()
  {
    var desired;
    
    desired = (waitingOn.readyState == desiredState);

    if(desired)
    {
      waiting();
    }

    console.log(waitingOn.readyState);
    return desired;
  }

  /**
   * Invoke a function when the DOM is loaded.
   *
   * @param {function} fn A function to be invoked when the document is ready.
   */
  this.initWhenReady  = function(fn)
  {
    waiting   = fn;
    waitingOn = document;

    if (waitingOn.readyState == desiredState)
    {
      fn();
    }
    else
    {
      if(waitingOn.addEventListener)
      {
        waitingOn.addEventListener("readystatechange", this.checkState, false);
      }
      else if (waitingOn.attachEvent)
      {
        waitingOn.attachEvent( "onreadystatechange",   this.checkState);
      }
    }
  }

  idRegistry   = new Lesson.IdRegistry();
  // document.readyState == "interactive" => DOMContentLoaded
  // document.readyState == "complete"    => load
  desiredState = "interactive";
  this.initWhenReady(this.findElements);
}

var theLesson;
theLesson    = new Lesson();
