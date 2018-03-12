import * as React from 'react';
import * as ReactDOM from 'react-dom';

/**
 * Find all elements with a `data-component` attribute and attempt to mount the specified
 * React component in them. The available components must be specified in the `components` argument.
 * Initial props can be specified via a JSON string in the `data-initial-props` attribute.
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

    let initialProps;
    try {
      initialProps = JSON.parse(container.dataset.initialProps || '{}');
    } catch (e) {
      console.error(e);
      initialProps = {};
    }

    let elem = React.createElement(component, initialProps, []);
    ReactDOM.render(elem, container);
  });
}