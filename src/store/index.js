import Vue from 'vue';
import Vuex from 'vuex';
import { nanoid } from 'nanoid';

Vue.use(Vuex);

const ls = window.localStorage;

export default new Vuex.Store({
  state: {
    todos: [],
  },

  mutations: {
    SET_TODOS: (state, payload) => (state.todos = payload),

    ADD_TODO: (state, payload) => state.todos.push(payload),

    DELETE_TODO: (state, payload) =>
      state.todos.splice(
        state.todos.find(todo => todo.id === payload),
        1,
      ),

    RESET_STORAGE: state => (state.todos = []),
  },

  actions: {
    fetchTodos: async ({ commit }) => {
      const todos = await ls.getItem('todos');
      commit('SET_TODOS', todos ? JSON.parse(todos) : []);
    },

    addTodo: async ({ commit, dispatch }, todo) => {
      await commit('ADD_TODO', { id: nanoid(), ...todo });
      dispatch('saveTodos');
    },

    deleteTodo: async ({ commit, dispatch }, id) => {
      await commit('DELETE_TODO', id);
      dispatch('saveTodos');
    },
      dispatch('saveTodos');
    },

    saveTodos: async ({ state }) => {
      console.log('Saving todos');
      await ls.setItem('todos', JSON.stringify(state.todos));
    },

    resetStorage: async ({ commit }) => {
      await ls.removeItem('todos');
      commit('RESET_STORAGE');
    },
  },

  getters: {},
});
