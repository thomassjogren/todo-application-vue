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
      <li v-for="todo in todos" :key="todo.id">
        {{ todo.title }}<br />{{ todo.description }}<br />{{ todo.id }}<br />
        <button @click="toggleEdit">Edit</button>
        <button @click="createNote">Note</button>
        <button @click="addSubTodo">+</button>
        <button @click="deleteTodo(todo.id)">X</button>
      </li>
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
    ...mapActions(['fetchTodos', 'addTodo', 'resetStorage', 'deleteTodo']),

    save() {
      this.addTodo({
        title: this.title,
        description: this.description,
        priority: 0,
        parent: null,
      });

      this.title = '';
      this.description = '';
    },

    toggleEdit() {},

    createNote() {},

    addSubTodo() {},
  },
};
</script>
