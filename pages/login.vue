<template>
  <ClientOnly>
    <div
      class="h-screen flex flex-col justify-center items-center relative overflow-hidden"
    >
      <video
        autoplay
        muted
        loop
        class="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/background_e-learning.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div class="z-10 flex flex-col justify-center items-center">
        <div class="image">
          <img src="/images/logo.png" class="size-48" />
        </div>

        <div class="my-10">
          <Button @click="loginUser" size="lg" class="text-xl">
            Click to login with Email
          </Button>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>
<script setup>
const { $login } = useNuxtApp();
definePageMeta({
  layout: false,
});
const loginUser = async () => {
  clearSiteData();
  const loginResponse = await $login();
  if (loginResponse) navigateTo("/");
};
function clearSiteData() {
  document.cookie.split(";").forEach((cookie) => {
    const [name, _] = cookie.split("=").map((c) => c.trim());
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
  localStorage.clear();
  sessionStorage.clear();
}
</script>
