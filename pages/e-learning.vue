<template>
  <div>
    <div class="main-body-container">
      <video autoplay muted loop id="background-video">
        <source src="/videos/background_e-learning.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div class="video-overlay"></div>

      <div class="content">
        <div class="text-section-container">
          <!-- Left aligned text section, 40% width -->
          <div class="text-section" style="flex: 0 0 40%; text-align: left">
            <h1>{{ $t("main_text_e-learning") }}</h1>
          </div>
          <!-- Right aligned text section, 60% width -->
          <div class="text-section" style="flex: 0 0 60%; margin-right: auto">
            <p>{{ $t("main_text_e-learning") }}</p>
          </div>
        </div>
      </div>
    </div>
    <div
      class="content"
      style="height: 10vh; margin-top: 10px; justify-content: center"
    >
      <div class="circle-item">
        <div
          class="circle"
          style="background: linear-gradient(135deg, #3778b5, #143f7a)"
        >
          <IconVideoCam />
        </div>
        <div class="circle-text">{{ videoCount }}+ videos</div>
        <div class="circle-text"></div>

        <div
          class="circle"
          style="background: linear-gradient(135deg, #3778b5, #42536d)"
        >
          <IconUsers />
        </div>
        <div class="circle-text">{{ userCount }}+ Users</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  setup() {
    const userCount = ref(0);
    const videoCount = ref(0); // You can also fetch this value similarly

    onMounted(async () => {
      try {
        const response = await fetch("/api/users-count");
        const data = await response.json();
        console.log(data);
        if (data.success) {
          // Extracting the user count from the response
          userCount.value = data.message.recordsets[0][0][""] || 0; // Adjust based on the actual structure
        } else {
          console.error("Error fetching user count:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
      try {
        const response = await fetch("/api/video-count");
        const data = await response.json();
        console.log(data);
        if (data.success) {
          // Extracting the video count from the response
          videoCount.value = data.message.recordsets[0][0][""] || 0; // Adjust based on the actual structure
        } else {
          console.error("Error fetching vide count:", data.message);
        }
      } catch (error) {
        console.error("Error fetching video count:", error);
      }
    });

    return {
      userCount,
      videoCount,
    };
  },
};
</script>

<!-- Import the CSS from assets -->
<style src="@/assets/e-learning.css"></style>
