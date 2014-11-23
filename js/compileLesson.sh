#!/bin/bash
# Simple script to combine the components of the lesson package into one minified file.

# Put the paths to your java and closure compiler here.
# See https://developers.google.com/closure/compiler/docs/gettingstarted_app
JAVA=/usr/bin/java
CLOSURE_HOME=/opt/closure

$JAVA -jar $CLOSURE_HOME/compiler.jar --js current_license.js \
  IdRegistry.js RangedSource.js LessonBuilder.js \
  MappingEventHandler.js DirectEventHandler.js GaussianSurfaceRChangedEventListiner.js \
  LessonContentEventHandler.js  LessonContentEventSource.js LessonControlEventHandler.js \
  ModelImageEventHandler.js  RadialDependencyAdaptor.js  DotRAdapter.js \
  SurfaceExtensionEventListiner.js ToExpression.js XvsYController.js \
  --js_output_file Lesson.min.js

