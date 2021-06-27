<template functional>
  <label class="checkbox-wrap" :class="{ disabled: props.disabled }">
    <input
      :value="props.value"
      :checked="props.checked"
      v-bind="attrs"
      :disabled="props.disabled"
      type="checkbox"
      v-on="listeners"
    />
    <span
      class="checkbox"
      :class="{
        'prio-2': props.priority === 2,
        'prio-1': props.priority === 1,
        'prio-0': props.priority === 0,
        round: props.round,
        large: props.large,
        outlined: props.outlined,
      }"
    />
    <slot>{{ props.label }}</slot>
  </label>
</template>

<style scoped>
/* Customize the label (the container) */
.checkbox-wrap {
  display: block;
  position: relative;
  padding-left: 25px;
  margin-bottom: 5px;
  margin-right: 10px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  width: 36px;
}

input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

input:checked ~ .checkbox {
  background-color: #a3be8c;
  border-color: #a3be8c;
}

.checkbox {
  position: absolute;
  left: 0;
  top: 3px;
  margin: 0;
  height: 18px;
  width: 18px;
  transition: background-color border-color 0.3s ease;
  @apply bg-nord-snow-1;
}

.checkbox.round {
  border-radius: 50%;
}

.checkbox.large {
  top: 0;
  height: 36px;
  width: 36px;
}

.checkbox.outlined {
  background-color: transparent;
  border: 4px solid white;
}

.checkbox.prio-0 {
  @apply border-white;
}

.checkbox.prio-1 {
  @apply border-nord-aurora-3;
}

.checkbox.prio-2 {
  @apply border-nord-aurora-1;
}

.checkbox:after {
  content: '';
  position: absolute;
  display: none;
  left: 6px;
  top: 2px;
  width: 6px;
  height: 11px;
  border: solid white;
  border-width: 0 2px 2px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

.checkbox.large:after {
  left: 9px;
  top: 3px;
  width: 10px;
  height: 18px;
  border-width: 0 4px 4px 0;
}

.checkbox-wrap:hover input ~ .checkbox {
  @apply bg-nord-aurora-4;
  transition: background-color 0.5s ease;
}

.checkbox-wrap:hover input ~ .checkbox.large {
  background-color: transparent;
  border-color: #a3be8c;
  transition: border-color 0.5s ease;
}

input:checked ~ .checkbox:after {
  display: block;
}
</style>
