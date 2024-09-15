<template>
  <section>
    <p>This page will be displayed at the /{{ $t("about") }} route.</p>
  </section>
</template>
<script setup>
const { locale, setLocale } = useI18n();
</script>
