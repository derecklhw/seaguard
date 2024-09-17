<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const props = defineProps<{
  id: string
  label: string
  start: string
  end: string
  step: number
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const selectedTime = ref(props.modelValue)

const timeOptions = computed(() => {
  const times = []
  let [hour, minute] = props.start.split(':').map(Number)
  const [endHour, endMinute] = props.end.split(':').map(Number)
  
  while (hour < endHour || (hour === endHour && minute <= endMinute)) {
    times.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`)
    minute += props.step
    if (minute >= 60) {
      minute -= 60
      hour += 1
    }
  }
  return times
})

const formatTime = (time: string) => {
  const [hour, minute] = time.split(':').map(Number)
  const period = hour >= 12 ? 'PM' : 'AM'
  const adjustedHour = hour % 12 === 0 ? 12 : hour % 12
  return `${adjustedHour}:${minute.toString().padStart(2, '0')} ${period}`
}

watch(selectedTime, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>

<template>
  <div class="w-full">
    <Select v-model="selectedTime">
      <SelectTrigger :id="id" class="w-full border-2 border-gray-500 w-40 h-9">
        <SelectValue :placeholder="label" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem v-for="time in timeOptions" :key="time" :value="time">
            {{ formatTime(time) }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
</template>