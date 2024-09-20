<template>
  <div>
    <ClientOnly>
      <WebCamUI
        v-if="cameraActive"
        :fullscreen-state="true"
        @photo-taken="photoTaken"
        @fullscreen="handleFullscreenEvent"
      />
    </ClientOnly>
    <Button class="w-full" :disabled="disableButton" @click="toggleCamera"
      >Take Photo</Button
    >
  </div>
</template>

<script setup>
import { WebCamUI } from "vue-camera-lib";

const cameraActive = ref(false);

const props = defineProps(["type", "disableButton"]);
const emit = defineEmits(["photoAnalysis"]);

const toggleCamera = () => {
  cameraActive.value = !cameraActive.value;
};

const photoTaken = (data) => {
  emit("photoAnalysis", { extracting: true });
  const model =
    props.type === "license" ? "MruBoatLicenseModel" : "prebuilt-layout";

  const fd = new FormData();
  if (data.blob && data.image_data_url) {
    fd.append("index", data.image_data_url);
    fd.append("isPhotoTaken", "true");
    fd.append("model", model);
  }

  $fetch("/api/extract-text-from-document", {
    method: "POST",
    body: fd,
  }).then((response) => {
    emit("photoAnalysis", { extracting: false, response });
  });
};

const handleFullscreenEvent = (currentState) => {
  if (!currentState) {
    cameraActive.value = false;
  }
};
</script>

<style scoped></style>
