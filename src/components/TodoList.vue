<template>
  <ul>
    <TodoItem
      v-for="todo in parents"
      :key="todo.id"
      :todo="todo"
      @action="performAction"
    />
  </ul>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import TodoItem from '@/components/TodoItem';

export default {
  name: 'TodoList',

  components: {
    TodoItem,
  },

  computed: {
    ...mapGetters(['parents']),
  },

  methods: {
    ...mapActions([
      'addTodo',
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
