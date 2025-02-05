import ImageCard, { ImageType } from './ImageCard';

// ImageGallery component for fetching and rendering a list of image cards
export default async function ImageGallery() {
  // Fetch images from the backend API with no-store (SSR)
  const res = await fetch('http://localhost:8080/images', { cache: 'no-store' });
  if (!res.ok) {
    // Error handling: throw error if the response is not OK
    throw new Error('Failed to fetch images');
  }
  const images: ImageType[] = await res.json();

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {images.map((img) => (
        <ImageCard key={img.id} image={img} />
      ))}
    </div>
  );
}