import Image from 'next/image';
import { FC } from 'react';

// Define the image type interface
export interface ImageType {
  id: number;
  title: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

// ImageCard component for displaying a single image card
const ImageCard: FC<{ image: ImageType }> = ({ image }) => {
  return (
    <div className="border p-4 rounded shadow">
      <h2 className="mb-2 text-xl">{image.title}</h2>
      <Image 
        src={`http://localhost:8080${image.image_url}`} 
        alt={image.title} 
        width={500} 
        height={300} 
        className="object-cover" 
      />
    </div>
  );
};

export default ImageCard;