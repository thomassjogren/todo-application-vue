<template>
  <transition name="fade">
    <div v-show="open" class="base-modal">
      <div v-if="overlay" class="base-modal__overlay" @click="clickOutside && close()" />
      <transition name="fade">
        <div v-if="open" class="base-modal__container" :style="computedStyles">
          <div class="base-modal__content">
            <button v-if="closeButton" class="btn close-button" @click.stop="close">
              <i class="fa fa-times" />
            </button>
            <h4 v-if="$slots.title" class="base-modal__title">
              <slot name="title" />
            </h4>
            <slot />
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'BaseModal',

  props: {
    open: {
      type: Boolean,
      default: false,
    },

    overlay: {
      type: Boolean,
      default: true,
    },

    maxWidth: {
      type: String,
      default: '800px',
    },

    maxHeight: {
      type: String,
      default: '75%',
    },

    overflow: {
      type: String,
      default: 'auto',
    },

    boxPadding: {
      type: String,
      default: '15px',
    },

    closeButton: {
      type: Boolean,
      default: false,
    },

    borderRadius: {
      type: String,
      default: '0',
    },

    clickOutside: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    computedStyles() {
      return {
        'max-width': this.maxWidth,
        'max-height': this.maxHeight,
        'border-radius': this.borderRadius,
        padding: this.boxPadding,
        overflow: this.overflow,
      };
    },
  },

  watch: {
    open(val) {
      this.toggleModal(val);
    },
  },

  methods: {
    close() {
      this.$emit('hide');
    },

    toggleModal(val) {
      if (val) {
        document.querySelector('body').classList.add('modal-open');
        return;
      }
      document.querySelector('body').classList.remove('modal-open');
    },
  },
};
</script>

<style scoped>
.base-modal {
  align-items: flex-start;
  display: flex;
  bottom: 0;
  justify-content: center;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1050;
}

.base-modal__overlay {
  background-color: rgba(0, 0, 0, 0.3);
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1050;
}

.base-modal__container {
  background-color: #ffffff;
  border-radius: 4px;
  max-width: 800px;
  min-height: auto;
  position: relative;
  top: 60px;
  width: 100%;
  z-index: 1051;
}

.base-modal__content h4 {
  margin-top: 0;
}

.base-modal__title {
  margin-top: 0;
  margin-bottom: 15px;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s;
}

.slide-up-enter,
.slide-up-leave-to {
  transform: translateY(100%);
}

.slide-up-enter-to,
.slide-up-leave {
  transform: translateY(0);
}

.close-button {
  background-color: transparent;
  border: none;
  color: #cbcbcb;
  font-size: 22px;
  height: 26px;
  line-height: 1;
  margin: 0;
  padding: 0;
  position: absolute;
  right: 8px;
  text-shadow: none;
  top: 8px;
  transition: color 0.2s;
  width: 26px;
  z-index: 100;
}

.close-button:hover,
.close-button:focus {
  border: none;
  color: #7f7f7f;
  transition: color 0.2s;
}
</style>
