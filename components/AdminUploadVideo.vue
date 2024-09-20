<template>
  <div
    class="flex flex-1 items-start justify-start rounded-lg border border-dashed shadow-sm p-6"
  >
    <div class="flex flex-col items-center gap-6 text-center">
      <!-- Form for uploading video -->
      <form
        @submit.prevent="submitForm"
        class="flex flex-col items-start gap-4 w-full max-w-md"
      >
        <div class="w-full text-start">
          <Label for="video">Select Video File</Label>
          <Input
            type="file"
            id="video"
            @change="onFileChange"
            accept="video/*"
            class="file-input w-full mt-2"
          />
        </div>

        <div class="w-full text-start">
          <Label for="title">Video Title</Label>
          <Input
            type="text"
            id="title"
            v-model="title"
            placeholder="Enter video title"
            class="input w-full mt-2"
          />
        </div>

        <Button
          type="submit"
          :disabled="!file || !title"
          class="mt-4"
          variant="default"
        >
          Upload Video
        </Button>
      </form>

      <!-- Upload progress messages -->
      <div v-if="isUploading" class="mt-4">
        <IconSpinner class="size-24 text-primary" />
        Uploading...
      </div>

      <div v-if="uploadSuccess" class="text-green-500 mt-4">
        Upload successful! <br />
        <button variant="default" @click="analyzeVideo">Start Analysis</button>
      </div>

      <div v-if="uploadError" class="text-red-500 mt-4">
        Error: {{ uploadError }}
      </div>

      <!-- Show progress bar during analysis -->
      <div v-if="isAnalyzing" class="mt-4">
        <Label for="video">Analysis in Progress</Label>
        <!-- Show progress bar during analysis -->
        <IconSpinner class="size-24 text-primary" />
      </div>

      <!-- Show analysis success message -->
      <div v-if="analysisResults" class="text-green-500">
        Video successfully analyzed with ID: {{ analysisResults.id }}
      </div>
    </div>
  </div>
</template>

<script>
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress"; // Import ShadCN Progress Component

export default {
  data() {
    return {
      file: null,
      title: "",
      isUploading: false,
      uploadSuccess: false,
      uploadError: null,
      uploadedVideoUrl: null, // Store the uploaded video URL
      analysisResults: null, // Store the analysis results
      isAnalyzing: false, // To track if analysis is ongoing
      analysisProgress: 0, // Track progress percentage
    };
  },
  methods: {
    onFileChange(event) {
      this.file = event.target.files[0];
    },

    async submitForm() {
      if (!this.file || !this.title) {
        alert("Please select a video file and provide a title.");
        return;
      }

      this.isUploading = true;
      this.uploadError = null;
      this.uploadSuccess = false;

      try {
        const formData = new FormData();
        formData.append("video", this.file);
        formData.append("title", this.title);

        const response = await fetch("/api/upload-video", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log("Upload successful:", data);
        this.uploadedVideoUrl = data.videoUrl; // Store the video URL
        this.uploadSuccess = true;
      } catch (error) {
        console.error("Error during video upload:", error);
        this.uploadError = error.message;
      } finally {
        this.isUploading = false;
      }
    },

    async analyzeVideo() {
      if (!this.uploadedVideoUrl) {
        alert("No uploaded video to analyze.");
        return;
      }

      this.isAnalyzing = true;
      this.analysisProgress = 0;

      try {
        const response = await fetch(
          `/api/analyze-video?videoUrl=${encodeURIComponent(
            this.uploadedVideoUrl
          )}`
        );

        if (!response.ok) {
          throw new Error(`Analysis failed with status ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          // Handle successful analysis
          this.analysisResults = data.analysisResults;
          this.isAnalyzing = false;
          console.log("Video analysis successful:", data.analysisResults);
        } else {
          // Handle analysis error if returned from API
          throw new Error(data.message);
        }
      } catch (error) {
        console.error("Error during video analysis:", error);
        this.uploadError = error.message;
        this.isAnalyzing = false;
      }
    },
  },
};
</script>

<style scoped>
.file-input {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 8px;
}

.input {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 8px;
}
</style>
