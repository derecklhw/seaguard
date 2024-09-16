<template>
  <div>
    <div class="main-body-container">
      <!-- Background video -->
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

    <div class="content" style="height: 10vh; margin-top: 10px; justify-content: center">
      <div class="circle-item">
        <div class="circle" style="background: linear-gradient(135deg, #3778b5, #143f7a)">
          <IconVideoCam />
        </div>
        <div class="circle-text">{{ videoCount }}+ videos</div>

        <div class="circle" style="background: linear-gradient(135deg, #3778b5, #42536d)">
          <IconUsers />
        </div>
        <div class="circle-text">{{ userCount }}+ Users</div>
      </div>
    </div>

    <div class="content" style="height: 20vh; margin-top: 10px; justify-content: center">
      <Carousel class="w-full" :style="{ width: '60%' }" :opts="{ align: 'start', dots: true }">
        <CarouselContent>
          <!-- Dynamically generate carousel items based on videoData -->
          <CarouselItem v-for="(video, index) in videoData" :key="index" class="md:basis-1/2 lg:basis-1/3" @click="$router.push(`/e-learning/${video.id}`)">
            <div class="card">
              <div class="img"></div>
              <div class="text">
                <h3>{{ video.title }}</h3>
                <p>{{ video.details }}</p>
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  </div>
</template>

<script>
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router'; // Import useRouter for navigation

export default {
  setup() {
    const router = useRouter(); // Initialize router
    const userCount = ref(0);
    const videoCount = ref(0);
    const videoData = ref([]);

    onMounted(async () => {
      try {
        const response = await fetch("/api/users-count");
        const data = await response.json();
        if (data.success) {
          userCount.value = data.message.recordsets[0][0][""] || 0;
        } else {
          console.error("Error fetching user count:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user count:", error);
      }

      try {
        const response = await fetch("/api/video-count");
        const data = await response.json();
        if (data.success) {
          videoCount.value = data.count.recordsets[0][0]["count"] || 0;

          // Create a list of video items based on the details
          videoData.value = data.videos.recordsets[0].map((video) => ({
            id: video.Id, // Include video ID
            title: video.Name, // Use video name
            details: `${video.DurationInSeconds} seconds`, // Use video duration
          }));
        } else {
          console.error("Error fetching video count:", data.message);
        }
      } catch (error) {
        console.error("Error fetching video count:", error);
      }
    });

    // Method to navigate to the video detail page
    const navigateToVideo = (id) => {
      router.push(`/e-learning/${id}`); // Redirect to the video detail page
    };

    return {
      userCount,
      videoCount,
      videoData,
      navigateToVideo, // Expose method to the template
    };
  },
};
</script>

<style src="@/assets/e-learning.css"></style>
