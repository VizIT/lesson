#!/bin/bash
# Simple script to combine the components of the lesson package into one minified file.

# Put the paths to your java and closure compiler here.
# See https://developers.google.com/closure/compiler/docs/gettingstarted_app
JAVA=/usr/bin/java
CLOSURE_HOME=/opt/closure

$JAVA -jar $CLOSURE_HOME/compiler.jar --js current_license.js \
  IdRegistry.js RangedSource.js Setter.js SurfaceExtensionEventListiner.js \
  MappingEventHandler.js DirectEventHandler.js GaussianSurfaceRChangedEventListiner.js \
  LessonContentEventHandler.js  LessonContentEventSource.js LessonControlEventHandler.js \
  ModelImageEventHandler.js  RadialDependencyAdaptor.js  DotRAdapter.js \
  ToExpression.js XvsYController.js EventHandler.js RenderingEventHandler.js \
  GlobalDragAndDrop.js CanvasSnapshooter.js LessonBuilder.js \
  --language_in ES6 \
  --language_out ES6 \
  --js_output_file Lesson.min.js \
  --create_source_map="Lesson.min.js.map"

echo //# sourceMappingURL=Lesson.min.js.map >> Lesson.min.js
