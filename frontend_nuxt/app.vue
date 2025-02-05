<template>
  <div
    style="background-color: black; color: white; min-height: 100vh; padding: 2rem; padding-bottom: 5rem; display: flex; flex-direction: column; gap: 4rem;"
  >
    <h1 style="font-size: 1.5rem; font-weight: bold; text-align: center;">
      Image Platform
    </h1>
    <!-- Display error if fetch fails -->
    <div v-if="error">
      <p>Error: {{ error }}</p>
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
  </div>
</template>

<script setup lang="ts">
// Import necessary Vue functions for reactivity and lifecycle hooks
import { ref, onMounted } from 'vue';

// Define the TypeScript interface for the image data
interface ImageData {
  id: number;
  title: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

// Reactive variable to store the list of images fetched from the API
const images = ref<ImageData[]>([]);

// Reactive variable to store any error message during fetching
const error = ref<string | null>(null);

// Define the API base URL
const apiBaseUrl = 'http://localhost:8080';

// Fetch the image list from the backend API when the component is mounted
onMounted(async () => {
  try {
    // Perform a GET request to the /images endpoint
    const res = await fetch(`${apiBaseUrl}/images`);
    if (!res.ok) {
      // Throw an error if the response is not ok
      throw new Error('Failed to fetch images');
    }
    // Parse and set the JSON data to the images reactive variable
    images.value = await res.json();
  } catch (err: any) {
    // Set the error message to the error reactive variable
    error.value = err.message || 'Unknown error occurred while fetching images';
  }
});
</script>

<style>
/* Reset default spacing for html and body */
html, body {
  margin: 0;
  padding: 0;
}
</style>

