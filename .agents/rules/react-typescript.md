# React and TypeScript

- Before adding a function, hook, or component, search for existing code that meets the requirement. Reuse or extend it when appropriate.
- Use understandable components and explicit props.
- Follow the project's existing design system, shared components, and styling conventions. If none exists, keep new UI consistent with established patterns.
- Keep rendering pure; perform side effects in event handlers or Effects, not during render.
- Treat props and state as immutable; create new objects and arrays when updating them.
- Call state and effect Hooks at the top level of React function components or custom Hooks, before early returns.
- Keep state close to the component that owns it.
- Derive values instead of storing duplicate state.
- Use Effects to synchronize with external systems; calculate derived values during render and handle user actions in event handlers.
- Include every reactive Effect dependency and clean up subscriptions, timers, or other resources when needed.
- Use functional state updates when the next value depends on the old one.
- Avoid any; narrow unknown external values before using them.
- Keep business calculations in functions that the UI actually calls.
- Prefer focused functions with clear names and straightforward control flow. Introduce abstractions only when they simplify the current requirements.
