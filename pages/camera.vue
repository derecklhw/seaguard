<template>
  <div id="app">
    <ClientOnly>
      <WebCamUI :fullscreen-state="false" @photo-taken="photoTaken" />
    </ClientOnly>
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
    async photoTaken(data) {
      const fd = new FormData();
      if (data.blob && data.image_data_url) {
        fd.append("index", data.image_data_url);
        fd.append("isPhotoTaken", "true");
        fd.append("model", "prebuilt-layout"); // prebuilt-layout, MruBoatLicenseModel
      }

      const response = await $fetch("/api/extract-text-from-document", {
        method: "POST",
        body: fd,
      });
      console.log(response);
    },
  },
};
</script>

<style scoped></style>
