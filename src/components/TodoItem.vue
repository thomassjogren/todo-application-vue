<template>
  <li>
    <div class="flex mt-7 mb-7">
      <Checkbox :checked="todo.completed" :priority="todo.priority" @click="completeTodo(todo.id)" />
      <div class="flex-grow">
        <input
          v-if="edit"
          ref="titleInput"
          v-model="title"
          class="inline-input text-2xl"
          @keyup.enter="toggleEdit"
          @keyup.esc="cancelEdit"
        />
        <div v-else class="text-2xl font-bold w-full" @click="toggleEdit">
          {{ todo.title }}
          <button :title="edit ? 'Save' : 'Edit'" class="action-button text-xl" @click.stop="toggleEdit">
            <template v-if="edit"><i class="fas fa-save"/></template>
            <template v-else><i class="fas fa-pen"/></template>
          </button>
        </div>
        <div>
          <input
            v-if="edit"
            v-model="subtitle"
            class="inline-input italic"
            placeholder="Additional information"
            @keyup.enter="toggleEdit"
            @keyup.esc="cancelEdit"
          />
          <span v-else class="italic" @click="toggleEdit">{{ todo.subtitle }}</span>
        </div>
      </div>
      <button v-if="!edit" class="action-button relative -top-2 mr-10 text-5xl h-8" title="Expand todo">
        <i class="fas fa-angle-down h-8 hover:text-nord-frost-3" />
      </button>
      <div class="text-xl">
        <select v-model="priority" class="h-6" @change="updatePriority">
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
        <button class="action-button" title="Delete todo" @click="deleteTodo(todo.id)">
          <i class="fas fa-trash-alt" />
        </button>
      </div>
    </div>

    <div class="ml-46 my-10 w-1/2">
      <div class="text-xl font-bold">
        Sub tasks
      </div>
      <div class="pl-2 mt-3">
        <ul>
          <li v-for="subtask in todo.children" :key="subtask.id" class="mb-1 flex justify-between items-start">
            <div class="flex items-top">
              <input type="checkbox" :checked="subtask.completed" @click="completeTodo(subtask.id)" />
              {{ subtask.title }}
            </div>
            <button class="ml-9 action-button" @click="deleteTodo(subtask.id)"><i class="fas fa-times" /></button>
          </li>
        </ul>
        <div v-if="subTask" class="flex">
          <label for="title" class="hidden">Title</label>
          <input
            id="title"
            ref="subtaskInput"
            v-model="subTitle"
            class="inline-input"
            placeholder="Task title"
            @keyup.esc="cancelSubTask"
            @keyup.enter="addSubTask"
          />
          <button class="ml-2 action-button" title="Add sub task" @click="addSubTask"><i class="fas fa-plus" /></button>
          <button class="ml-2 action-button" title="Cancel" @click="cancelSubTask"><i class="fas fa-times" /></button>
        </div>
        <button
          v-else
          class="text-gray-500 hover:text-nord-frost-3 border-b border-transparent"
          title="Add sub-task"
          @click="addSubTask"
        >
          <i class="fas fa-plus" /> Add subtask
        </button>
      </div>
    </div>

    <div class="ml-46 my-10">
      <div class="text-xl font-bold mt-4">Comments</div>
      <div
        v-for="comment in sortedComments"
        :key="comment.id"
        class="px-3 py-2 bg-nord-4 rounded-md my-3 flex flex-col"
      >
        <div class="text-gray-500 flex justify-between">
          {{ formatDate(comment.timestamp) }}
          <button
            class="relative border-r border-transparent hover:text-nord-frost-3"
            @click="deleteComment(comment.id)"
          >
            <i class="fas fa-times" />
          </button>
        </div>
        {{ comment.content }}
      </div>
      <div class="relative">
        <input
          v-model="commentContent"
          class="inline-input border py-2 px-4 rounded-md"
          placeholder="Add a comment"
          @keyup.enter="addComment"
        />
        <button
          class="absolute right-3 top-2 text-gray-500"
          :class="{ 'text-nord-frost-3': commentContent !== '' }"
          @click="addComment"
        >
          <i class="fas fa-plus" />
        </button>
      </div>
    </div>
  </li>
</template>

<script>
import format from 'date-fns/format';
import Checkbox from '@/components/Checkbox';

export default {
  name: 'TodoItem',

  components: {
    Checkbox,
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
      subTask: false,

      title: this.todo.title,
      subtitle: this.todo.subtitle,

      tmpTitle: '',
      tmpSubtitle: '',

      subTitle: '',

      commentContent: '',

      priority: this.todo.priority,
    };
  },

  computed: {
    formatDate() {
      // Mon, 12 Jan 2020 12:12
      return timestamp => format(new Date(timestamp), 'E, dd LLL yyyy HH:mm');
    },

    sortedComments() {
      const comments = [...this.todo.comments];
      return comments.sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
    },

    subTasks() {
      return this.todo.children.length;
    },
  },

  methods: {
    toggleEdit() {
      if (this.edit) {
        if (this.title === '') {
          return;
        }

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

      this.$nextTick(() => {
        if (this.edit) {
          this.tmpTitle = this.title;
          this.tmpSubtitle = this.subtitle;
          this.$refs.titleInput.focus();
        }
      });
    },

    cancelEdit() {
      this.edit = false;
      this.title = this.tmpTitle;
      this.subtitle = this.tmpSubtitle;
      this.tmpTitle = '';
      this.tmpSubtitle = '';
    },

    completeTodo(id) {
      this.$emit('action', {
        action: 'completeTodo',
        payload: id,
      });
    },

    addSubTask() {
      if (this.subTask) {
        if (this.subTitle === '') {
          return;
        }

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
        this.subTitle = '';
        this.subSubtitle = '';
      }
      this.subTask = !this.subTask;

      this.$nextTick(() => {
        this.$refs.subtaskInput.focus();
      });
    },

    cancelSubTask() {
      this.subTask = false;
      this.subTitle = '';
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
