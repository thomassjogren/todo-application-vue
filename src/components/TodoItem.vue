<template>
  <li>
    <p>
      <input v-if="edit" v-model="title" />
      <template v-else>{{ todo.title }}</template>
    </p>
    <p>
      <input v-if="edit" v-model="subtitle" />
      <template v-else>{{ todo.subtitle }}</template>
    </p>

    <button @click="toggleEdit">
      <template v-if="edit"><i class="fas fa-save" /> Save</template>
      <template v-else><i class="fas fa-edit" /> Edit</template>
    </button>
    <button @click="createNote"><i class="fas fa-sticky-note" /> Create note</button>
    <button @click="addSubTodo"><i class="fas fa-plus" /> Add subtask</button>
    <button @click="deleteTodo(todo.id)"><i class="fas fa-trash" /> Delete</button>
    <template v-if="subTodo">
      <label for="title">Title</label>
      <input id="title" v-model="subTitle" type="text" />
      <label for="subtitle">Subtitle</label>
      <input id="subtitle" v-model="subSubtitle" />
      <button @click="addSubTodo"><i class="fas fa-save" /> Save</button>
    </template>
  </li>
</template>

<script>
export default {
  name: 'TodoItem',

  props: {
    todo: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      edit: false,
      subTodo: false,

      title: this.todo.title,
      subtitle: this.todo.subtitle,

      subTitle: '',
      subSubtitle: '',
    };
  },

  methods: {
    toggleEdit() {
      if (this.edit) {
        this.$emit('action', {
          action: 'updateTodo',
          payload: { ...this.todo, title: this.title, subtitle: this.subtitle },
        });
      }
      this.edit = !this.edit;
    },

    createNote() {},

    addSubTodo() {
      if (this.subTodo && this.subTitle !== '') {
        this.$emit('action', {
          action: 'addTodo',
          payload: { title: this.subTitle, subtitle: this.subSubtitle, parent: this.todo.id, priority: 0 },
        });
      }
      this.subTodo = !this.subTodo;
      this.subTitle = '';
      this.subSubtitle = '';
    },

    deleteTodo(id) {
      this.$emit('action', { action: 'deleteTodo', payload: id });
    },
  },
};
</script>
