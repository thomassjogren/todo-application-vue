<template>
  <div id="app">
    <form @submit.prevent="save">
      <label for="title">Title</label>
      <input id="title" v-model="title" type="text" />
      <label for="subtitle">Subtitle</label>
      <input id="subtitle" v-model="subtitle" />
      <button type="submit">Save</button>
    </form>

    <TodoList />

    <button @click="resetStorage">Reset Storage</button>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import TodoList from '@/components/TodoList';

export default {
  name: 'App',

  components: {
    TodoList,
  },

  data() {
    return {
      title: '',
      subtitle: '',
    };
  },

  beforeMount() {
    this.fetchTodos();
    this.fetchComments();
  },

  methods: {
    ...mapActions(['fetchTodos', 'fetchComments', 'addTodo', 'resetStorage']),

    save() {
      if (this.title !== '') {
        this.addTodo({
          title: this.title,
          subtitle: this.subtitle,
          priority: 0,
          parent: null,
          completed: false,
        });

        this.title = '';
        this.subtitle = '';
        return;
      }
    },
  },
};
</script>
