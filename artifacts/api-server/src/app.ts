import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import rateLimit from "express-rate-limit";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// Trust the single reverse-proxy hop Replit places in front of every service.
// This makes req.ip (and therefore the rate-limiter key) resolve to the real
// client IP from X-Forwarded-For rather than the proxy socket address.
app.set("trust proxy", 1);

// ---------------------------------------------------------------------------
// CORS — restrict to the app's own origin only.
// REPLIT_DEV_DOMAIN covers the proxied dev environment; ALLOWED_ORIGINS (comma-
// separated) can be set for production custom domains.
// ---------------------------------------------------------------------------
const allowedOrigins: Set<string> = new Set(
  [
    process.env.REPLIT_DEV_DOMAIN
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : null,
    ...(process.env.ALLOWED_ORIGINS ?? "")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean),
  ].filter((o): o is string => o !== null),
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Same-origin requests (e.g. server-to-server) have no Origin header.
      if (!origin) return callback(null, false);
      if (allowedOrigins.has(origin)) return callback(null, true);
      callback(new Error(`CORS: origin '${origin}' is not allowed`));
    },
    credentials: false,
  }),
);

// ---------------------------------------------------------------------------
// Rate limiting — applied BEFORE body parsing so oversized/spam bodies are
// rejected without incurring parse overhead.
// ---------------------------------------------------------------------------

// General limiter — 100 requests per IP per minute on every /api/* route.
const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

// Strict limiter for the book submission endpoint — 10 posts per IP per 15 min.
const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many submissions, please try again later." },
});

// Mount general limiter before body parsers so request-body abuse is stopped
// before any parsing work is done.
app.use("/api", generalLimiter);
app.post("/api/books", submitLimiter);

// ---------------------------------------------------------------------------
// Logging and body parsing
// ---------------------------------------------------------------------------
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
