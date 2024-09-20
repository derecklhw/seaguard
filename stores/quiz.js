import { defineStore } from "pinia";

export const useQuizStore = defineStore("quiz", {
  state: () => ({
    trivia: [],
    questionCount: 10,
    currentQuestion: 0,
    quizAnswers: [],
    quizCorrectAnswer: "",
    userScore: 0,
    userCredits: 0,
    difficulty: "medium",
  }),
  actions: {
    async getQuestions() {
      const documents = await $fetch("/api/get-documents");
      const randomDocument =
        documents.message.recordset[
          Math.floor(Math.random() * documents.message.recordset.length)
        ];
      const document = randomDocument.Content;
      const response = await $fetch("/api/gemini", {
        method: "POST",
        body: {
          document,
          prompt: `Generate ${this.questionCount} multiple-choice questions and answers in JSON format based on the provided text. Each question should have four options (one correct and three incorrect answers). Please provide the JSON output with each question-answer pair structured as:
                    {
                      "question": "Question text",
                      "correct_answer": "Correct Option",
                      "incorrect_answers": ["Option 1", "Option 2", "Option 3"],
                      "difficulty": ${this.difficulty},
                      "type": "multiple"
                    }
                    Provided Text: ${document}
                    `,
        },
      });
      this.trivia = JSON.parse(response.message);
    },
  },
  getters: {
    // BEWARE: getter names cannot be same as state props!
    triviaAPI(state) {
      return state.trivia.length;
    },
    adpsFilteredLength(state) {
      return (query) =>
        state.trivia.filter((triviaItem) => triviaItem.estado_cd === query)
          .length;
    },
  },
});
