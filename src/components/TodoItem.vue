<template>
  <li class="overflow-hidden my-6" :class="{ 'pb-2': expanded }">
    <div class="flex mb-1" :class="{ 'mb-0': expanded }">
      <Checkbox
        :checked="todo.completed"
        :priority="todo.priority"
        :round="true"
        :large="true"
        :outlined="true"
        @click="completeTodo(todo.id)"
      />
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
      <div v-if="subTasks.total" class="text-gray-500 flex items-center mr-2 text-sm">
        Tasks {{ subTasks.completed }} / {{ subTasks.total }}
      </div>
      <button
        v-if="!edit"
        class="action-button relative text-2xl flex items-center"
        title="Expand todo"
        @click="expanded = !expanded"
      >
        <i
          class="fas fa-angle-down h-8 hover:text-nord-frost-3 relative top-1"
          :class="{ 'fa-expand-alt': !expanded, 'fa-compress-alt': expanded }"
        />
      </button>
    </div>

    <SlideDownTranstion>
      <div v-if="expanded" ref="drawer" :style="drawerHeight">
        <div class="flex justify-end  items-center px-3 mt-4">
          <div class="ml-3 cursor-pointer" title="Normal priority" @click="updatePriority(0)">
            <i class="fas fa-exclamation" />
          </div>
          <div class="ml-3 cursor-pointer text-nord-aurora-3" title="Medium priority" @click="updatePriority(1)">
            <i class="fas fa-exclamation" /><i class="fas fa-exclamation" />
          </div>
          <div class="ml-3 cursor-pointer text-nord-aurora-1" title="High priority" @click="updatePriority(2)">
            <i class="fas fa-exclamation" /><i class="fas fa-exclamation" /><i class="fas fa-exclamation" />
          </div>
          <div class="text-xl ml-4">
            <button class="action-button" title="Delete todo" @click="deleteTodo(todo.id)">
              <i class="fas fa-trash-alt" />
            </button>
          </div>
        </div>

        <div class="ml-46 mb-6">
          <div class="text-xl font-bold">
            Subtasks
            <span v-if="subTasks.total" class="text-gray-500 text-sm"
              >{{ subTasks.completed }} / {{ subTasks.total }}</span
            >
          </div>
          <div class="mt-3">
            <ul>
              <li v-for="subtask in todo.children" :key="subtask.id" class="mb-1 flex justify-between items-start px-3">
                <div class="flex items-top">
                  <Checkbox :checked="subtask.completed" @click="completeTodo(subtask.id)">
                    {{ subtask.title }}
                  </Checkbox>
                </div>
                <button class="action-button" title="Delete subtask" @click="deleteTodo(subtask.id)">
                  <i class="fas fa-times" />
                </button>
              </li>
            </ul>
            <div v-if="subTask" class="flex px-3">
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
              <button class="ml-2 action-button" title="Add sub task" @click="addSubTask">
                <i class="fas fa-plus" />
              </button>
              <button class="ml-2 action-button" title="Cancel" @click="cancelSubTask">
                <i class="fas fa-times" />
              </button>
            </div>
            <button
              v-else
              class="text-gray-500 pl-3 hover:text-nord-frost-3 border-b border-transparent transition-colors duration-500"
              title="Add subtask"
              @click="addSubTask"
            >
              <i class="fas fa-plus" /> Add subtask
            </button>
          </div>
        </div>

        <div class="ml-46 my-6">
          <div class="text-xl font-bold mt-4">Comments</div>
          <div
            v-for="comment in sortedComments"
            :key="comment.id"
            class="px-3 py-2 bg-nord-4 rounded-md my-3 flex flex-col"
          >
            <div class="text-gray-500 flex justify-between">
              {{ formatDate(comment.timestamp) }}
              <button
                title="Delete comment"
                class="action-button relative border-r border-transparent"
                @click="deleteComment(comment.id)"
              >
                <i class="fas fa-times" />
              </button>
            </div>
            {{ comment.content }}
          </div>
          <div class="relative mt-3">
            <input
              v-model="commentContent"
              class="inline-input border py-2 px-4 rounded-md"
              placeholder="Add a comment"
              @keyup.enter="addComment"
            />
            <button
              class="absolute right-3 top-2 text-gray-500"
              :class="{ 'text-nord-frost-3': commentContent !== '' }"
              title="Add comment"
              @click="addComment"
            >
              <i class="fas fa-plus" />
            </button>
          </div>
        </div>
      </div>
    </SlideDownTranstion>
  </li>
</template>

<script>
import format from 'date-fns/format';
import Checkbox from '@/components/Checkbox';
import SlideDownTranstion from '@/components/SlideDownTranstion';

export default {
  name: 'TodoItem',

  components: {
    Checkbox,
    SlideDownTranstion,
  },

  props: {
    todo: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      expanded: false,
      edit: false,
      subTask: false,

      title: this.todo.title,
      subtitle: this.todo.subtitle,

      tmpTitle: '',
      tmpSubtitle: '',

      subTitle: '',

      commentContent: '',

      expandedHeight: false,
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
      if (this.todo.children.length) {
        return {
          completed: this.todo.children.filter(t => t.completed).length,
          total: this.todo.children.length,
        };
      }
      return false;
    },

    drawerHeight() {
      if (!this.expandedHeight) {
        return;
      }
      return `height: ${this.expandedHeight}`;
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

      if (this.edit) {
        this.$nextTick(() => {
          this.tmpTitle = this.title;
          this.tmpSubtitle = this.subtitle;
          this.$refs.titleInput.focus();
        });
      }
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
        this.expandedHeight = `${this.$refs.drawer.scrollHeight + 33}px`;
        this.subTitle = '';
        this.subSubtitle = '';
      }
      this.subTask = !this.subTask;

      if (this.subTask) {
        this.$nextTick(() => {
          this.$refs.subtaskInput.focus();
        });
      }
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
        this.expandedHeight = `${this.$refs.drawer.scrollHeight + 76}px`;
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
      if (this.expanded) {
        this.expandedHeight = `${this.$refs.drawer.scrollHeight - 33}px`;
      }
    },

    deleteComment(id) {
      this.$emit('action', {
        action: 'deleteComment',
        payload: id,
      });
      this.expandedHeight = `${this.$refs.drawer.scrollHeight - 76}px`;
    },

    updatePriority(priority) {
      this.$emit('action', {
        action: 'updatePriority',
        payload: {
          id: this.todo.id,
          priority,
        },
      });
    },
  },
};
</script>
