# To-do list

A small React to-do list: add tasks, mark them done, edit them in place, delete them. Tasks are saved in the browser's `localStorage`, so they survive a reload; nothing is sent anywhere.

Every control works from the keyboard: Tab moves between them, Space ticks a task, Enter saves an edit and Escape cancels it.

Live: https://kims-to-do-list-one.vercel.app

## Stack

- React 18 with Create React App (`react-scripts` 5)
- Font Awesome for the edit and delete icons
- `uuid` for task ids
- Jest and Testing Library for the component tests

## Prerequisites

- Node 24 (see `.nvmrc`); Node 18 or later should work
- npm

## Run

```bash
npm ci
npm start        # http://localhost:3000
```

## Test

```bash
CI=true npm test -- --watchAll=false
```

## Build

```bash
npm run build    # static output in build/
```

## Deploy

Hosted on Vercel as a static Create React App build (`npm run build`, output `build/`). No environment variables are needed.

## Known issues

- `npm audit` still reports advisories; all of them sit under `react-scripts` 5, which is no longer maintained. Clearing them means moving the build to Vite, which is a larger change than a dependency bump.
- A blanket `npm update` breaks the build: the newer `eslint-plugin-jest` it pulls in is not understood by `eslint-config-react-app` ("Environment key jest/globals is unknown"). Update packages individually and rebuild.
- There is one dark theme only; no light variant.
- If the browser blocks `localStorage` (some private modes), the app says so and keeps tasks for the session only.
- React 18.3 emits an `act` deprecation warning under `@testing-library/react` 13. Moving React past 18.2 needs `@testing-library/react` 14 or later at the same time.

## Project structure

```
public/                 static shell, manifest, icons
src/
  index.js              entry point
  App.js                renders TodoWrapper
  App.css               design tokens and all styles
  Components/
    TodoWrapper.js      lays out the form, progress line and list; tracks which row is being edited
    TodoForm.js         add-task form with inline validation
    EditTodoForm.js     in-place rename form (Save, Cancel, Escape)
    Todo.js             one task row: checkbox, edit and delete buttons
    TodoWrapper.test.js component tests
  todos/
    todo-reducer.js     pure state transitions for the list
    todo-storage.js     reads and writes localStorage, dropping malformed data
    use-todos.js        hook that loads the list once and saves every change
    *.test.js           unit tests for the reducer and storage
  setupTests.js         registers jest-dom matchers
```
