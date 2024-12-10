export class Dispatcher {
  #subscribers = new Map();
  // functions to run after commands
  #afterHandlers = [];

  subscribe(commandName, handler) {
    if (!this.#subscribers.has(commandName)) {
      this.#subscribers.set(commandName, []);
    }

    const handlers = this.#subscribers.get(commandName);
    if (handlers.includes(handler)) {
      // todo: more information
      return () => {};
    }

    // register
    handlers.push(handler);

    // unsubscribe
    return () => {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    };
  }

  // notification mechanism; don't update state
  afterEveryCommand(handler) {
    this.#afterHandlers.push(handler);
    return () => {
      const index = this.#afterHandlers.indexOf(handler);
      if (index !== -1) {
        this.#afterHandlers.splice(index, 1);
      }
    };
  }

  dispatch(commandName, payload) {
    if (this.#subscribers.has(commandName)) {
      this.#subscribers.get(commandName).forEach(handler => handler(payload));
    } else {
      console.warn(`No handler for command: ${commandName}`);
    }

    this.#afterHandlers.forEach(handler => handler());
  }
}
