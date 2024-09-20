<template>
  <div
    class="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]"
  >
    <!-- Sidebar -->
    <div class="hidden border-r bg-muted/40 md:block">
      <div class="flex h-full max-h-screen flex-col gap-2">
        <div class="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <a href="/" class="flex items-center gap-2 font-semibold">
            <!-- <Package2 class="h-6 w-6" /> -->
            <span class="">SEA GUARD</span>
          </a>
        </div>
        <div class="flex-1">
          <nav class="grid items-start px-2 text-sm font-medium lg:px-4">
            <!-- Links with click events to change the active section -->
            <a
              href="#"
              :class="
                activeSection === 'incidents' ? 'text-blue-500' : 'text-black'
              "
              class="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
              @click.prevent="setActiveSection('incidents')"
            >
              <IconDangerOutline class="size-4" />
              Incidents
            </a>

            <a
              href="#"
              :class="
                activeSection === 'documents' ? 'text-blue-500' : 'text-black'
              "
              class="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
              @click.prevent="setActiveSection('documents')"
            >
              <IconDocument class="size-4" />
              Documents
            </a>
            <a
              href="#"
              :class="
                activeSection === 'boatTrackers'
                  ? 'text-blue-500'
                  : 'text-black'
              "
              class="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
              @click.prevent="setActiveSection('boatTrackers')"
            >
              <IconBoat class="size-4" />
              Boat Trackers
            </a>
            <a
              href="#"
              :class="
                activeSection === 'thumbnailUpload'
                  ? 'text-blue-500'
                  : 'text-black'
              "
              class="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
              @click.prevent="setActiveSection('thumbnailUpload')"
            >
              <IconVideoCam class="size-4" />
              Videos
            </a>
            <a
              href="#"
              class="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
              :class="
                activeSection === 'videoUpload' ? 'text-blue-500' : 'text-black'
              "
              @click.prevent="setActiveSection('videoUpload')"
            >
              <IconVideoUpload class="size-4" />
              Video Upload
            </a>
          </nav>
        </div>
        <div class="mt-auto p-4">
          <Card>
            <CardHeader class="p-2 pt-0 md:p-4">
              <CardDescription>
                Manage your incident and report & your training
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex flex-col">
      <main class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div class="flex items-center">
          <h1 class="text-lg font-semibold md:text-2xl">
            <!-- Display dynamic title based on active section -->
            {{ activeSection === "incidents" ? "Incidents" : "" }}
            {{ activeSection === "videoUpload" ? "Video Upload" : "" }}
            {{ activeSection === "thumbnailUpload" ? "Videos" : "" }}
            {{ activeSection === "documents" ? "Documents" : "" }}
            {{ activeSection === "boatTrackers" ? "Boat Trackers" : "" }}
          </h1>
        </div>

        <!-- Dynamic component for each section -->
        <component :is="activeComponent" />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";

// Import the dynamic components
import AdminIncidents from "@/components/AdminIncidents.vue";
import VideoUpload from "~/components/AdminUploadVideo.vue";
import ThumbnailUpload from "~/components/AdminUpdateVideo.vue";
import AdminDocuments from "@/components/AdminDocuments.vue";
import BoatTracker from "@/components/AdminBoatTrackers.vue";
// Define which section is active
const activeSection = ref("incidents");
const adminStore = useAdminStore();

// Function to change section
const setActiveSection = (section: string) => {
  activeSection.value = section;
};

// Map active section to corresponding component
const activeComponent = computed(() => {
  switch (activeSection.value) {
    case "incidents":
      return AdminIncidents;
    case "videoUpload":
      return VideoUpload;
    case "thumbnailUpload":
      return ThumbnailUpload;
    case "documents":
      return AdminDocuments;
    case "boatTrackers":
      return BoatTracker;
    default:
      return AdminIncidents;
  }
});

onMounted(() => {
  adminStore.setIncidents();
  adminStore.setDocuments();
  adminStore.setBoatTrackers();
});
</script>
