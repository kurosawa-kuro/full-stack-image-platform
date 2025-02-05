import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { PrismaClient } from '@prisma/client'; // Import Prisma Client

// Initialize Prisma Client
const prisma = new PrismaClient();

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

  // create one image using Prisma Client
  app.post('/images', async (c) => {
    const { title, image_url } = await c.req.json();
    const image = await prisma.images.create({
      data: { title, image_url },
    });
    return c.json(image);
  });
}

// Function to initialize the Hono application
function initApp(): Hono {
  const app = new Hono();
  // Apply CORS middleware to all routes
  app.use("/*", createCorsMiddleware());
  // Set up routes for the application
  setupRoutes(app);
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
