<template>
  <div v-if="!loading" class="main-container w-full">
    <div class="main-body-container">
      <!-- Background video -->
      <video id="background-video" autoplay muted loop>
        <source src="/videos/background_e-learning.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div class="video-overlay" />

      <div class="content">
        <div class="text-image-container">
          <!-- Text Section -->
          <div class="text-section-container md:ml-32">
            <div class="text-section-wrapper">
              <div class="text-section">
                <p
                  style="
                    font-size: 36px;
                    font-weight: bold;
                    margin: 0;
                    color: #ffffff;
                  "
                  v-html="mainText"
                />
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
      class="content my-6"
      style="
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        height: auto;
      "
    >
      <div
        class="circle-item flex w-full gap-10"
        style="justify-content: center; align-items: center"
      >
        <div class="flex flex-col md:flex-row">
          <div class="circle">
            <IconVideoCam />
          </div>
          <div class="circle-text" style="text-align: center; font-size: 1rem">
            <span class="number" style="font-size: 1.5rem; font-weight: bold">{{
              videoCount
            }}</span>
            <span class="plus" style="font-size: 1.5rem">+</span> <br />
            <span class="label" style="font-size: 1rem"
              ><p v-html="videotag"
            /></span>
          </div>
        </div>
        <div class="flex flex-col md:flex-row">
          <div class="circle">
            <IconUsers />
          </div>
          <div class="circle-text" style="text-align: center; font-size: 1rem">
            <span class="number" style="font-size: 1.5rem; font-weight: bold">{{
              userCount
            }}</span>
            <span class="plus" style="font-size: 1.5rem">+</span> <br />
            <span class="label" style="font-size: 1rem"
              ><p v-html="users"
            /></span>
          </div>
        </div>
        <div class="flex flex-col md:flex-row">
          <div class="circle">
            <IconUsers />
          </div>
          <div class="circle-text" style="text-align: center; font-size: 1rem">
            <span class="number" style="font-size: 1.5rem; font-weight: bold"
              >2</span
            >
            <span class="plus" style="font-size: 1.5rem">+</span> <br />
            <span class="label" style="font-size: 1rem"
              ><p v-html="trainer"
            /></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Carousel section with responsive styling -->
    <div class="carousel-container">
      <div class="carousel-wrapper">
        <Carousel
          class="w-full"
          :style="{
            width: '100%',
            maxWidth: '1200px',
          }"
        >
          <CarouselContent id="carousel-container">
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
                    style="width: 100%; height: auto"
                  />
                  <img
                    v-else
                    src="/images/default-thumbnail.png"
                    alt="Default Thumbnail"
                    style="width: 100%; height: auto"
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

  <div v-else>
    <div class="flex items-center justify-center h-screen">
      <IconSpinner class="size-24 text-primary" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
// import { useRouter } from "vue-router"; // Import useRouter for navigation

const scrollTo = (id) => {
  const element = document.getElementById(id);
  element.scrollIntoView({ behavior: "smooth" });
};

export default {
  setup() {
    // const router = useRouter(); // Initialize router
    const userCount = ref(0);
    const videoCount = ref(0);
    const videoData = ref([]);
    const loading = ref(true); // Initial state is loading

    // Watcher for the loading state
    watch(loading, (newValue) => {
      console.log("Loading state changed:", newValue);
      if (!newValue) {
        console.log("Loading completed. Loader is now hidden.");
      }
    });

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
            ThumbnailId: video.ThumbnailId, // Include ThumbnailId
          }));
        } else {
          console.error("Error fetching video count:", data.message);
        }
      } catch (error) {
        console.error("Error fetching video count:", error);
      } finally {
        loading.value = false; // Set loading to false when data is fetched
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
      loading, // Expose loading to the template
      navigateToVideo, // Expose method to the template
    };
  },
  computed: {
    mainText() {
      // Retrieve the translated text and replace \n with <br>
      return this.$t("e-learning.main_text").replace(/\\n/g, "<br>");
    },
    users() {
      return this.$t("e-learning.users");
    },
    videotag() {
      return this.$t("e-learning.videoCount");
    },

    trainer() {
      return this.$t("e-learning.trainer");
    },
  },
};
</script>

<style src="@/assets/e-learning.css" scoped></style>
