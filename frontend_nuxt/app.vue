<template>
  <div class="page-container">
    <h1 class="page-title">
      Image Platform
    </h1>
    <ImageForm @uploadSuccess="handleUploadSuccess" />
    <ImageList :images="images" :error="error" :apiBaseUrl="apiBaseUrl" />
  </div>
</template>

<script setup lang="ts">
// Import required components
import ImageList from '~/components/ImageList.vue';
import ImageForm from '~/components/ImageForm.vue';

// Define TypeScript interface for image data.
interface ImageData {
  id: number;
  title: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch images from the API.
 * Encapsulates the API fetching logic to allow easy modification and testing.
 */
async function fetchImages(): Promise<ImageData[]> {
  // $fetch works both on server- and client-side in Nuxt 3.
  return await $fetch('http://localhost:8080/images');
}

// Use useAsyncData for SSR data fetching in Nuxt 3.
// The data is fetched on the server during SSR and later hydrated on the client.
const { data: images, error, refresh } = await useAsyncData<ImageData[]>('images', fetchImages);

// Define constant for API base URL.
const apiBaseUrl = 'http://localhost:8080';

/**
 * Handle upload success event.
 * This method refreshes the image list by calling refresh from useAsyncData.
 */
function handleUploadSuccess(): void {
  refresh();
}
</script>

<!-- グローバルに適用するリセットCSS -->
<style>
html, body {
  margin: 0;
  padding: 0;
}
</style>

<!-- コンポーネント固有のスタイル -->
<style scoped>
/* Container styles for the page */
.page-container {
  background-color: black;
  color: white;
  min-height: 100vh;
  padding: 2rem;
  padding-bottom: 5rem;
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

/* Title styles for the header */
.page-title {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
}
</style>

