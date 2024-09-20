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
                <!-- Use DialogTrigger to open the edit dialog -->
                <Dialog>
                  <DialogTrigger as-child>
                    <Button class="bg-blue-500 text-white py-1 px-3 rounded" @click="openModal(video)">
                      Edit
                    </Button>
                  </DialogTrigger>
                  <!-- Dialog Content for Editing -->
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
                      <div class="mb-4">
                        <Button variant="default" @click="saveChanges">Save</Button>
                      <!-- Cancel button to close the dialog -->
                      <DialogClose as-child>
                        <Button variant="secondary">Cancel</Button>
                      </DialogClose>
                      </div>
                    </DialogScrollContent>

                  </DialogContent>
                </Dialog>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
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
      selectedVideo: {}, // The selected video for editing
      thumbnailFile: null, // Holds the selected thumbnail file
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
      this.selectedVideo = { ...video }; // Clone the selected video data to avoid direct mutation
    },
    onThumbnailChange(event) {
      this.thumbnailFile = event.target.files[0]; // Capture the selected thumbnail file
    },
    async saveChanges() {
      try {
        // Create form data to hold the video details and the thumbnail
        const formData = new FormData();
        formData.append('id', this.selectedVideo.Id);
        formData.append('name', this.selectedVideo.Name);
        formData.append('duration', this.selectedVideo.DurationInSeconds);

        // Append the thumbnail file if available
        if (this.thumbnailFile) {
          formData.append('thumbnail', this.thumbnailFile);
        }

        // Send a request to save the changes
        const response = await fetch('/api/update_video_analysis', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        if (result.success) {
          this.fetchVideos(); // Refresh the video list after saving
        }
      } catch (error) {
        console.error('Error saving changes:', error);
      }
    },
  },
  mounted() {
    this.fetchVideos(); // Fetch video data when the component mounts
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
