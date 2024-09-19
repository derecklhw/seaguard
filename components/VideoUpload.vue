<template>
    <div class="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-6">
      <div class="flex flex-col items-center gap-6 text-center">
        <h3 class="text-2xl font-bold tracking-tight">Video Upload Section</h3>
        <p class="text-sm text-muted-foreground">Upload videos here.</p>
  
        <!-- Form for uploading video -->
        <form @submit.prevent="submitForm" class="flex flex-col items-center gap-4 w-full max-w-md">
          <div class="w-full">
            <Label for="video">Select Video File</Label>
            <Input
              type="file"
              id="video"
              @change="onFileChange"
              accept="video/*"
              class="file-input w-full mt-2"
            />
          </div>
  
          <div class="w-full">
            <Label for="title">Video Title</Label>
            <Input
              type="text"
              id="title"
              v-model="title"
              placeholder="Enter video title"
              class="input w-full mt-2"
            />
          </div>
  
          <!-- Dropdown Select Example with shadcn components -->
          <div class="w-full">
            <Label for="category">Select Video Category</Label>
            <Select>
              <SelectTrigger id="category">
                <SelectValue placeholder="Choose category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
  
          <Button type="submit" :disabled="!file || !title" class="mt-4" variant="default">
            Upload Video
          </Button>
        </form>
  
        <!-- Upload progress messages -->
        <div v-if="isUploading" class="mt-4">
          <Spinner class="mr-2 h-4 w-4 animate-spin" />
          Uploading...
        </div>
        <div v-if="uploadSuccess" class="text-green-500 mt-4">
          Upload successful! <br />
          <button @click="analyzeVideo">Start Analysis</button>
        </div>
        <div v-if="uploadError" class="text-red-500 mt-4">Error: {{ uploadError }}</div>
  
        <!-- Show analysis results -->
        <div v-if="analysisResults" class="mt-4">
          <h3 class="text-2xl font-bold tracking-tight">Analysis Results</h3>
          <pre>{{ analysisResults }}</pre>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Label } from '@/components/ui/label';
  import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
  
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
  
          const response = await fetch("/api/upload_video", {
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
  
        try {
          const response = await fetch(`/api/analyze_video?videoUrl=${encodeURIComponent(this.uploadedVideoUrl)}`);
          const data = await response.json();
  
          if (!data.success) {
            throw new Error(`Analysis failed: ${data.message}`);
          }
  
          this.analysisResults = data.analysisResults;
          console.log("Analysis successful:", data.analysisResults);
        } catch (error) {
          console.error("Error during video analysis:", error);
          this.uploadError = error.message;
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
  