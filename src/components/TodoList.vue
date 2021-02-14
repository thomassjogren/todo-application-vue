<template>
  <div v-if="!todos.length" class="my-6 text-center text-xl text-gray-500">Nothing to do</div>
  <ul v-else>
    <TodoItem v-for="todo in todos" :key="todo.id" :todo="todo" @action="performAction" />
  </ul>
</template>

<script>
import { mapActions } from 'vuex';

import TodoItem from '@/components/TodoItem';

export default {
  name: 'TodoList',

  components: {
    TodoItem,
  },

  props: {
    todos: {
      type: Array,
      required: true,
    },
  },

  methods: {
    ...mapActions([
      'addTodo',
      'completeTodo',
      'updateTodo',
      'updatePriority',
      'deleteTodo',
      'addComment',
      'deleteComment',
    ]),

    performAction({ action, payload }) {
      if (this[action] === undefined) {
        throw Error('Action not defined');
      }
      this[action](payload);
    },
  },
};
</script>
