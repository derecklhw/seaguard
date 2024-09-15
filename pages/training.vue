<template>
  <div class="main-body-container">

    <video autoplay muted loop id="background-video">
      <source src="/video/Background_training.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    <div class="video-overlay"></div>


    <div class="content">
    <div class="text-section-container">
      <!-- Left aligned text section, 40% width -->
      <div class="text-section" style="flex: 0 0 40%; text-align: left;">
        <h1>{{ $t('main_text_training') }}</h1>
      </div>
      <!-- Right aligned text section, 60% width -->
      <div class="text-section" style="flex: 0 0 60%; margin-right: auto;">
        <p>{{ $t('main_text_training') }}</p>
      </div>
    </div>
   </div>

  </div>
  <div class="content" style="height: 10vh;margin-top: 10px;justify-content: center; ">
  <div class="circle-item">
      <div class="circle" style="background: linear-gradient(135deg, #3778b5, #143f7a);">
        <svg xmlns="http://www.w3.org/2000/svg" width="20vh" height="4vh" viewBox="0 0 576 512">
         <path fill="#ffffff" d="M336.2 64H47.8C21.4 64 0 85.4 0 111.8v288.4C0 426.6 21.4 448 47.8 448h288.4c26.4 0 47.8-21.4 47.8-47.8V111.8c0-26.4-21.4-47.8-47.8-47.8m189.4 37.7L416 177.3v157.4l109.6 75.5c21.2 14.6 50.4-.3 50.4-25.8V127.5c0-25.4-29.1-40.4-50.4-25.8"/>
        </svg>
      </div>
      <div class="circle-text">{{ videoCount }}+ videos</div>
      <div class="circle-text"></div>

      <div class="circle" style="background: linear-gradient(135deg, #3778b5, #42536d);">
        <svg xmlns="http://www.w3.org/2000/svg" width="21vh" height="4vh" viewBox="0 0 640 512">
          <path fill="#ffffff" d="M192 256c61.9 0 112-50.1 112-112S253.9 32 192 32S80 82.1 80 144s50.1 112 112 112m76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C51.6 288 0 339.6 0 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2M480 256c53 0 96-43 96-96s-43-96-96-96s-96 43-96 96s43 96 96 96m48 32h-3.8c-13.9 4.8-28.6 8-44.2 8s-30.3-3.2-44.2-8H432c-20.4 0-39.2 5.9-55.7 15.4c24.4 26.3 39.7 61.2 39.7 99.8v38.4c0 2.2-.5 4.3-.6 6.4H592c26.5 0 48-21.5 48-48c0-61.9-50.1-112-112-112"/>
        </svg>
      </div>
      <div class="circle-text">{{ userCount }}+ Users</div>
  </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const userCount = ref(0);
    const videoCount = ref(0); // You can also fetch this value similarly

    onMounted(async () => {
      try {
        const response = await fetch("/api/userscount");
        const data = await response.json();
        console.log(data);
        if (data.success) {
          // Extracting the user count from the response
          userCount.value = data.message.recordsets[0][0][""] || 0; // Adjust based on the actual structure
        } else {
          console.error('Error fetching user count:', data.message);
        }
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
      try {
        const response = await fetch("/api/videocount");
        const data = await response.json();
        console.log(data);
        if (data.success) {
          // Extracting the user count from the response
          videoCount.value = data.message.recordsets[0][0][""] || 0; // Adjust based on the actual structure
        } else {
          console.error('Error fetching videoCount:', data.message);
        }
      } catch (error) {
        console.error('Error fetching videoCount:', error);
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
<style src="@/assets/training.css"></style>