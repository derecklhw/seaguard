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
  console.log(loading.value);
  const profileInfo = await $profileInfo();
  console.log(profileInfo);
  store.setProfile(profileInfo);
  loading.value = false;
  console.log(loading.value);
});
</script>
