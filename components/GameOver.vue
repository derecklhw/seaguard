<template>
  <div
    class="quiz-card z-0 relative w-full max-w-[500px] bg-white rounded-3xl p-8 mb-6 text-center flex flex-col items-center justify-center gap-8 shadow-xl hover:shadow-2xl"
  >
    <div class="flex flex-col items-center justify-center gap-4 min-h-[50vh]">
      <div class="font-semibold text-xl">Congratulations!!!</div>
      <div
        class="text-3xl font-bold inline-flex flex-row items-center justify-center flex-wrap gap-2"
      >
        You won
        <span
          class="text-primary inline-flex flex-row items-center justify-center gap-1"
          >{{ props.userScore * 10 }}</span
        >
        points
      </div>
    </div>
  </div>
  <Button
    @click="reloadNuxtApp()"
    class="w-full max-w-[250px] text-sm font-semibold flex flex-col items-center justify-center self-center min-h-[50px] rounded-full px-4 text-primary-foreground shadow-xl hover:shadow-2xl"
  >
    Play Again
  </Button>
</template>
<script setup>
import { onMounted } from "vue";
import confetti from "canvas-confetti";
const store = useQuizStore();
const props = defineProps(["userScore"]);

onMounted(() => {
  store.userCredits += props.userScore * 10;
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    // since particles fall down, start a bit higher than random
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    );
  }, 250);
});
</script>
