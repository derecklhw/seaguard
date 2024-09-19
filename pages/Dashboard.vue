<template>
  <div class="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
    <!-- Sidebar -->
    <div class="hidden border-r bg-muted/40 md:block">
      <div class="flex h-full max-h-screen flex-col gap-2">
        <div class="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <a href="/" class="flex items-center gap-2 font-semibold">
            <Package2 class="h-6 w-6" />
            <span class="">SEA GUARD</span>
          </a>
          <Button variant="outline" size="icon" class="ml-auto h-8 w-8">
            <Bell class="h-4 w-4" />
            <span class="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div class="flex-1">
          <nav class="grid items-start px-2 text-sm font-medium lg:px-4">
            <!-- Links with click events to change the active section -->
            <a
              href="#"
              @click.prevent="setActiveSection('incidentDashboard')"
              :class="activeSection === 'incidentDashboard' ? 'text-blue-500' : 'text-black'"
              class="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
            >
              <Home class="h-4 w-4" />
              Incident Dashboard
            </a>
            <a
              href="#"
              @click.prevent="setActiveSection('videoUpload')"
              :class="activeSection === 'videoUpload' ? 'text-blue-500' : 'text-black'"
              class="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
            >
              <ShoppingCart class="h-4 w-4" />
              Video Upload
            </a>
            <a
              href="#"
              @click.prevent="setActiveSection('thumbnailUpload')"
              :class="activeSection === 'thumbnailUpload' ? 'text-blue-500' : 'text-black'"
              class="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
            >
              <Package class="h-4 w-4" />
              Thumbnail Upload
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
            {{ activeSection === 'incidentDashboard' ? 'Incident Dashboard' : '' }}
            {{ activeSection === 'videoUpload' ? 'Video Upload' : '' }}
            {{ activeSection === 'thumbnailUpload' ? 'Thumbnail Upload' : '' }}
          </h1>
        </div>

        <!-- Dynamic component for each section -->
        <component :is="activeComponent"></component>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Bell, Home, Package, Package2, ShoppingCart } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader } from '@/components/ui/card';

// Import the dynamic components
import IncidentDashboard from '@/components/IncidentDashboard.vue';
import VideoUpload from '@/components/VideoUpload.vue';
import ThumbnailUpload from '@/components/ThumbnailUpload.vue';

// Define which section is active
const activeSection = ref('incidentDashboard');

// Function to change section
const setActiveSection = (section: string) => {
  activeSection.value = section;
};

// Map active section to corresponding component
const activeComponent = computed(() => {
  switch (activeSection.value) {
    case 'incidentDashboard':
      return IncidentDashboard;
    case 'videoUpload':
      return VideoUpload;
    case 'thumbnailUpload':
      return ThumbnailUpload;
    default:
      return IncidentDashboard;
  }
});
</script>
