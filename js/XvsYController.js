/**
 * Render a graph of y = source.f(x) with x ranging from xMin to xMax
 * and y clipped to the range yMin < y < yMax.
 */
function XvsYView(source_, xLabel_, xMin_, xMax_, yLabel_, yMin_, yMax_, svg_)
{
  var axesGroup;
  var axisLabel;
  var CUSTOM_EVENT;
  var clipPath;
  var clipRect;
  var defs;
  /** Spacing between function evaluations, smaller values => smoother curve, but slower */
  var deltaX;
  var eventHandler;
  var group;
  var markerGroup;
  var markerPath;
  var markerText;
  var plot;
  var pointer;
  var points;
  var ptr;
  var ptrGroup;
  var source;
  var svg;
  var svgNS;
  var xlinkNS;
  var x, xAxis, xLabel, xMin, xMax, xMidLabel, xMaxLabel, xOffset, xScale;
  var y, yAxis, yLabel, yMin, yMax, yMidLabel, yMaxLabel, yOffset, yScale;

  CUSTOM_EVENT = "CustomEvent";
  deltaX       = 0.1;
  source       = source_;
  svg          = svg_;
  svgNS        = "http://www.w3.org/2000/svg";
  xlinkNS      = "http://www.w3.org/1999/xlink";
  xLabel       = xLabel_;
  xMin         = xMin_;
  xMax         = xMax_;
  xOffset      = 50;
  xScale       = 1000/(xMax-xMin);
  yLabel       = yLabel_;
  yMin         = yMin_;
  yMax         = yMax_;
  yOffset      = 20;
  yScale       = 1000/(yMax-yMin);

  this.getID          = function() 
  {
    return svg.id;
  }

  this.mapXToScreen   = function(x)
  {
      return (x-xMin)*xScale;
  }

  this.mapScreenToX   = function(x)
  {
    return x/xScale + xMin;
  }

  /**
   * Map event offsetX svg coordinates to the plot coordinates.
   */
  this.mapRawToGroupX = function(x)
  {
    x -= 50;
    return x;
  }

  this.mapYToScreen   = function(y)
  {
    // This should put negative and positive infinity where they are clipped.
    // SVG has a habbit of clipping the entire curve if it extends to infinity.
    if (y > yMax)
    {
      y = yMax + 10;
    }
    else if (y < yMin)
    {
      y = yMin - 10;
    }
    // SVG coordinates have y=0 at the top, increasing downwards.
    return 1000 - (y-yMin)*yScale;
  }

  this.createPointer     = function(x, y)
  {
    <!-- The ‘use’ element references another element and indicates -->
    <!-- that the graphical contents of that element is included/drawn -->
    <!-- at that given point in the document. -->
    var pointer = document.createElementNS(svgNS,            "use");
    <!-- The object in the defs section to instianted by this -->
    <!-- 'use' element -->
    pointer.setAttributeNS(xlinkNS, "href",             "#pointer");
    pointer.setAttributeNS(null,    "x",                        x);
    pointer.setAttributeNS(null,    "y",                        y);
    return pointer;
  }

  this.dispatchXChangedEvent = function()
  {
    var defaultCanceled;
    var event;

    event = document.createEvent(CUSTOM_EVENT);
    event.initCustomEvent(xLabel + "Changed", true, true, {"value": x, "source": svg.id});
    // Default returned, true if any handler invoked prevent default - do we care?
    svg.dispatchEvent(event);
  }

  /**
   * Invoked in response to an externally sourced event, do not generate another event.
   */
  this.setX                  = function(x)
  {
    this.x = x;
    if (x>=xMin && x<=xMax)
    {
      y = source.f(x);

      pointer.x.baseVal.value = this.mapXToScreen(x);
      pointer.y.baseVal.value = this.mapYToScreen(y);
    }
  }

  /**
   * Invoked in our click processing, so we want to generate an event for others.
   */
  this.setScreenX            = function(x_)
  {
    x_ = this.mapRawToGroupX(x_);
    x  = this.mapScreenToX(x_);

    if (x>xMin && x<xMax)
    {
      y = source.f(x);
      y = this.mapYToScreen(y);

      pointer.x.baseVal.value = x_;
      pointer.y.baseVal.value = y;

      this.dispatchXChangedEvent();
    }
  }

  this.computePoints         = function()
  {
    var x, y;
    points     = "";
    for(x=xMin; x<xMax; x+=deltaX)
    {
      y       = source.f(x);
      points += this.mapXToScreen(x);
      points += ","
      points += this.mapYToScreen(y);
      points += " ";
    }

    // Trim off trailing space.
    points = points.substring(0, points.length-1);

    return points;
  }

  /**
   *
   */
  this.zoomBy                = function(factor)
  {
    var tmp;

    xMin   *= factor;
    xMax   *= factor;
    yMin   *= factor;
    yMax   *= factor;

    xMaxLabel.textContent = xMax.toFixed(2);
    tmp                   = (xMin+xMax)/2;
    xMidLabel.textContent = tmp.toFixed(2);

    yMaxLabel.textContent = yMax.toFixed(2);
    tmp                   = (yMin+yMax)/2;
    yMidLabel.textContent = tmp.toFixed(2);

    xScale  = 1000/(xMax-xMin);
    yScale  = 1000/(yMax-yMin);

    deltaX *= factor;

    points       = this.computePoints();
    plot.setAttributeNS(null, "points", points);
    
    x       = Math.min(xMax, Math.max(xMin, x));

    // Update the pointer.
    this.setX(x);
    this.dispatchXChangedEvent();
  }

  // Translate the graph so the origin, where the axes cross, is at 0,0.
  group      = document.createElementNS(svgNS,                        "g");
  group.setAttributeNS(null, "transform",   "translate(" + xOffset + "," + yOffset + ")"); 

  defs       = document.createElementNS(svgNS,                     "defs");
  clipPath   = document.createElementNS(svgNS,                 "clipPath");
  clipPath.setAttributeNS(null,   "id",                        "plotClip");
  clipRect   = document.createElementNS(svgNS,                     "rect");
  clipRect.setAttributeNS(null,    "x",                                 0);
  clipRect.setAttributeNS(null,    "y",                                 0);
  clipRect.setAttributeNS(null,    "height",                         1000);
  clipRect.setAttributeNS(null,    "width",                          1000);
  clipPath.appendChild(clipRect);
  defs.appendChild(clipPath);

  ptrGroup   = document.createElementNS(svgNS,                         "g");
  // This will be the marker for the current value of r.
  ptrGroup.setAttributeNS(null,    "id",                         "pointer");
  ptr        = document.createElementNS(svgNS,                    "circle");
  ptr.setAttributeNS(null,    "cx",                                      0);
  ptr.setAttributeNS(null,    "cy",                                      0);
  ptr.setAttributeNS(null,    "r",                                      12);
  ptr.setAttributeNS(null,    "class",                          "rPointer");
  ptrGroup.appendChild(ptr);
  ptr        = document.createElementNS(svgNS,                    "circle");
  ptr.setAttributeNS(null,    "cx",                                      0);
  ptr.setAttributeNS(null,    "cy",                                      0);
  ptr.setAttributeNS(null,    "r",                                       5);
  ptr.setAttributeNS(null,    "class",                          "rPointer");

  ptrGroup.appendChild(ptr);
  defs.appendChild(ptrGroup);

  svg.appendChild(defs);

  // Properties for both axes
  axesGroup  = document.createElementNS(svgNS,                        "g");
  axesGroup.setAttributeNS(null, "stroke-width",                        5);
  axesGroup.setAttributeNS(null, "stroke",                        "black");

  xAxis      = document.createElementNS(svgNS,                     "path");
  xAxis.setAttributeNS(null, "d",                "M 0 1000 L 1000 1000 Z");
  yAxis      = document.createElementNS(svgNS,                     "path");
  yAxis.setAttributeNS(null, "d",                      "M 0 0 L 0 1000 Z");

  axesGroup.appendChild(yAxis);
  axesGroup.appendChild(xAxis);
  group.appendChild(axesGroup);

  markerGroup = document.createElementNS(svgNS,                        "g");
  markerGroup.setAttributeNS(null, "class",                      "markers");

  // Horizontal line along the top of the graph
  markerPath = document.createElementNS(svgNS,                     "path");
  markerPath.setAttributeNS(null, "d",                 "M 0 0 L 1000 0 Z");
  markerGroup.appendChild(markerPath);

  // Horizontal line through the middle
  markerPath = document.createElementNS(svgNS,                     "path");
  markerPath.setAttributeNS(null, "d",             "M 0 500 L 1000 500 Z");
  markerGroup.appendChild(markerPath);

  // Vertical line along the right edge.
  markerPath = document.createElementNS(svgNS,                     "path");
  markerPath.setAttributeNS(null, "d",           "M 1000 0 L 1000 1000 Z");
  markerGroup.appendChild(markerPath);

  // Vertical line through the center.
  markerPath = document.createElementNS(svgNS,                     "path");
  markerPath.setAttributeNS(null, "d",             "M 500 0 L 500 1000 Z");
  markerGroup.appendChild(markerPath);

  yMaxLabel  = document.createElementNS(svgNS,                     "text");
  yMaxLabel.setAttributeNS(null, "x",                              "-10");
  yMaxLabel.setAttributeNS(null, "y",                               "10");
  yMaxLabel.setAttributeNS(null, "class",                    "axisLabel");
  yMaxLabel.appendChild(document.createTextNode(yMax));
  markerGroup.appendChild(yMaxLabel);

  yMidLabel  = document.createElementNS(svgNS,                     "text");
  yMidLabel.setAttributeNS(null, "x",                              "-10");
  yMidLabel.setAttributeNS(null, "y",                              "510");
  yMidLabel.setAttributeNS(null, "class",                    "axisLabel");
  yMidLabel.appendChild(document.createTextNode((yMin+yMax)/2));
  markerGroup.appendChild(yMidLabel);

  xMidLabel  = document.createElementNS(svgNS,                     "text");
  xMidLabel.setAttributeNS(null, "x",                              "510");
  xMidLabel.setAttributeNS(null, "y",                             "1030");
  xMidLabel.setAttributeNS(null, "class",                    "axisLabel");
  xMidLabel.appendChild(document.createTextNode((xMin+xMax)/2));
  markerGroup.appendChild(xMidLabel);

  xMaxLabel  = document.createElementNS(svgNS,                     "text");
  xMaxLabel.setAttributeNS(null, "x",                             "1010");
  xMaxLabel.setAttributeNS(null, "y",                             "1030");
  xMaxLabel.setAttributeNS(null, "class",                    "axisLabel");
  xMaxLabel.appendChild(document.createTextNode(xMax));
  markerGroup.appendChild(xMaxLabel);

  axisLabel  = document.createElementNS(svgNS,                     "text");
  axisLabel.setAttributeNS(null, "x",                               "-50");
  axisLabel.setAttributeNS(null, "y",                               "510");
  axisLabel.setAttributeNS(null, "transform",       "rotate(-90 -50,510)");
  axisLabel.setAttributeNS(null, "class",                     "axisLabel");
  axisLabel.appendChild(document.createTextNode(yLabel));
  markerGroup.appendChild(axisLabel);

  axisLabel  = document.createElementNS(svgNS,                     "text");
  axisLabel.setAttributeNS(null, "x",                               "510");
  axisLabel.setAttributeNS(null, "y",                              "1055");
  axisLabel.setAttributeNS(null, "class",                     "axisLabel");
  axisLabel.appendChild(document.createTextNode(xLabel));
  markerGroup.appendChild(axisLabel);

  points       = this.computePoints();

  plot       = document.createElementNS(svgNS,                 "polyline");
  plot.setAttributeNS(null, "class",                              "curve");
  plot.setAttributeNS(null, "points",                              points);
          
  x         = 15;
  y         = source.f(x);
  x = this.mapXToScreen(x);
  y = this.mapYToScreen(y);
  pointer   = this.createPointer(x, y);

  group.appendChild(markerGroup);
  group.appendChild(plot);
  group.appendChild(pointer);
  svg.appendChild(group);

  eventHandler       = new lessonControlEventHandler(this, svg);
  svg.addEventListener("mousewheel",            eventHandler.handleMouseWheel.bind(eventHandler), false);
  svg.addEventListener("wheel",                 eventHandler.handleMouseWheel.bind(eventHandler), false);
  svg.addEventListener("mousedown",             eventHandler.handleMouseDown.bind(eventHandler),  false);
  document.addEventListener("mouseup",          eventHandler.handleMouseUp.bind(eventHandler),    false);
  document.addEventListener("mousemove",        eventHandler.handleMouseMove.bind(eventHandler),  false);
  svg.addEventListener("touchstart",            eventHandler.handleTouchStart.bind(eventHandler), false);
  svg.addEventListener("touchmove",             eventHandler.handleTouchMove.bind(eventHandler),  false);
  document.addEventListener("touchend",         eventHandler.handleTouchEnd.bind(eventHandler),   false);
  document.addEventListener(xLabel + "Changed", eventHandler.handleXChanged.bind(eventHandler),   false);
}
