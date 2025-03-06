import { mountDOM } from './mount-dom';
import { unmountDOM } from './unmount-dom';

export function defineComponent({ render }) {
  class Component {
    #isMounted = false
    #vDOM = null;
    #hostEl = null;

    render() {
      return render();
    }

    mount(hostEl) {
      if (this.#isMounted) {
        throw new Error('Component is already mounted.');
      }
      
      this.#vDOM = this.render();
      mountDOM(this.#vDOM, hostEl);
      this.#hostEl = hostEl;
      this.#isMounted = true;
    }

    unmount() {
      if (!this.#isMounted) {
        throw new Error('Component is not mounted.');
      }
      unmountDOM(this.#vDOM);
      this.#vDOM = null;
      this.#hostEl = null;
      this.#isMounted = false;
    }
  }

  return Component;
}
