<template>
  <div class="main-container">
    <div class="main-body-container">
      <!-- Background video -->
      <video autoplay muted loop id="background-video">
        <source src="/videos/background_e-learning.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div class="video-overlay"></div>

      <div class="content">
        <div class="text-image-container">
          <!-- Text Section -->
          <div class="text-section-container">
            <div class="text-section-wrapper">
              <div class="text-section">
                <p
                  v-html="mainText"
                  style="
                    font-size: 36px;
                    font-weight: bold;
                    margin: 0;
                    color: #ffffff;
                  "
                ></p>
              </div>
              <Button
                size="lg"
                class="m-6 text-md md:text-lg"
                @click="scrollTo('carousel-container')"
              >
                Explore Now
              </Button>
            </div>
          </div>

     
          <!-- <div class="image-section">
            <img src="/images/test.png" alt="Description of image" id="background-image" style="width: 100%; height: auto;">
          </div> -->
        </div>
      </div>
    </div>

    <!-- Circle content section -->
    <div
      class="content"
      style="
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        height: auto;
        margin-top: 10px;
      "
    >
      <div
        class="circle-item"
        style="
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 20px;
        "
      >
        <div class="circle">
          <IconVideoCam />
        </div>
        <div class="circle-text" style="text-align: center; font-size: 1rem">
          <span class="number" style="font-size: 1.5rem; font-weight: bold">{{
            videoCount
          }}</span>
          <span class="plus" style="font-size: 1.5rem">+</span> <br />
          <span class="label" style="font-size: 1rem">VIDEOS</span>
        </div>

        <div class="circle">
          <IconUsers />
        </div>
        <div class="circle-text" style="text-align: center; font-size: 1rem">
          <span class="number" style="font-size: 1.5rem; font-weight: bold">{{
            userCount
          }}</span>
          <span class="plus" style="font-size: 1.5rem">+</span> <br />
          <span class="label" style="font-size: 1rem">USERS</span>
        </div>

        <div class="circle">
          <IconUsers />
        </div>
        <div class="circle-text" style="text-align: center; font-size: 1rem">
          <span class="number" style="font-size: 1.5rem; font-weight: bold"
            >2</span
          >
          <span class="plus" style="font-size: 1.5rem">+</span> <br />
          <span class="label" style="font-size: 1rem">TRAINER</span>
        </div>
      </div>
    </div>

    <!-- Carousel section with responsive styling -->
    <div class="carousel-container" id="carousel-container">
      <div class="carousel-wrapper">
        <Carousel
          class="w-full"
          :style="{
            width: '90%',
            maxWidth: '1200px',
            padding: '0 20px',
          }"
          :opts="{ align: 'start', dots: true }"
        >
          <CarouselContent>
            <CarouselItem
              v-for="(video, index) in videoData"
              :key="index"
              class="md:basis-1/2 lg:basis-1/3"
              @click="$router.push(`/e-learning/${video.id}`)"
            >
              <div class="card">
                <div class="img">
                  <img
                    v-if="video.ThumbnailId"
                    :src="video.ThumbnailId"
                    alt="Thumbnail"
                    style="width: 100%; height: auto; "
                  />
                  <img
                    v-else
                    src="/images/default-thumbnail.png"
                    alt="Default Thumbnail"
                    style="width: 100%; height: auto;"
                  />

                </div>
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
import { useRouter } from "vue-router"; // Import useRouter for navigation
const scrollTo = (id) => {
  const element = document.getElementById(id);
  element.scrollIntoView({ behavior: "smooth" });
};
export default {
  computed: {
    mainText() {
      // Retrieve the translated text and replace \n with <br>
      return this.$t("main_text_e-learning").replace(/\\n/g, "<br>");
    },
  },
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
            ThumbnailId: video.ThumbnailId // Include ThumbnailId
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
