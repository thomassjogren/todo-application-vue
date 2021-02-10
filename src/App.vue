<template>
  <div id="app">
    <form @submit.prevent="save">
      <label for="title">Title</label>
      <input id="title" v-model="title" type="text" />
      <label for="subtitle">Subtitle</label>
      <input id="subtitle" v-model="subtitle" />
      <button type="submit">Save</button>
    </form>

    <TodoList :todos="parents" />

    <div v-if="showCompleted">
      Completed
      <TodoList :todos="completed" />
    </div>

    <button @click="showCompleted = !showCompleted">Toggle completed</button>
    <button @click="resetStorage">Reset Storage</button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

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
      showCompleted: false,
    };
  },

  computed: {
    ...mapGetters(['parents', 'completed']),
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
