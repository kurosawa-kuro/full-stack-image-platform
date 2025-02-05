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

// 定義: APIのベースURL
const apiBaseUrl = 'http://localhost:8080';

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
 * Utilize apiBaseUrl to construct the full API URL, which makes it easier to update the endpoint in one place.
 */
async function fetchImages(): Promise<ImageData[]> {
  // $fetch works on both server- and client-side in Nuxt 3.
  return await $fetch(`${apiBaseUrl}/images`);
}

// Use useAsyncData for SSR data fetching in Nuxt 3.
// The data is fetched on the server during SSR and later hydrated on the client.
const { data: images, error, refresh } = await useAsyncData<ImageData[]>('images', fetchImages);

/**
 * Handle upload success event.
 * Refreshes the image list upon successful upload.
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

