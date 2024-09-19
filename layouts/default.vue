<template>
  <div v-if="!loading" class="min-h-screen flex flex-col">
    <AppHeader class="flex-none" />
    <div class="flex-1">
      <slot />
    </div>
    <AppFooter class="flex-none" />
  </div>
  <div v-else>
    <div class="flex items-center justify-center h-screen">
      <IconSpinner class="size-20 text-primary" />
    </div>
  </div>
</template>
<script setup>
const { $profileInfo } = useNuxtApp();

const store = useProfileStore();
const loading = ref(true);

onMounted(async () => {
  const profileInfo = await $profileInfo();
  store.setProfile(profileInfo);
  loading.value = false;
});
</script>
