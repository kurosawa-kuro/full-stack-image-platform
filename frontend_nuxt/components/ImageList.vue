<template>
    <!-- エラーメッセージの表示 -->
    <div v-if="hasError">
      <p>Error: {{ errorMessage }}</p>
    </div>
    <!-- 画像一覧の表示 -->
    <div v-else class="image-list" :style="imageListStyle">
      <div
        v-for="image in images"
        :key="image.id"
        :style="imageContainerStyle"
      >
        <img
          :src="getImageUrl(image)"
          alt="Image"
          :style="imageStyle"
        />
        <p :style="imageTitleStyle">{{ image.title }}</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, computed } from 'vue';
  
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
  
  // Computed property to check if there's an error
  const hasError = computed(() => props.error !== null);
  
  // Computed property for error message display
  const errorMessage = computed(() => props.error?.message || '');
  
  // Computed style for the image list container
  const imageListStyle = computed(() => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem'
  }));
  
  // Style for each image container
  const imageContainerStyle = {
    width: '200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };
  
  // Style for the image element
  const imageStyle = {
    width: '100%',
    height: 'auto'
  };
  
  // Style for the image title
  const imageTitleStyle = {
    textAlign: 'center',
    marginTop: '0.5rem'
  };
  
  /**
   * Compose full image URL from base URL and image path.
   * @param image - The image object containing image_url field.
   * @returns The full URL of the image.
   */
  function getImageUrl(image: ImageData): string {
    return `${props.apiBaseUrl}${image.image_url}`;
  }
  </script>

<style scoped>
/* 必要に応じて追加のスタイルを記述 */
</style>