/**
 * Listen for events generated within the lesson that require updates to the
 * html content. Particularly WRT mathematical content. For each member of
 * the named class set the text content to event.value.
 *
 * @param eventType {String} The name of the type of event listened for,
 *                           and from which the value will be extracted.
 * @param class     {String} The name of the class. Each member of the class
 *                           will have element.text set to event.value.
 *
 * @constructor
 */
function lessonContentEventHandler(eventType_, class_)
{
  var className;
  var eventType;

  this.handleEvent   = function(event)
  {
    var detail;
    var element;
    var elements;
    var nelements;
    var value;

    detail   = event.detail;
    elements = document.getElementsByClassName(className);

    for (var i=0, nelements=elements.length; i<nelements; ++i)
    {
      element = elements[i];
      // Don't propagate data changed events back to the original source.
      if (detail.source != element.id)
      {
        value = detail.value;
        if (value < 10)
        {
          element.innerHTML = "&nbsp;" + value.toFixed(2);
        }
        else
        {
          element.innerHTML = value.toFixed(2);
        }
      }
    }
  }

  eventType = eventType_;
  className = class_;
  document.addEventListener(eventType,   this.handleEvent.bind(this),    false);
}

/**
 * Listen for events generated within the lesson that require updates to the
 * html content. Particularly WRT mathematical content. For each member of
 * the named class set the text content to expression(event.value).
 *
 * @param eventType  {String}   The name of the type of event listened for,
 *                              and from which the value will be extracted.
 * @param expression {function}
 * @param class      {String}   The name of the class. Each member of the class
 *                              will have element.text set to event.value.
 *
 * @constructor
 */
function MappingContentEventHandler(eventType_, expression_, class_)
{
  var className;
  var eventType;
  var expression;

  this.handleEvent   = function(event)
  {
    var detail;
    var element;
    var elements;
    var nelements;
    var value;

    detail   = event.detail;
    elements = document.getElementsByClassName(className);

    for (var i=0, nelements=elements.length; i<nelements; ++i)
    {
      element = elements[i];
      // Don't propagate data changed events back to the original source.
      if (detail.source != element.id)
      {
        value = expression(detail.value);
        if (value < 10)
        {
          element.innerHTML = "&nbsp;" + value.toFixed(2);
        }
        else
        {
          element.innerHTML = value.toFixed(2);
        }
      }
    }
  }

  eventType  = eventType_;
  className  = class_;
  expression = expression_;
  document.addEventListener(eventType,   this.handleEvent.bind(this),    false);
}

