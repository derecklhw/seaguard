<template>
  <div>
    <label :for="id">{{ label }}</label>
    <select :id="id" v-model="selectedTime" required>
      <option v-for="time in timeOptions" :key="time" :value="time">{{ formatTime(time) }}</option>
    </select>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  id: String,
  label: String,
  start: String, 
  end: String,
  step: Number, 
  modelValue: String 
});

const emit = defineEmits(["update:modelValue"]);
const selectedTime = ref(props.modelValue);

const timeOptions = computed(() => {
  const times = [];
  let [hour, minute] = props.start.split(":").map(Number);
  const [endHour, endMinute] = props.end.split(":").map(Number);
  
  while (hour < endHour || (hour === endHour && minute <= endMinute)) {
    times.push(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
    minute += props.step;
    if (minute >= 60) {
      minute -= 60;
      hour += 1;
    }
  }
  return times;
});

const formatTime = (time) => {
  const [hour, minute] = time.split(":").map(Number);
  const period = hour >= 12 ? "PM" : "AM";
  const adjustedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${adjustedHour}:${minute.toString().padStart(2, "0")} ${period}`;
};

watch(selectedTime, (newValue) => {
  emit("update:modelValue", newValue);
});
</script>
