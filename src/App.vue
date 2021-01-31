<template>
  <div id="app">
    <form @submit.prevent="save">
      <label for="title">Title</label>
      <input id="title" v-model="title" type="text" />
      <label for="description">Description</label>
      <textarea id="description" v-model="description"></textarea>
      <button type="submit">Save</button>
    </form>

    <ul>
      <li v-for="(todo, index) in todos" :key="index">{{ todo.title }}<br />{{ todo.description }}</li>
    </ul>

    <button @click="resetStorage">Reset Storage</button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'App',

  data() {
    return {
      title: '',
      description: '',
    };
  },

  computed: {
    ...mapState(['todos']),
  },

  beforeMount() {
    this.fetchTodos();
  },

  methods: {
    ...mapActions(['fetchTodos', 'addTodo', 'resetStorage']),

    save() {
      this.addTodo({
        title: this.title,
        description: this.description,
      });

      this.title = '';
      this.description = '';
    },
  },
};
</script>
