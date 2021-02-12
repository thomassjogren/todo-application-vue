<template>
  <div id="app" class="relative flex items-center flex-col pb-20">
    <h1 class="text-8xl py-16 tracking-wider font-extrabold" style="color: #88c0d0"><i class="fas fa-check" /> TODO</h1>
    <div class="lg:w-1/2 w-full">
      <div class="bg-nord-3 mb-12 rounded-xl py-6 pr-8">
        <form class="flex items-center" @submit.prevent="save">
          <div class="flex-grow">
            <div>
              <label for="title" class="hidden">Title</label>
              <input
                id="title"
                ref="mainInput"
                v-model="title"
                type="text"
                tabindex="1"
                placeholder="What's on your mind?"
                class="input placeholder-gray-500 text-4xl"
              />
            </div>
            <div>
              <label for="subtitle" class="hidden">Subtitle</label>
              <input
                id="subtitle"
                v-model="subtitle"
                type="text"
                tabindex="2"
                placeholder="Additional information"
                class="input placeholder-gray-500 text-base italic"
              />
            </div>
          </div>
          <button
            type="submit"
            tabindex="3"
            class="h-16 w-16 text-6xl transition-colors duration-500 text-nord-aurora-2 hover:text-nord-aurora-4"
          >
            <i class="fas fa-plus" />
          </button>
        </form>
      </div>
      <div class="bg-nord-3 rounded-xl py-6 px-8">
        <TodoList :todos="parents" />

        <div v-if="showCompleted">
          Completed
          <TodoList :todos="completed" />
        </div>

        <button @click="showCompleted = !showCompleted">Toggle completed</button>
      </div>
    </div>
    <button class="absolute bottom-0 right-0 text-white p-2" @click="resetStorage">Reset Storage</button>
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

  mounted() {
    this.$refs.mainInput.focus();
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
