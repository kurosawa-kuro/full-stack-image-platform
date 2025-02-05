import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 既存のデータを削除
  await prisma.images.deleteMany();

  // サンプル画像データを挿入
  await prisma.images.createMany({
    data: [
      {
        title: 'Beautiful Landscape',
        image_url: 'https://example.com/images/sample1.jpg',
      },
      {
        title: 'City Night View',
        image_url: 'https://example.com/images/sample2.png',
      },
      {
        title: 'Abstract Art',
        image_url: 'https://example.com/images/sample3.webp',
      },
      {
        title: 'Animated Character',
        image_url: 'https://example.com/images/sample4.gif',
      },
      {
        title: 'Vector Illustration',
        image_url: 'https://example.com/images/sample5.svg',
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
