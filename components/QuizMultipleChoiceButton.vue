<template>
  <button
    :class="{ 'pointer-events-none': pauseControls }"
    class="quiz-multiple-choice-button w-full text-sm flex flex-col items-center justify-center min-h-[50px] rounded-full px-4 border bg-white border-gray-500 hover:bg-primary hover:border-primary hover:text-white active:bg-primary active:border-primary active:text-white"
  >
    <span v-html="props.item"></span>
  </button>
</template>
<script setup>
const props = defineProps(["item"]);
</script>
<style lang="scss">
.quiz-multiple-choice-button {
  &.thinking {
    color: white;
    pointer-events: none;
    animation: thinking-pulse 1000ms infinite alternate;
  }
  &.correct {
    color: white;
    pointer-events: none;
    animation: correct-pulse 500ms infinite alternate;
  }
  &.incorrect {
    color: white;
    pointer-events: none;
    animation: incorrect-pulse 500ms infinite alternate;
  }
}
@keyframes thinking-pulse {
  0% {
    border-color: #4e6d98;
    background-color: #4e6d98;
  }
  100% {
    border-color: #9ca3af;
    background-color: #9ca3af;
  }
}
@keyframes correct-pulse {
  0% {
    border-color: #65a30d;
    background-color: #65a30d;
  }
  100% {
    border-color: #84cc16;
    background-color: #84cc16;
  }
}
@keyframes incorrect-pulse {
  0% {
    border-color: rgb(185 28 28 / 1);
    background-color: rgb(185 28 28 / 1);
  }
  100% {
    border-color: rgb(239 68 68 / 1);
    background-color: rgb(239 68 68 / 1);
  }
}
</style>
