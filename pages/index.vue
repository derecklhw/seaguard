<template>
  <div v-if="loading" class="loadData">
    <div class="loader"></div>
  </div>
  <div class="home-container" v-else>
    <p>Home</p>
    <!-- <pre>{{ data }}</pre> -->
    <div>
      <NuxtLink :to="localePath('about')"
        >Redirect to {{ $t("about") }} Page</NuxtLink
      >
      <br />
      <button @click="setLocale('en')">Button English</button>
      <br />
      <button @click="setLocale('fr')">Button French</button>
      <p>{{ $t("welcome") }}</p>
      <form @submit.prevent="handleFileSubmit">
        <input type="file" @change="handleFileChange" />
        <button type="submit">Upload file</button>
      </form>
    </div>
    <div v-if="!profile">
      <p>User not logged in</p>
    </div>
    <div v-else>
      <p>Profile Page</p>
      <div class="profile" v-if="profileImg">
        <img :src="profileImg" width="250" class="profile-image" />
      </div>
      <div class="initials-container" v-else>
        <div class="initials">{{ initials }}</div>
      </div>
      <div class="name">
        <h1>Welcome, {{ profile.displayName }}!</h1>
      </div>
      <div class="email">
        <h4>{{ profile.mail }}</h4>
      </div>
      <div class="username">
        <h2>{{ profile.jobTitle }}</h2>
      </div>
      <div class="phone" v-if="profile.mobilePhone">
        <h4>Phone no. : {{ profile.mobilePhone }}</h4>
      </div>
      <div class="button" @click="logout">
        <button class="logout-btn">Logout</button>
      </div>
    </div>
  </div>
</template>
<script setup>
const { locale, setLocale } = useI18n();
const localePath = useLocalePath();
const { $profileInfo, $profileImg, $logout } = useNuxtApp();
const profile = ref();
const profileImg = ref();
const loading = ref(true);
const { data } = await useFetch("/api/gemini", {
  method: "post",
  body: { message: "Hello" },
});

const logout = async () => {
  await $logout();
};
onMounted(async () => {
  loading.value = true;
  const profileInfo = await $profileInfo();
  profile.value = profileInfo;
  const { data, error } = await $profileImg();
  if (data) {
    profileImg.value = data;
  }
  if (error && profile.value) {
    getInitials();
  }
  loading.value = false;
});
const initials = ref();
const getInitials = () => {
  const nameArray = profile.value.displayName.split(" ");
  const fletter = nameArray[0].charAt(0);
  const lletter = nameArray[1].charAt(0);
  initials.value = fletter + lletter;
};

const files = ref(null);
const handleFileChange = (event) => {
  files.value = event.target.files;
};

const handleFileSubmit = async () => {
  const fd = new FormData();
  if (files.value) {
    fd.append(`index`, files.value[0]);
  }
  // const data = await $fetch("/api/extract-text-from-document", {
  //   method: "POST",
  //   body: fd,
  // });
  const data = await $fetch("/api/extract-text-from-license", {
    method: "POST",
    body: fd,
  });
  console.log(data);
};
</script>
<style lang="scss" scoped>
h1 {
  color: $primary;
}
</style>
