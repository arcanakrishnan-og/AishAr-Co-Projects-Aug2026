import { type Request, type Response, type NextFunction } from "express";

/**
 * Middleware that requires a valid admin API key.
 *
 * Callers must send the SESSION_SECRET value in the `X-Admin-Key` header.
 * Requests missing or presenting the wrong key receive 401/403 respectively.
 */
export function adminAuth(req: Request, res: Response, next: NextFunction): void {
  const adminKey = process.env["SESSION_SECRET"];

  if (!adminKey) {
    // Server misconfiguration — fail closed, never open
    res.status(500).json({ error: "Server is not configured for admin operations" });
    return;
  }

  const provided = req.headers["x-admin-key"];

  if (!provided) {
    res.status(401).json({ error: "Missing X-Admin-Key header" });
    return;
  }

  if (provided !== adminKey) {
    res.status(403).json({ error: "Invalid admin key" });
    return;
  }

  next();
}
