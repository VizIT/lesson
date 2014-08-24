/**
 * Handle r changed events from control components, such as XvsYView.
 *
 * @param target_   A gaussian surface that has a setRadius method.
 * @param renderer_ An instance of a framework containing the gausian surface.
 *
 * @constructor
 */
function gaussianSurfaceRChangedEventListiner(target_, renderer_)
{
  var renderer;
  var target;
  var targetID;

  renderer      = renderer_;
  target        = target_;

  this.handleRChanged   = function(event)
  {
    var detail;

    detail = event.detail;
    target.setRadius(detail.value);
    renderer.render();
  }

  this.handleHChanged   = function(event)
  {
    var detail;

    detail = event.detail;
    target.setHeight(detail.value);
    renderer.render();
  }
}

