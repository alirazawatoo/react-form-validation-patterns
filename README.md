# React Form Validation Patterns

A React/TypeScript exercise demonstrating schema-driven dynamic fields, touched/error behavior, reusable inputs, and a submitted-result view.

`DynamicForm` composes field definitions and schema rules; `Input`, `MaterialFields`, and `TaskFields` isolate field concerns; `FormResult` presents validated output.

```bash
yarn install
yarn start
yarn test
```

Component tests cover the form and result view. Server validation, persistence, accessibility auditing, and production error handling are outside this client-side exercise.
