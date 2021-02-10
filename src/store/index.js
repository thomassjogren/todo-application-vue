import Vue from 'vue';
import Vuex from 'vuex';
import { nanoid } from 'nanoid';

Vue.use(Vuex);

const ls = window.localStorage;

export default new Vuex.Store({
  state: {
    todos: [],

    comments: [],
  },

  mutations: {
    SET_TODOS: (state, payload) => (state.todos = payload),

    ADD_TODO: (state, payload) => state.todos.push(payload),

    COMPLETE_TODO: (state, payload) => {
      const todo = state.todos.find(todo => todo.id === payload);
      Vue.set(todo, 'completed', !todo.completed);
    },

    UPDATE_TODO: (state, payload) => {
      state.todos.splice(state.todos.indexOf(state.todos.find(todo => todo.id === payload.id)), 1);
      state.todos.push(payload);
    },

    UPDATE_PRIORITY: (state, { id, priority }) => {
      const todo = state.todos.find(todo => todo.id === id);
      Vue.set(todo, 'priority', priority);
    },

    DELETE_TODO: (state, { id, convertChildren }) => {
      const todo = state.todos.find(todo => todo.id === id);
      state.todos.splice(state.todos.indexOf(todo), 1);

      // Handle subtasks
      const children = state.todos.filter(todo => todo.parent === id);
      if (children.length) {
        if (convertChildren) {
          children.forEach(child => Vue.set(child, 'parent', null));
          return;
        }

        children.forEach(child => state.todos.splice(state.todos.indexOf(child), 1));
      }

      // Delete comments
      const comments = state.comments.filter(comment => comment.parent === id);
      if (comments.length) {
        comments.forEach(comment => state.comments.splice(state.comments.indexOf(comment), 1));
      }
    },

    RESET_STORAGE: state => {
      state.todos = [];
      state.comments = [];
    },

    SET_COMMENTS: (state, payload) => (state.comments = payload),

    ADD_COMMENT: (state, payload) => state.comments.push(payload),

    DELETE_COMMENT: (state, payload) =>
      state.comments.splice(state.comments.indexOf(state.comments.find(comment => comment.id === payload)), 1),
  },

  actions: {
    fetchTodos: async ({ commit }) => {
      console.log('Fetching todos');
      const todos = await ls.getItem('todos');
      commit('SET_TODOS', todos ? JSON.parse(todos) : []);
    },

    addTodo: async ({ commit, dispatch }, todo) => {
      await commit('ADD_TODO', { id: nanoid(), ...todo });
      dispatch('saveTodos');
    },

    completeTodo: async ({ commit, dispatch }, payload) => {
      await commit('COMPLETE_TODO', payload);
      dispatch('saveTodos');
    },

    updateTodo: async ({ commit, dispatch }, todo) => {
      await commit('UPDATE_TODO', todo);
      dispatch('saveTodos');
    },

    updatePriority: async ({ commit, dispatch }, payload) => {
      await commit('UPDATE_PRIORITY', payload);
      dispatch('saveTodos');
    },

    deleteTodo: async ({ commit, dispatch }, id) => {
      await commit('DELETE_TODO', id);
      dispatch('saveTodos');
      dispatch('saveComments');
    },

    saveTodos: async ({ state }) => {
      console.log('Saving todos');
      await ls.setItem('todos', JSON.stringify(state.todos));
    },

    resetStorage: async ({ commit }) => {
      await ls.removeItem('todos');
      await ls.removeItem('comments');
      commit('RESET_STORAGE');
    },

    fetchComments: async ({ commit }) => {
      console.log('Fetching comments');
      const comments = await ls.getItem('comments');
      commit('SET_COMMENTS', comments ? JSON.parse(comments) : []);
    },

    addComment: async ({ commit, dispatch }, comment) => {
      await commit('ADD_COMMENT', {
        id: nanoid(),
        timestamp: new Date(),
        ...comment,
      });
      dispatch('saveComments');
    },

    deleteComment: async ({ commit, dispatch }, id) => {
      await commit('DELETE_COMMENT', id);
      dispatch('saveComments');
    },

    saveComments: async ({ state }) => {
      console.log('Save comments');
      await ls.setItem('comments', JSON.stringify(state.comments));
    },
  },

  getters: {
    parents: state => {
      const parents = state.todos.filter(todo => !todo.parent && !todo.completed).map(a => ({ ...a }));
      parents.sort((a, b) => {
        return b.priority - a.priority;
      });
      parents.forEach(p => {
        Vue.set(
          p,
          'children',
          state.todos.filter(t => t.parent === p.id),
        );

        Vue.set(
          p,
          'comments',
          state.comments.filter(t => t.parent === p.id),
        );
      });
      return parents;
    },

    completed: state => {
      const parents = state.todos.filter(todo => !todo.parent && todo.completed).map(a => ({ ...a }));
      parents.sort((a, b) => {
        return b.priority - a.priority;
      });
      parents.forEach(p => {
        Vue.set(
          p,
          'children',
          state.todos.filter(t => t.parent === p.id),
        );

        Vue.set(
          p,
          'comments',
          state.comments.filter(t => t.parent === p.id),
        );
      });
      return parents;
    },
  },
});
