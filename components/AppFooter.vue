<template>
  <div
    class="bg-cover bg-no-repeat bg-center h-36 md:h-32 relative"
    style="background-image: url('/images/footer.png')"
  >
    <div
      class="text-primary-foreground absolute bottom-0 left-0 right-0 flex flex-col md:flex-row md:justify-between items-center p-2 md:p-4 text-sm md:text-md"
    >
      <div class="flex gap-6">
        <p>Privacy Policy</p>
        <p>Terms of Use</p>
        <p>About Us</p>
      </div>

      <div class="md:order-first order-last mt-1 md:mt-0">
        <p>© {{ currentYear }} All Rights Reserved to Prompt Engineers</p>
      </div>
    </div>
  </div>
</template>
<script setup>
const currentYear = ref();

onMounted(async () => {
  currentYear.value = new Date().getFullYear();
});
</script>
