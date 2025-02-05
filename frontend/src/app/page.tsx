import ImageGallery from '../components/ImageGallery';
import ImageForm from '../components/ImageForm';

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-2xl font-bold text-center">Image Platform</h1>
      <div className="flex flex-col items-center w-full max-w-2xl mb-12 text-center">
        <ImageForm />
      </div>
      <div className="w-full">
        <ImageGallery />
      </div>
    </div>
  );
}