# What todo - An awesome todo application

## TLDR;

Simply navigate to the folder and run the following command. Note that this runs
the development build of the application so it is loading full assets instead of
optimized ones.

```
npm install && npm run serve
```

## General information

The application is build on top of the [Vuejs JavaScrip framework](https://vuejs.org) and uses
LocalStorage in order to store data. The UI is build with [Tailwindcss](https://tailwindcss.com) and
mostly uses the [Nord](https://www.nordtheme.com/) color scheme.

## Features

Most common features of a simple todo-application are there. Create, update and
delete todos. Set priority (todos are sorted from high to low). Add subtasks and
delete and comments.

Completed todos are automatically moved to the "Completed"-list which can be
toggled by the link below the main todo list. Here you can move tasks back to
the main list.

Each todo can be expanded, to show the additional options, by clicking the
expand-icon to the right.

Input fields can be confirmed by hitting the Enter key and edit fields can be
cancelled by hitting the ESC key.

And yes, there is a "Reset storage"-button where you can "restart" the
application with an empty LocalStorage.

## Possible improvements

- Unit and e2e tests
- Split up TodoItem into smaller parts
- Timestamps for created, updated, completed
- Due date
- Different sorting options
- Archive instead of automatically move to "Completed"
- More animaitons (new todo, completed, sorting)
