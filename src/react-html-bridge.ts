import * as React from 'react';
import * as ReactDOM from 'react-dom';

/**
 * Find all elements with a `data-component` attribute and attempt to mount the specified React component in them.
 * The available components must be specified in the `components` argument.
 *
 * Initial props can be specified by creating a hidden (display: none) div somewhere on the page with a unique
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

    let initialProps: object = {};
    let propsId: string = container.dataset.propsId || '';
    if (propsId) {
      let propsElem: HTMLElement | null = document.getElementById(propsId);
      if (propsElem !== null) {
        let propsJs: string = propsElem.innerText;
        try {
          initialProps = eval(`(${propsJs})`);
        } catch (e) {
          console.error(e);
        }
      } else {
        console.warn(`Could not load props for React component ${componentName} with propsId ${propsId}`);
      }
    }

    let elem = React.createElement(component, initialProps, []);
    ReactDOM.render(elem, container);
  });
}
