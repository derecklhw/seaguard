<template>
  <div>
    <div
      class="select-none p-8 min-h-screen overflow-hidden flex flex-col items-center justify-start bg-cover bg-fixed bg-no-repeat bg-center"
      style="
        background-image: radial-gradient(
            circle,
            rgba(0, 0, 0, 0.6),
            transparent
          ),
          url('/images/quiz_background.png');
      "
    >
      <h1 class="text-5xl font-bold text-primary-foreground">Quiz</h1>
      <div class="w-full max-w-[500px] flex flex-col gap-4">
        <div class="w-full flex flex-row h-12 items-center">
          <IconArrowBack
            class="cursor-pointer text-white"
            @click="reloadNuxtApp({ path: localePath('/') })"
          />
        </div>
        <GameOver v-if="gameover" :user-score="store.userScore" />
        <div
          v-if="!gameover"
          class="quiz-card z-0 relative md:w-full max-w-[500px] bg-white rounded-3xl p-8 mb-6 text-center flex flex-col items-center justify-center gap-8 shadow-xl hover:shadow-2xl"
        >
          <div class="w-full flex flex-row items-center justify-between">
            <div
              class="flex flex-row items-center justify-start gap-2 min-w-[75px] w-[75px]"
            >
              <IconBaselineHelp
                class="ri-question-fill text-gray-600 -mt-[2px] size-6"
              /><span class="text-gray-600"
                >{{ store.currentQuestion + 1 }}/{{ store.questionCount }}</span
              >
            </div>
            <div
              class="flex flex-row items-center justify-end gap-2 min-w-[75px] w-[75px]"
            >
              <IconFamilyStar
                class="ri-star-fill text-yellow-500 -mt-[2px] size-6"
              /><span class="text-gray-600">{{ store.userScore }}</span>
            </div>
          </div>
          <QuizTimer :countdown="countdown" />
          <QuizQuestionTitle
            :current-question="store.trivia[store.currentQuestion]"
          />
          <div
            :class="{
              'pointer-events-none': pauseControls,
            }"
            class="w-full flex flex-col items-center justify-center gap-4 min-h-36 md:min-h-56"
          >
            <QuizMultipleChoiceButton
              :item="item"
              v-for="(item, index) in store.quizAnswers ? store.quizAnswers : 4"
              :key="index"
              :id="item"
              @click="evaluateAnswer(item)"
            />
          </div>
        </div>
      </div>
      <p class="mt-8 text-center text-md text-white">
        Built with ❤️ by Prompt Engineers
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import confetti from "canvas-confetti";
import Swal from "sweetalert2";

definePageMeta({
  layout: false,
});

const localePath = useLocalePath();
const store = useQuizStore();

const loading = ref(false);
const pauseControls = ref(false);
const countdown = ref(10);
const selectedAnswer = ref(null);
const gameover = ref(false);

let timer = null;

const startTimer = () => {
  timer = setInterval(() => {
    countdown.value--;
  }, 1000);
};

const stopTimer = () => {
  clearInterval(timer);
};

const restartTimer = () => {
  countdown.value = 10;
  startTimer();
};

const updateProgress = () => {
  const circle = document.querySelector(".progress-ring__circle");
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (countdown.value / 10) * circumference;
  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = offset;
};

const loadNextQuestion = () => {
  // Check for Game Over
  if (store.currentQuestion === store.questionCount - 1) {
    // Finished all questions
    stopTimer();
    pauseControls.value = true;
    gameover.value = true;
  } else {
    // Prepare then Load next question
    store.currentQuestion++;
    bundleAnswers();
  }
};

const bundleAnswers = () => {
  // Fetch, merge and shuffle the answers
  const quizShuffledAnswers = store.trivia[
    store.currentQuestion
  ].incorrect_answers.concat(
    store.trivia[store.currentQuestion].correct_answer
  );
  quizShuffledAnswers.sort(() => Math.random() - 0.5);
  store.quizAnswers = quizShuffledAnswers;

  // Assign the correct answer to a reactive state
  store.quizCorrectAnswer = store.trivia[store.currentQuestion].correct_answer;

  loading.value = false;
  pauseControls.value = false;

  // Begin playing
  restartTimer();
};

const evaluateAnswer = async (item) => {
  if (!pauseControls.value) {
    // Pause Game
    stopTimer();
    selectedAnswer.value = item;
    pauseControls.value = true;

    // Check the Answer
    const selectedButton = document.getElementById(item);
    if (selectedAnswer.value == store.quizCorrectAnswer) {
      // Correct Answer
      selectedButton.classList.add("correct");
      confetti({
        particleCount: 150,
        spread: 360,
        ticks: 60,
        zIndex: 10,
        startVelocity: 30,
      });
      store.userScore++;
      setTimeout(() => {
        selectedButton.classList.remove("correct");
      }, 3000);
    } else {
      // Wrong Answer
      selectedButton.classList.add("incorrect");
      setTimeout(() => {
        selectedButton.classList.remove("incorrect");
      }, 3000);
    }

    // Load Next Question
    setTimeout(() => {
      // Prepare then Load next question
      loadNextQuestion();
    }, 3000);
  }
};

onMounted(async () => {
  await store
    .getQuestions()
    .then(bundleAnswers)
    .catch(() => {
      Swal.fire({
        icon: "info",
        title: "Notice",
        text: "Error generating the questions.",
        confirmButtonText: "OK",
      }).then(() => {
        reloadNuxtApp();
      });
    });
});

onBeforeRouteLeave(() => {
  store.quizCorrectAnswer = "";
  store.quizAnswers = [];
  store.currentQuestion = 0;
});

onUnmounted(stopTimer);

watch(countdown, (newVal) => {
  if (newVal < 0) {
    stopTimer();
    // Ran out of time on a question!
    loadNextQuestion();
  }
  // Keep the timer element updated and in-sync with the countdown
  updateProgress();
});
</script>
<style lang="scss" scoped>
.quiz-card {
  &:before {
    content: "";
    z-index: -1;
    position: absolute;
    left: 1.5rem;
    right: 1.5rem;
    bottom: -1.5rem;
    top: 0;
    opacity: 0.25;
    background-color: white;
    border-radius: 1.5rem;
  }
  &:after {
    content: "";
    z-index: -1;
    position: absolute;
    left: 0.75rem;
    right: 0.75rem;
    bottom: -0.75rem;
    top: 0;
    opacity: 0.5;
    background-color: white;
    border-radius: 1.5rem;
  }
}
</style>
