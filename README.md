# To-do list

A small React to-do list: add tasks, mark them done, edit them in place, delete them. State lives in memory for the session; nothing is sent anywhere.

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

## Project structure

```
public/                 static shell, manifest, icons
src/
  index.js              entry point
  App.js                renders TodoWrapper
  Components/
    TodoWrapper.js      holds the task list and all state changes
    TodoForm.js         add-task form
    EditTodoForm.js     in-place edit form
    Todo.js             one task row with toggle, edit and delete
    TodoWrapper.test.js component tests
  setupTests.js         registers jest-dom matchers
```
