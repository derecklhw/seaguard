<template>
  <div id="app">
    <!-- <h1>Camera Component Demo</h1>
    <AppCamera @photo-clicked="onPhotoClicked" />
    <img v-if="photoData" :src="photoData" alt="Captured Image" /> -->
    <WebCamUI :fullscreenState="false" @photoTaken="photoTaken" />
  </div>
</template>

<script>
import { WebCamUI } from "vue-camera-lib";
export default {
  components: {
    WebCamUI,
  },
  data() {
    return {
      photoData: null,
    };
  },
  methods: {
    photoTaken(data) {
      console.log("image blob: ", data.blob);
      console.log("image data url", data.image_data_url);
    },
  },
};
</script>

<style scoped></style>
