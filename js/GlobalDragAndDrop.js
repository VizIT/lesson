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
    // Closure compiler, used for minification, does not support static fields yet
    /** This class indicates the element is repositionable via user drag */
    ns.draggableClass = "vizit.draggable";

    /*
     * Our handling of document level drag and drop events.
     */
    ns.DragHandler = class {
        /**
         * Is the current dragging object legal to drop on us?
         */
        isValidDrop(element) {
            let validDrop;
            let classList = element.classList;
            if (classList) {
                validDrop = classList.contains(ns.draggableClass);
            }
            return validDrop;
        }

        constructor() {
            document.addEventListener("dragstart", this.handleDragStart.bind(this), false);
            document.addEventListener("dragenter", this.handleDragEnter.bind(this), false);
            document.addEventListener("dragover", this.handleDragOver.bind(this), false);
            document.addEventListener("drop", this.handleDrop.bind(this), false);
        }

        handleDragStart(event) {
            this.droppable = this.isValidDrop(event.target);
            if (this.droppable) {
                /** The HTMLElement we are dragging */
                this.dragging = event.target;
                this.originalOpacity = this.dragging.style.opacity;
                this.dragging.style.opacity = .5;
                /** The initial position when the drag starts */
                this.clientX0 = event.clientX;
                this.clientY0 = event.clientY;
            }
        }

        handleDragEnter (event) {
            if (this.droppable) {
                event.preventDefault();
            }
        }

        handleDragOver (event) {
            if (this.droppable) {
                event.preventDefault();
            }
        }

        getTransformValues(element) {
            const transformStyle = element.style.transform;
            let transform;
            if (transformStyle) {
                const values = element.style.transform.split(/\w+\(|\);?/);
                transform = values[1].split(/,\s?/g).map(numStr => parseInt(numStr));
            } else {
                transform = [0, 0, 0]
            }

            return {
                x: transform[0],
                y: transform[1],
                z: transform[2]
            };
        }

        handleDrop (event) {
            if (this.droppable) {
                let currentTransform = this.getTransformValues(this.dragging);
                let deltaX = currentTransform.x + event.clientX - this.clientX0;
                let deltaY = currentTransform.y + event.clientY - this.clientY0;
                this.dragging.style.transform = "translate3d(" + deltaX + "px," + deltaY + "px, " + currentTransform.z + "px)";
                this.dragging.style.opacity = this.originalOpacity;
                event.preventDefault();
            }
        }
    }
}(window.vizit.lesson));