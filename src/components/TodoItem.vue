<template>
  <li>
    <p>
      <input v-if="edit" v-model="title" />
      <template v-else>
        <input type="checkbox" :checked="todo.completed" @click="completeTodo(todo.id)" />
        {{ todo.title }}
      </template>
    </p>
    <p>
      <input v-if="edit" v-model="subtitle" />
      <template v-else>{{ todo.subtitle }}</template>
    </p>

    <div>
      Priority: {{ todo.priority }}
      <select v-model="priority" @change="updatePriority">
        <option value="0">0</option>
        <option value="1">1</option>
        <option value="2">2</option>
      </select>
    </div>

    <div v-if="hasChildren">
      <ul>
        <li v-for="subtask in todo.children" :key="subtask.id">
          <input type="checkbox" :checked="subtask.completed" @click="completeTodo(subtask.id)" />
          {{ subtask.title }}
          <button @click="deleteTodo(subtask.id)"><i class="fas fa-trash" /> Delete</button>
        </li>
      </ul>
    </div>

    <div v-if="hasComments">
      <p v-for="comment in sortedComments" :key="comment.id">
        {{ formatDate(comment.timestamp) }} - {{ comment.content }}
        <button @click="deleteComment(comment.id)"><i class="fas fa-times" /> Delete</button>
      </p>
    </div>

    <button @click="toggleEdit">
      <template v-if="edit"><i class="fas fa-save" /> Save</template>
      <template v-else><i class="fas fa-edit" /> Edit</template>
    </button>
    <button @click="createComment"><i class="fas fa-sticky-note" /> Add comment</button>
    <button @click="addSubTodo"><i class="fas fa-plus" /> Add subtask</button>
    <button @click="deleteTodo(todo.id)"><i class="fas fa-trash" /> Delete</button>
    <div v-if="subTodo">
      <label for="title">Title</label>
      <input id="title" v-model="subTitle" type="text" />
      <button @click="addSubTodo"><i class="fas fa-save" /> Save</button>
      <button @click="addSubTodo"><i class="fas fa-times" /> Cancel</button>
    </div>

    <BaseModal :open="showComment" click-outside close-button @hide="createComment">
      <div>
        <textarea v-model="commentContent"></textarea>
        <button @click="addComment"><i class="fas fa-save" /> Save comment</button>
      </div>
    </BaseModal>
  </li>
</template>

<script>
import formatDistance from 'date-fns/formatDistance';
import BaseModal from '@/components/BaseModal';

export default {
  name: 'TodoItem',

  components: {
    BaseModal,
  },

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
      showComment: false,

      title: this.todo.title,
      subtitle: this.todo.subtitle,

      subTitle: '',

      commentContent: '',

      priority: this.todo.priority,
    };
  },

  computed: {
    hasChildren() {
      return this.todo.children.length;
    },

    hasComments() {
      return this.todo.comments.length;
    },

    formatDate() {
      return timestamp => formatDistance(new Date(timestamp), new Date());
    },

    sortedComments() {
      const comments = [...this.todo.comments];
      return comments.sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
    },
  },

  methods: {
    toggleEdit() {
      if (this.edit) {
        this.$emit('action', {
          action: 'updateTodo',
          payload: {
            ...this.todo,
            title: this.title,
            subtitle: this.subtitle,
          },
        });
      }
      this.edit = !this.edit;
    },

    completeTodo(id) {
      this.$emit('action', {
        action: 'completeTodo',
        payload: id,
      });
    },

    createComment() {
      this.showComment = !this.showComment;
    },

    addSubTodo() {
      if (this.subTodo && this.subTitle !== '') {
        this.$emit('action', {
          action: 'addTodo',
          payload: {
            title: this.subTitle,
            subtitle: '',
            parent: this.todo.id,
            priority: 0,
            completed: false,
          },
        });
      }
      this.subTodo = !this.subTodo;
      this.subTitle = '';
      this.subSubtitle = '';
    },

    addComment() {
      if (this.commentContent !== '') {
        this.$emit('action', {
          action: 'addComment',
          payload: {
            parent: this.todo.id,
            content: this.commentContent,
          },
        });
        this.showComment = false;
        this.commentContent = '';
      }
    },

    deleteTodo(id) {
      this.$emit('action', {
        action: 'deleteTodo',
        payload: {
          id,
          convertChildren: false,
        },
      });
    },

    deleteComment(id) {
      this.$emit('action', {
        action: 'deleteComment',
        payload: id,
      });
    },

    updatePriority() {
      this.$emit('action', {
        action: 'updatePriority',
        payload: {
          id: this.todo.id,
          priority: this.priority,
        },
      });
    },
  },
};
</script>
