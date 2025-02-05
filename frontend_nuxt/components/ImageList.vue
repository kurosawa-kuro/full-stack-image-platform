<template>
    <!-- Display error message if API call fails -->
    <div v-if="error">
      <p>Error: {{ error.message }}</p>
    </div>
    <!-- Display image list if data is loaded -->
    <div v-else class="image-list" style="display: flex; flex-wrap: wrap; gap: 1rem;">
      <div
        v-for="image in images"
        :key="image.id"
        style="width: 200px; display: flex; flex-direction: column; align-items: center;"
      >
        <img
          :src="`${apiBaseUrl}${image.image_url}`"
          alt="Image"
          style="width: 100%; height: auto;"
        />
        <p style="text-align: center; margin-top: 0.5rem;">{{ image.title }}</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  // Define props for the ImageList component
  import { defineProps } from 'vue';
  
  interface ImageData {
    id: number;
    title: string;
    image_url: string;
    created_at: string;
    updated_at: string;
  }
  
  interface ErrorDetail {
    message: string;
  }
  
  const props = defineProps<{
    images: ImageData[];
    error: ErrorDetail | null;
    apiBaseUrl: string;
  }>();
  </script>