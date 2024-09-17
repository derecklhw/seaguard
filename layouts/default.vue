<template>
  <div v-if="!loading">
    <AppHeader />
    <slot />
    <AppFooter />
  </div>
  <div v-else>
    <div class="flex items-center justify-center h-screen">
      <IconSpinner class="size-24" />
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
