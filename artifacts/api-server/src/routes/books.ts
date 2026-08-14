import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, booksTable, SPINE_COLORS } from "@workspace/db";
import {
  CreateBookBody,
  GetBookParams,
  DeleteBookParams,
  UpdateBookParams,
  UpdateBookBody,
  UpdateBookResponse,
  ListBooksResponse,
  CreateBookResponse,
  GetBookResponse,
  GetShelfStatsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function randomSpineColor(): string {
  return SPINE_COLORS[Math.floor(Math.random() * SPINE_COLORS.length)];
}

// GET /books/stats — must come before /books/:id to avoid param conflict
router.get("/books/stats", async (req, res): Promise<void> => {
  const allBooks = await db
    .select()
    .from(booksTable)
    .orderBy(desc(booksTable.createdAt));

  const recentBooks = allBooks.slice(0, 5);

  res.json(
    GetShelfStatsResponse.parse({
      totalBooks: allBooks.length,
      recentBooks,
    }),
  );
});

// GET /books
router.get("/books", async (_req, res): Promise<void> => {
  const books = await db
    .select()
    .from(booksTable)
    .orderBy(desc(booksTable.createdAt));
  res.json(ListBooksResponse.parse(books));
});

// POST /books
router.post("/books", async (req, res): Promise<void> => {
  const parsed = CreateBookBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { firstName, lastName, projectName, liveLink, githubLink, email, description, week, isBadged } =
    parsed.data;

  const [book] = await db
    .insert(booksTable)
    .values({
      firstName,
      lastName,
      projectName,
      liveLink: liveLink ?? null,
      githubLink,
      email: email ?? null,
      description: description ?? null,
      week: week ?? null,
      isBadged: isBadged ?? false,
      spineColor: randomSpineColor(),
    })
    .returning();

  res.status(201).json(CreateBookResponse.parse(book));
});

// PATCH /books/:id
router.patch("/books/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateBookParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateBookBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  // Build update object — only include defined fields
  const updates: Record<string, unknown> = {};
  const d = parsed.data;
  if (d.firstName !== undefined) updates.firstName = d.firstName;
  if (d.lastName !== undefined) updates.lastName = d.lastName;
  if (d.projectName !== undefined) updates.projectName = d.projectName;
  if (d.githubLink !== undefined) updates.githubLink = d.githubLink;
  if (d.liveLink !== undefined) updates.liveLink = d.liveLink || null;
  if (d.email !== undefined) updates.email = d.email || null;
  if (d.description !== undefined) updates.description = d.description || null;
  if (d.week !== undefined) updates.week = d.week ?? null;
  if (d.isBadged !== undefined) updates.isBadged = d.isBadged;

  const [book] = await db
    .update(booksTable)
    .set(updates)
    .where(eq(booksTable.id, params.data.id))
    .returning();

  if (!book) {
    res.status(404).json({ error: "Book not found" });
    return;
  }

  res.json(UpdateBookResponse.parse(book));
});

// GET /books/:id
router.get("/books/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetBookParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [book] = await db
    .select()
    .from(booksTable)
    .where(eq(booksTable.id, params.data.id));

  if (!book) {
    res.status(404).json({ error: "Book not found" });
    return;
  }

  res.json(GetBookResponse.parse(book));
});

// DELETE /books/:id
router.delete("/books/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteBookParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [book] = await db
    .delete(booksTable)
    .where(eq(booksTable.id, params.data.id))
    .returning();

  if (!book) {
    res.status(404).json({ error: "Book not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
