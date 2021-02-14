<template functional>
  <label class="checkbox-wrap" :class="{ disabled: props.disabled }">
    <input
      :value="props.value"
      :checked="props.checked"
      v-bind="attrs"
      :disabled="props.disabled"
      type="checkbox"
      v-on="{ ...listeners, input: $event => listeners.input($event.target.checked) }"
    />
    <span
      class="checkbox"
      :class="{
        'prio-2': props.priority === '2',
        'prio-1': props.priority === '1',
        'prio-0': props.priority === '0',
      }"
    />
    {{ props.label }}
  </label>
</template>

<style lang="scss" scoped>
/* Customize the label (the container) */
.checkbox-wrap {
  display: block;
  position: relative;
  padding-left: 25px;
  margin-bottom: 12px;
  margin-right: 10px;
  cursor: pointer;
  font-size: 14px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  width: 36px;

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;

    &:checked ~ .checkbox {
      background-color: #a3be8c;
      border-color: #a3be8c;
    }
  }

  .checkbox {
    position: absolute;
    left: 0;
    margin: 0;
    height: 36px;
    width: 36px;
    border: 4px solid;
    border-radius: 50%;
    transition: background-color border-color 0.3s ease;

    &.prio-0 {
      @apply border-white;
    }

    &.prio-1 {
      @apply border-nord-aurora-3;
    }

    &.prio-2 {
      @apply border-nord-aurora-1;
    }

    &:after {
      content: '';
      position: absolute;
      display: none;
      left: 9px;
      top: 3px;
      width: 10px;
      height: 18px;
      border: solid white;
      border-width: 0 4px 4px 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
    }
  }

  &:hover input ~ .checkbox {
    border-color: #a3be8c;
    transition: border-color 0.3s ease;
  }

  input:checked ~ .checkbox:after {
    display: block;
  }
}
</style>
