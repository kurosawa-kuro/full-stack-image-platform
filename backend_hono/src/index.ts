import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { PrismaClient } from '@prisma/client'
import { serveStatic } from 'hono/serve-static'
import { logger } from 'hono/logger'
import { createWriteStream } from 'fs'
import { readFile } from 'fs/promises'
import { extname, join } from 'path'

// Initialize Prisma Client
const prisma = new PrismaClient();

// Define a minimal "getContent" function for static file serving
const getContent = async (filePath: string, c: any): Promise<Response | null> => {
  try {
    const data = await readFile(filePath);
    const ext = extname(filePath);
    const contentTypes: Record<string, string> = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
    };
    const contentType = contentTypes[ext] || 'application/octet-stream';
    return new Response(data, { headers: { 'Content-Type': contentType } });
  } catch (err) {
    return null;
  }
};

// Function to create CORS middleware configuration
function createCorsMiddleware() {
  return cors({
    origin: ["http://localhost:3000"],
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 3600,
    credentials: true,
  });
}

// Function to set up the application routes
function setupRoutes(app: Hono) {
  // Define root endpoint
  app.get('/', (c) => {
    return c.text('Hello Hono!');
  });

  // get all images using Prisma Client
  app.get('/images', async (c) => {
    try {
      // Fetch all images from the database
      const images = await prisma.images.findMany();
      return c.json(images);
    } catch (error) {
      console.error("Failed to fetch images: ", error);
      return c.text('Internal Server Error', 500);
    }
  });

  // get one image using Prisma Client
  app.get('/images/:id', async (c) => {
    const { id } = c.req.param();
    const image = await prisma.images.findUnique({
      where: { id: parseInt(id) },
    });
    if (!image) {
      return c.text('Image not found', 404);
    }
    return c.json(image);
  });

  // create one image with image-file using Prisma Client
  app.post('/images', async (c) => {
    try {
      // FormDataを解析する
      const formData = await c.req.formData();
      
      // フィールド 'file' と 'title' で取得する
      const file = formData.get('file') as File;
      if (!file) {
        return c.json({ error: 'No file uploaded' }, 400);
      }
      
      const title = (formData.get('title') as string) || 'Untitled';
      
      // ファイル名を生成
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const filePath = join(process.cwd(), 'public', 'upload', fileName);
      
      // ファイルを保存
      const arrayBuffer = await file.arrayBuffer();
      const stream = createWriteStream(filePath);
      stream.write(Buffer.from(arrayBuffer));
      stream.end();
      
      // データベースに保存
      const image = await prisma.images.create({
        data: {
          title,
          image_url: `/upload/${fileName}`,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
      return c.json(image);
      
    } catch (err) {
      // エラー発生時、リクエストボディのテキストを出力してデバッグする
      try {
        const raw = await c.req.text();
        console.log("Raw body text:", raw);
      } catch (e) {
        console.log("Failed to read raw body:", e);
      }
      console.error("Failed to parse form data:", err);
      return c.json({ error: 'Invalid form data' }, 400);
    }
  });

  // Add static file serving with getContent
  app.use('/upload/*', serveStatic({ root: './public', getContent }));
  return app;
}

// Function to initialize the Hono application
function initApp(): Hono {
  const app = new Hono();
  // Apply CORS middleware to all routes
  app.use("/*", createCorsMiddleware());
  // Set up routes for the application
  setupRoutes(app);
  // Add logger middleware
  app.use('*', logger());
  return app;
}

// Function to start the server with given app and port
function startServer(app: Hono, port: number): void {
  console.log(`Server is running on http://localhost:${port}`);
  serve({
    fetch: app.fetch,
    port
  });
}

// Main execution flow
const app = initApp();
const port = 8080;
startServer(app, port);

// Exporting initApp for testing purposes
export { initApp };
