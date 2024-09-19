<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  DateFormatter,
  type DateValue,
  getLocalTimeZone,
  parseDate,
  today,
  CalendarDate
} from '@internationalized/date'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '../lib/utils'

const props = defineProps<{
  modelValue: string
  required?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const df = new DateFormatter('en-US', { dateStyle: 'long' })
const internalDate = ref<CalendarDate | undefined>(props.modelValue ? parseDate(props.modelValue) : undefined)

watch(internalDate, (newValue) => {
  if (newValue) {
    emit('update:modelValue', newValue.toString())
  } else {
    emit('update:modelValue', '')
  }
})

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    internalDate.value = parseDate(newValue) as CalendarDate
  } else {
    internalDate.value = undefined
  }
})

const handleDateSelect = (date: DateValue | undefined) => {
  internalDate.value = date as CalendarDate | undefined
}

</script>

<template>
  <div>
    <Popover>
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          :class="cn(
            'w-[280px] justify-start text-left font-normal h-9 border-2 border-gray-500',
            !internalDate && 'text-muted-foreground'
          )"
          :aria-required="required"
        >
          <CalendarIcon class="mr-4 h-4 w-4" />
          {{ internalDate ? df.format(internalDate.toDate(getLocalTimeZone())) : $t('datepicker.pick_time') }}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0 ">
        <Calendar 
          :selected-date="internalDate"
          :disabled-dates="{ before: today(getLocalTimeZone()) }"
          :mode="'single'"
          @update:model-value="handleDateSelect"
          initial-focus 
        />
      </PopoverContent>
    </Popover>
  </div>
</template>