<template>
  <div class="video-container">
    <!-- Display Video Player -->
    <div class="video-player" v-if="videoId">
      <iframe
        width="100%"
        height="100%"
        :src="`https://www.videoindexer.ai/embed/player/a219ba29-e6ea-4d94-88b3-176fab58244c/${videoId}/?&locale=en&location=southeastasia`"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>

    <!-- Display Insights Widget -->
    <div class="insights-container" v-if="videoId">
      <div class="insights-header">
        <h2>Insights Title</h2>
        <p>Description of the insights.</p>
      </div>
      <div class="insights-content">
        <iframe
          width="100%"
          height="100%"
          :src="`https://www.videoindexer.ai/embed/insights/a219ba29-e6ea-4d94-88b3-176fab58244c/${videoId}/?&locale=en&location=southeastasia`"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.videoId = this.$route.params.videoId;
    console.log(this.videoId);
    console.log("Highlight");
  },
  data() {
    return {
      videoId: "",
    };
  },
};
</script>

<style scoped>
.video-container {
  display: flex;
  flex-direction: row;
  background-color: #dde6ef;
  padding: 10px;
  gap: 10px;
  height: 80vh; /* Set container height to 80% of the viewport height */
}

.video-player {
  flex: 3; /* 60% of the container width */
  max-width: 60%;
  border-radius: 8px;
  border: 2px solid white;
  overflow: hidden;
  height: 100%; /* Ensure the iframe takes the full height of its container */
}

.insights-container {
  flex: 2; /* 40% of the container width */
  max-width: 40%;
  border-radius: 8px;
  border: 2px solid white;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%; /* Ensure the container takes the full height of the video-container */
}

.insights-header {
  background-color: #e0e5ec;
  padding: 10px;
  border-bottom: 2px solid white;
  height: 10%; /* 10% of the insights-container height */
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.insights-content {
  height: 90%; /* 90% of the insights-container height */
  display: flex;
}

.insights-content iframe {
  width: 100%;
  height: 100%;
}

/* Responsive layout for small screens */
@media (max-width: 768px) {
  .video-container {
    flex-direction: column; /* Stack the video player and insights vertically */
    height: auto; /* Let the height adjust automatically */
  }

  .video-player {
    max-width: 100%; /* Full width on mobile */
    height: 60vh; /* Adjust the height for the video player */
  }

  .insights-container {
    max-width: 100%; /* Full width on mobile */
    height: 50vh; /* Adjust the height for the insights container */
  }

  .insights-header {
    height: auto; /* Let the header adjust automatically */
  }

  .insights-content {
    height: auto; /* Let the content adjust automatically */
  }
}
</style>
