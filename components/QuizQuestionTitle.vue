<template>
  <div
    class="transition-opacity duration-1000 w-full flex flex-col items-center justify-center gap-4 min-h-20"
  >
    <div
      v-if="!currentQuestion"
      class="w-2/4 h-6 bg-gray-200 rounded-full animate-pulse"
    />
    <div
      v-if="currentQuestion"
      class="text-lg md:text-2xl font-bold"
      v-html="currentQuestion.question"
    />
    <div
      v-if="!currentQuestion"
      class="w-full animate-pulse flex flex-col items-center justify-center gap-2"
    >
      <div class="w-full h-8 bg-gray-200 rounded-full" />
      <div class="w-10/12 h-8 bg-gray-200 rounded-full" />
    </div>
  </div>
</template>
<script setup>
defineProps(["currentQuestion"]);
</script>
