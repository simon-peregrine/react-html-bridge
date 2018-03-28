"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
/**
 * Find all elements with a `data-component` attribute and attempt to mount the specified React component in them.
 * The available components must be specified in the `components` argument.
 *
 * Initial props can be specified by creating a script with type="text/plain" somewhere on the page with a unique ID
 * containing Javascript code (properly escaped to avoid XSS attacks if it contains user-supplied input) that evaluates
 * to a props object. The container component can then specify the `data-props-id` attribute to be the ID of the div
 * containing the props.
 */
function reactHTMLBridge(components) {
    var componentMap = {};
    components.forEach(function (component) {
        componentMap[component.name] = component;
    });
    var containers = document.querySelectorAll("[data-component]");
    Array.prototype.forEach.call(containers, function (container) {
        var componentName = container.dataset.component || '';
        var component = componentMap[componentName];
        if (!component) {
            console.warn("React component not registered: " + componentName);
            return;
        }
        var context = {
            components: componentMap
        };
        var initialProps = {};
        var propsId = container.dataset.propsId || '';
        if (propsId) {
            var propsElem = document.getElementById(propsId);
            if (propsElem !== null) {
                var propsJs = propsElem.innerText;
                try {
                    var evalFunc = function (code) { return eval(code); };
                    initialProps = evalFunc.call(context, propsJs);
                }
                catch (e) {
                    console.warn("Could not load props for React component " + componentName + " with propsId " + propsId + " due to an error:\n " + e.message);
                }
            }
            else {
                console.warn("No such props container: " + propsId);
            }
        }
        var elem = React.createElement(component, initialProps, []);
        ReactDOM.render(elem, container);
    });
}
exports.default = reactHTMLBridge;
