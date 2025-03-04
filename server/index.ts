import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Check for required API keys
    const missingKeys = [];
    if (!process.env.DEEPSEEK_API_KEY) missingKeys.push('DEEPSEEK_API_KEY');
    if (!process.env.HUGGINGFACE_API_KEY) missingKeys.push('HUGGINGFACE_API_KEY');
    
    if (missingKeys.length > 0) {
      log(`Warning: Missing API keys: ${missingKeys.join(', ')}. Some features may not work correctly.`);
    }

    console.log('DEEPSEEK_API_KEY:', process.env.DEEPSEEK_API_KEY);

    // Check database connection
    if (!process.env.DATABASE_URL) {
      log('Warning: DATABASE_URL is not set. Database features will not work.');
    } else {
      try {
        // Test database connection
        const { pool } = await import('./db');
        const client = await pool.connect();
        client.release();
        log('Database connection successful.');
      } catch (dbError) {
        log(`Database connection error: ${dbError.message}`);
        log('Continuing without database functionality...');
      }
    }

    log('Initializing AI services...');
    const server = await registerRoutes(app);

    // Error handling middleware
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      log(`Error: ${status} - ${message}`);
      if (err.stack) {
        log(`Stack: ${err.stack}`);
      }

      res.status(status).json({ 
        error: {
          message,
          status
        }
      });
    });

    // only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // ALWAYS serve the app on port 5000
    // this serves both the API and the client
    const port = 5000;
    server.listen({
      port,
      host: "localhost",
      reusePort: true,
    }, () => {
      log(`Server running at http://localhost:${port}`);
    });
  } catch (err: any) {
    log(`Failed to start server: ${err.message}`);
    if (err.stack) {
      log(`Error stack trace: ${err.stack}`);
    }
    process.exit(1);
  }
})();