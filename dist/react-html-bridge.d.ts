/// <reference types="react" />
import * as React from 'react';
/**
 * Find all elements with a `data-component` attribute and attempt to mount the specified React component in them.
 * The available components must be specified in the `components` argument.
 *
 * Initial props can be specified by creating a script with type="text/plain" somewhere on the page with a unique ID
 * containing Javascript code (properly escaped to avoid XSS attacks if it contains user-supplied input) that evaluates
 * to a props object. The container component can then specify the `data-props-id` attribute to be the ID of the div
 * containing the props.
 */
export default function reactHTMLBridge(components: [React.ClassType<any, any, any>]): void;
