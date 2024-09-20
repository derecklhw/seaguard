<template>
  <div class="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-6">
    <div class="flex flex-col items-center gap-6 text-center">
      <h3 class="text-2xl font-bold tracking-tight">Video Analysis Results</h3>
      <p class="text-sm text-muted-foreground">Click on a video to edit its details and upload a thumbnail.</p>

      <!-- Table to display video results -->
      <div class="w-full overflow-x-auto">
        <table class="table-auto w-full border-collapse text-left">
          <thead>
            <tr>
              <th class="px-4 py-2">ID</th>
              <th class="px-4 py-2">Name</th>
              <th class="px-4 py-2">Duration (Seconds)</th>
              <th class="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="video in videos" :key="video.Id" class="hover:bg-gray-100">
              <td class="border px-4 py-2">{{ video.Id }}</td>
              <td class="border px-4 py-2">{{ video.Name }}</td>
              <td class="border px-4 py-2">{{ video.DurationInSeconds }}</td>
              <td class="border px-4 py-2">
                <DialogTrigger>
                  <Button class="bg-blue-500 text-white py-1 px-3 rounded" @click="openModal(video)">
                    Edit
                  </Button>
                </DialogTrigger>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Dialog Modal for editing video details and uploading a thumbnail -->
    <Dialog v-if="isModalOpen" open @close="closeModal">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Video Details</DialogTitle>
          <DialogDescription>Edit the details of your video and upload a thumbnail.</DialogDescription>
        </DialogHeader>

        <DialogScrollContent>
          <div class="mb-4">
            <Label>ID</Label>
            <Input type="text" v-model="selectedVideo.Id" readonly />
          </div>

          <div class="mb-4">
            <Label>Name</Label>
            <Input type="text" v-model="selectedVideo.Name" />
          </div>

          <div class="mb-4">
            <Label>Duration (Seconds)</Label>
            <Input type="number" v-model="selectedVideo.DurationInSeconds" />
          </div>

          <div class="mb-4">
            <Label>Upload Thumbnail</Label>
            <Input type="file" @change="onThumbnailChange" accept="image/*" />
          </div>
        </DialogScrollContent>

        <DialogFooter class="flex justify-end space-x-2">
          <Button variant="default" @click="saveChanges">Save</Button>
          <DialogClose>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogScrollContent, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default {
  data() {
    return {
      videos: [],
      isModalOpen: false,
      selectedVideo: {},
      thumbnailFile: null,
    };
  },
  methods: {
    async fetchVideos() {
      try {
        const response = await fetch('/api/get_video_analysis_results');
        const data = await response.json();
        if (data.success) {
          this.videos = data.videos;
        }
      } catch (error) {
        console.error('Error fetching video results:', error);
      }
    },
    openModal(video) {
      this.selectedVideo = { ...video }; // Clone the selected video data
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.selectedVideo = {};
      this.thumbnailFile = null; // Reset file input
    },
    onThumbnailChange(event) {
      this.thumbnailFile = event.target.files[0];
    },
    async saveChanges() {
      try {
        // Save the updated video data to the database
        const formData = new FormData();
        formData.append('id', this.selectedVideo.Id);
        formData.append('name', this.selectedVideo.Name);
        formData.append('duration', this.selectedVideo.DurationInSeconds);

        if (this.thumbnailFile) {
          formData.append('thumbnail', this.thumbnailFile);
        }

        const response = await fetch('/api/update_video_analysis', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        if (result.success) {
          this.fetchVideos(); // Refresh the video list
          this.closeModal(); // Close the modal
        }
      } catch (error) {
        console.error('Error saving changes:', error);
      }
    },
  },
  mounted() {
    this.fetchVideos(); // Fetch video results on page load
  },
};
</script>

<style scoped>
.table-auto {
  width: 100%;
  border-collapse: collapse;
}

.table-auto th, .table-auto td {
  border: 1px solid #ddd;
  padding: 8px;
}
</style>
