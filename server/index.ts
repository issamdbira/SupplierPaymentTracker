import dotenv from "dotenv";
dotenv.config();
import express, { type Request, Response, NextFunction } from "express";
import http from "http"; // Import http module
import { setupRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

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
  // Create HTTP server instance using the Express app
  const server = http.createServer(app); // Create server here

  // Setup API routes
  setupRoutes(app);

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    // Consider removing throw err; in production or adding more specific error logging
    log(`Error: ${status} - ${message}${err.stack ? '\n' + err.stack : ''}`, 'error');
  });

  // Setup Vite or serve static files based on environment
  if (app.get("env") === "development") {
    await setupVite(app, server); // Pass the created server instance
  } else {
    serveStatic(app);
  }

  // Start listening on the server instance
  const port = 5000;
  server.listen(port, "0.0.0.0", () => { // Use the created server instance
    log(`serving on port ${port}`);
  });
})();

