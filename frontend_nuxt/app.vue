<template>
  <div
    style="background-color: black; color: white; min-height: 100vh; padding: 2rem; padding-bottom: 5rem; display: flex; flex-direction: column; gap: 4rem;"
  >
    <h1 style="font-size: 1.5rem; font-weight: bold; text-align: center;">
      Image Platform
    </h1>
    <!-- Display error if fetch fails -->
    <div v-if="error">
      <!-- Display error message if the API call has failed -->
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
  </div>
</template>

<script setup lang="ts">
// Define TypeScript interface for ImageData
interface ImageData {
  id: number;
  title: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

// Use useAsyncData for SSR data fetching in Nuxt 3
// This fetch is executed on the server-side during SSR, and the data is hydrated on the client.
const { data: images, error } = await useAsyncData<ImageData[]>('images', async () => {
  // $fetch is Nuxt 3's enhanced fetch which works both server- and client-side
  return await $fetch('http://localhost:8080/images');
});

// Define the API base URL (same as in the fetched URL)
// This is used to construct the complete image path
const apiBaseUrl = 'http://localhost:8080';
</script>

<style>
/* Reset default spacing for html and body */
html, body {
  margin: 0;
  padding: 0;
}
</style>

