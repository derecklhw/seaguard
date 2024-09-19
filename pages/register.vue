<template>
  <AppCamera :type="'license'" @photo-analysis="photoAnalysis" />
</template>
<script setup>
const photoAnalysis = (data) => {
  console.log("photo taken", data);
};
</script>
