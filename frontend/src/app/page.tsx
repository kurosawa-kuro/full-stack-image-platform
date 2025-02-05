import Image from "next/image";

// Define image type interface
interface ImageType {
  id: number;
  title: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

// Home コンポーネントは Next.js のサーバーコンポーネントです
// サーバーサイドでバックエンドの Hono API エンドポイント (http://localhost:8080/images) 
// から画像データを取得し、表示します
export default async function Home() {
  // Fetch images from the backend API with no-cache (SSR)
  const res = await fetch("http://localhost:8080/images", { cache: "no-store" });
  if (!res.ok) {
    // エラーハンドリング: レスポンスが正しくない場合はエラーをスロー
    throw new Error("Failed to fetch images");
  }
  const images: ImageType[] = await res.json();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-2xl font-bold">トップ</h1>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {images.map((img: ImageType) => (
          <div key={img.id} className="border p-4 rounded shadow">
            <h2 className="mb-2 text-xl">{img.title}</h2>
            {/* Image url is assumed to be accessible as a static asset or via proper loader configuration */}
            <Image src={`http://localhost:8080${img.image_url}`} alt={img.title} width={500} height={300} className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}