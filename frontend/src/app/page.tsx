import ImageGallery from '../components/ImageGallery';
import ImageForm from '../components/ImageForm';

// Home component is a Next.js server component that displays the main page
export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-2xl font-bold">Image Platform</h1>
      <ImageForm />
      <ImageGallery />
    </div>
  );
}