import * as React from 'react';
import * as ReactDOM from 'react-dom';

/**
 * Find all elements with a `data-component` attribute and attempt to mount the specified React component in them.
 * The available components must be specified in the `components` argument.
 *
 * Initial props can be specified by creating a script with type="text/plain" somewhere on the page with a unique ID
 * containing Javascript code (properly escaped to avoid XSS attacks if it contains user-supplied input) that evaluates
 * to a props object. The container component can then specify the `data-props-id` attribute to be the ID of the div
 * containing the props.
 */
export default function reactHTMLBridge(components: [React.ClassType<any, any, any>]) {
  const componentMap: { [name: string]: React.ClassType<any, any, any> } = {};
  components.forEach(component => {
    componentMap[component.name] = component;
  });

  const containers = document.querySelectorAll("[data-component]");
  Array.prototype.forEach.call(containers, (container: HTMLElement) => {
    let componentName: string = container.dataset.component || '';
    let component = componentMap[componentName];
    if (!component) {
      console.warn(`React component not registered: ${componentName}`);
      return;
    }

    let context = {
      components: componentMap
    };

    let initialProps: object = {};
    let propsId: string = container.dataset.propsId || '';
    if (propsId) {
      let propsElem: HTMLElement | null = document.getElementById(propsId);
      if (propsElem !== null) {
        let propsJs: string = propsElem.innerText;
        try {
          const evalFunc = (code: string) => eval(code);
          initialProps = evalFunc.call(context, propsJs);
        } catch (e) {
          console.warn(`Could not load props for React component ${componentName} with propsId ${propsId} due to an error:\n ${e.message}`);
        }
      } else {
        console.warn(`No such props container: ${propsId}`);
      }
    }

    let elem = React.createElement(component, initialProps, []);
    ReactDOM.render(elem, container);
  });
}
