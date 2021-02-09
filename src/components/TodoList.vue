<template>
  <ul>
    <TodoItem v-for="todo in parentsWithChilds" :key="todo.id" :todo="todo" @action="performAction" />
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
    ...mapGetters(['parentsWithChilds']),
  },

  methods: {
    ...mapActions(['addTodo', 'deleteTodo', 'updateTodo']),

    performAction({ action, payload }) {
      if (this[action] === undefined) {
        throw Error('Action not defined');
      }
      this[action](payload);
    },
  },
};
</script>
