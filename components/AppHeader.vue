<template>
  <div class="bg-red-400">
    <p>header start</p>
    <div v-if="profile">
      <p>{{ profile.displayName }}</p>
      <div class="button" @click="logout">
        <button class="logout-btn">Logout</button>
      </div>
    </div>
    <div v-else class="button">
      <button class="btn" @click="loginUser">
        Click to login with Microsoft 365
      </button>
    </div>
    <p>header end</p>
  </div>
</template>
<script setup>
const { $login, $profileInfo, $logout } = useNuxtApp();
const profile = ref();

onMounted(async () => {
  const profileInfo = await $profileInfo();
  profile.value = profileInfo;
});

const loginUser = async () => {
  clearSiteData();
  const loginResponse = await $login();
  if (loginResponse) reloadNuxtApp();
};
const logout = async () => {
  await $logout();
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
