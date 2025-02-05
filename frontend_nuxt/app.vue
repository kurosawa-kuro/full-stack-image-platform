<template>
  <div
    style="background-color: black; color: white; min-height: 100vh; padding: 2rem; padding-bottom: 5rem; display: flex; flex-direction: column; gap: 4rem;"
  >
    <h1 style="font-size: 1.5rem; font-weight: bold; text-align: center;">
      Image Platform
    </h1>
    <!-- ImageForm component を利用して画像を投稿 -->
    <ImageForm @uploadSuccess="onUploadSuccess" />
    <!-- ImageList component を利用して画像一覧を描画 -->
    <ImageList :images="images" :error="error" :apiBaseUrl="apiBaseUrl" />
  </div>
</template>

<script setup lang="ts">
// Import the ImageList component
import ImageList from '~/components/ImageList.vue';
import ImageForm from '~/components/ImageForm.vue';
// Define the TypeScript interface for ImageData
interface ImageData {
  id: number;
  title: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

// Use useAsyncData for SSR data fetching in Nuxt 3
// This fetch is executed on the server-side during SSR, and the data is hydrated on the client.
const { data: images, error, refresh } = await useAsyncData<ImageData[]>('images', async () => {
  // $fetch is Nuxt 3's enhanced fetch which works both server- and client-side
  return await $fetch('http://localhost:8080/images');
});

// Define the API base URL to construct complete image URL
const apiBaseUrl = 'http://localhost:8080';

// Handler function triggered when ImageForm component emits uploadSuccess event.
// This will call the refresh method to re-fetch the image list.
function onUploadSuccess() {
  refresh();
}
</script>

<style>
/* Reset default spacing for html and body */
html, body {
  margin: 0;
  padding: 0;
}
</style>

