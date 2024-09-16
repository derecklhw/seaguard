<template>
  <div>
    <!-- Display Video Player -->
    <div v-if="videoId">
      <iframe
        width="1280"
        height="720"
        :src="`https://www.videoindexer.ai/embed/player/a219ba29-e6ea-4d94-88b3-176fab58244c/${videoId}/?&locale=en&location=southeastasia`"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>

    <!-- Display Insights Widget -->
    <div v-if="videoId">
      <iframe
        width="580"
        height="780"
        :src="`https://www.videoindexer.ai/embed/insights/a219ba29-e6ea-4d94-88b3-176fab58244c/${videoId}/?&locale=en&location=southeastasia`"
        frameborder="0"
        allowfullscreen
      ></iframe>
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
      videoId: ""};}}

</script>

<style scoped>

</style>
