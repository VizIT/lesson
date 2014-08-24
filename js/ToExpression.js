"use strict";
/**
 * @class Listen for events generated within the lesson that require significant updates to
 *        a mathematical expression.
 *
 * @param equation             {String} The id of the element containing the equation to be rerendered.
 * @param xName                {String} The name of the free variable, listen for xNameChanged events.
 * @param expressionsAndValues {Array}  Unlimited optional parameters. A set of arguments
 *                                      of the form  expression_n, x_n, expression_n+1, x_n+1, where
 *                                      expression_n is used when x_n <= x < x_n+1.
 *
 * @constructor
 */
function ModelExpressionEventHandler(expression_, xName_)
{
  var expression;
  var expressions;
  var expressionsAndValues;
  var values;
  var xName;

  this.handleEvent   = function(event)
  {
    var detail;
    var i, nvalues;
    var value;

    detail = event.detail;
    value  = detail.value;

    for (i=0, nvalues=values.length; i<nvalues; ++i)
    {
      if (values[i] > value)
      {
        break;
      }
    }
    MathJax.Hub.Queue(["Text", expression, expressions[i]])
  }

  MathJax.Hub.queue.Push(function ()
                         {
                           expression = MathJax.Hub.getAllJax(expression_)[0];
                         });

  expression           = expression_;
  expressions          = new Array();
  expressionsAndValues = Array.prototype.slice.call(arguments, 2);
  values               = new Array();
  xName                = xName_;

  for (var i=0, nargs=expressionsAndValues.length; i<nargs; i++)
  {
    if (i%2 == 0)
    {
      expressions.push(expressionsAndValues[i]);
    }
    else
    {
      values.push(expressionsAndValues[i]);
    }
  }
  document.addEventListener(xName + "Changed",   this.handleEvent.bind(this),    false);
}
