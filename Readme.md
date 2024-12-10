rfs - react from scratch

The view of an application depends on the state of the application, so we can say that
the virtual DOM is a function of the state. Each time the state changes, the virtual DOM
should be reevaluated, and the framework needs to update the real DOM accordingly


MountDOM - create DOM node for virtualDOM
 > it needs to save a reference to real DOM node in vNode under "el" property
 > it needs to save a reference to event listener in vNode under "listeners" property

  Why?
   - so that we can remove event listeners and elements from DOM when unmounting
   - so we know what element to update in DOM

State manager
  - keeps the application’s state in sync with the view, responding to user input by modifying the
    state accordingly and notifying the renderer when the state has changed. 
    
Renderer
  - entity in your framework that takes the virtual DOM and mounts it into the browser’s document.


## State Manager

Dispatcher - dispatch commands that are mapped to command handlers that update the state of app

## Renderer

The application instance is the object that manages the lifecycle of the application. It
manages the state, renders the views, and updates the state in response to user input


## Process

1. Create app using vDOM h() functions
2. Define app state and reducers to update state
3. In vDOM when events happen, emit() function will call dispatch to update state
4. It will also re-render that is, destroy old vDOM, create new one using new state