import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// A palette of vintage-style spine colors
export const SPINE_COLORS = [
  "#8B4513", // saddle brown
  "#6B3A2A", // dark sienna
  "#2F4538", // dark forest green
  "#1A3A5C", // midnight navy
  "#5C3D1E", // rich walnut
  "#7B2D2D", // burgundy
  "#3D5A3E", // hunter green
  "#4A3728", // espresso
  "#6B5344", // warm taupe
  "#2D3A4A", // slate blue
  "#5E3B6B", // deep plum
  "#4A5E3A", // olive green
  "#7A4A2A", // terracotta
  "#3A4A5E", // dusty blue
  "#5E4A2A", // golden brown
];

export const booksTable = pgTable("books", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  projectName: text("project_name").notNull(),
  liveLink: text("live_link"),
  githubLink: text("github_link").notNull(),
  email: text("email"),
  description: text("description"),
  spineColor: text("spine_color").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBookSchema = createInsertSchema(booksTable).omit({ id: true, createdAt: true });
export type InsertBook = z.infer<typeof insertBookSchema>;
export type Book = typeof booksTable.$inferSelect;
