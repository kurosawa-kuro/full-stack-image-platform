<template>
    <div class="detail-container">
      <!-- Display error message if fetching fails -->
      <div v-if="error">
        <p>Error: {{ error?.message || 'Failed to load image details.' }}</p>
      </div>
      <!-- Display image detail when data is available -->
      <div v-else>
        <h1 class="detail-title">{{ image?.title }}</h1>
        <img :src="fullImageUrl" alt="Image Detail" class="detail-image" />
        <p>Created At: {{ image?.created_at }}</p>
        <p>Updated At: {{ image?.updated_at }}</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { computed } from 'vue'
  
  // Define interface for image data
  interface ImageData {
    id: number
    title: string
    image_url: string
    created_at: string
    updated_at: string
  }
  
  const route = useRoute()
  // Extract the image id from route params
  const imageId = route.params.id as string
  
  // Define API base URL (update this value if needed)
  const apiBaseUrl = 'http://localhost:8080'
  
  // Use Nuxt 3's useAsyncData to fetch image detail data
  const { data: image, error } = await useAsyncData<ImageData>('imageDetail', () =>
    $fetch(`${apiBaseUrl}/images/${imageId}`)
  )
  
  // Compute full image URL to prepend the apiBaseUrl if needed
  const fullImageUrl = computed(() => {
    if (image.value) {
      // If image_url is an absolute URL, return it directly
      if (image.value.image_url.startsWith('http')) {
        return image.value.image_url
      }
      return `${apiBaseUrl}${image.value.image_url}`
    }
    return ''
  })
  </script>
  
  <style scoped>
  .detail-container {
    margin: 2rem auto;
    padding: 1rem;
    max-width: 800px;
    text-align: center;
    background-color: #222;
    color: #fff;
    border-radius: 8px;
  }
  
  .detail-title {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  .detail-image {
    max-width: 100%;
    height: auto;
    margin-bottom: 1rem;
    border: 1px solid #fff;
    border-radius: 4px;
  }
  </style>