<template>
    <div id="app">
        <h1>Camera Component Demo</h1>
        <Camera @photo-clicked="onPhotoClicked" />
        <img v-if="photoData" :src="photoData" alt="Captured Image" />
    </div>
</template>

<script>
import Camera from './components/AppCamera.vue';

export default {
    components: {
        Camera
    },
    data() {
        return {
            photoData: null
        };
    },
    methods: {
        onPhotoClicked(photo) {
            this.photoData = `data:image/png;base64,${photo.imageData}`;
        }
    }
};
</script>

<style scoped>
#app {
    text-align: center;
}
</style>
