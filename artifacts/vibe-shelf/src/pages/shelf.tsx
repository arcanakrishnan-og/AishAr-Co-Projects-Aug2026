import { useState, useRef, useEffect } from "react";
import { useListBooks, useGetShelfStats } from "@workspace/api-client-react";
import type { Book } from "@workspace/api-client-react";
import { BookSpine } from "@/components/book-spine";
import { BookDetails } from "@/components/book-details";
import { AddBookModal } from "@/components/add-book";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Library, Search, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShelfPage() {
  const { data: books, isLoading } = useListBooks();
  const { data: stats } = useGetShelfStats();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFindOpen, setIsFindOpen] = useState(false);
  const [findQuery, setFindQuery] = useState("");
  const [weekFilter, setWeekFilter] = useState<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus input when Find opens
  useEffect(() => {
    if (isFindOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setFindQuery("");
    }
  }, [isFindOpen]);

  // Close Find on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFindOpen) setIsFindOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isFindOpen]);

  const query = findQuery.trim().toLowerCase();
  const filteredBooks = books
    ? books.filter((b) => {
        const matchesQuery =
          !query ||
          b.projectName.toLowerCase().includes(query) ||
          b.firstName.toLowerCase().includes(query) ||
          b.lastName.toLowerCase().includes(query) ||
          `${b.firstName} ${b.lastName}`.toLowerCase().includes(query) ||
          (b.description ?? "").toLowerCase().includes(query);
        const matchesWeek = weekFilter === null || b.week === weekFilter;
        return matchesQuery && matchesWeek;
      })
    : [];

  const matchCount = query ? filteredBooks.length : null;

  return (
    <div className="min-h-screen bg-background wood-texture text-foreground flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="relative z-10 w-full p-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 bg-background/90 backdrop-blur-md border-b border-border shadow-md">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/20 rounded-full text-primary border border-primary/30">
            <Library size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary tracking-wide">AishAr Co. Projects - Aug 26</h1>
            <p className="text-sm text-muted-foreground font-sans mt-1">
              A community bookshelf of vibe-coded GitHub projects.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {stats && (
            <div className="text-right hidden md:block mr-3">
              <div className="text-2xl font-serif text-foreground">{stats.totalBooks}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Volumes</div>
            </div>
          )}
          <Button
            variant="outline"
            onClick={() => setIsFindOpen((v) => !v)}
            className="font-serif tracking-wide border-amber-900/30 text-amber-900 hover:bg-amber-900/10"
            data-testid="button-find"
          >
            <Search className="mr-2 h-4 w-4" />
            Find
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="font-serif tracking-wide shadow-lg hover:scale-105 transition-transform"
            data-testid="button-add-book"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Your Book
          </Button>
        </div>
      </header>

      {/* Week Filter Bar */}
      <div className="relative z-10 w-full px-6 md:px-12 py-2 bg-background/80 border-b border-border flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-sans mr-1">Week</span>
        {[null, 1, 2, 3, 4, 5, 6].map((w) => (
          <button
            key={w ?? "all"}
            onClick={() => setWeekFilter(w)}
            className={`px-3 py-1 rounded-full text-xs font-sans transition-colors ${
              weekFilter === w
                ? "bg-amber-800 text-white"
                : "bg-amber-900/10 text-amber-900 hover:bg-amber-900/20"
            }`}
          >
            {w === null ? "All" : `Week ${w}`}
          </button>
        ))}
      </div>

      {/* Find Bar */}
      <div
        className={`relative z-10 w-full overflow-hidden transition-all duration-300 ease-in-out ${
          isFindOpen ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="w-full px-6 md:px-12 py-3 bg-amber-950/60 backdrop-blur-sm border-b border-amber-900/30 flex items-center gap-4">
          <Search size={16} className="text-amber-400/70 shrink-0" />
          <Input
            ref={searchInputRef}
            value={findQuery}
            onChange={(e) => setFindQuery(e.target.value)}
            placeholder="Search by project name or author..."
            className="flex-1 bg-amber-950/40 border-amber-800/40 text-amber-100 placeholder:text-amber-600/60 focus-visible:ring-amber-700/50 font-sans"
            data-testid="input-find"
          />
          {query && matchCount !== null && (
            <span className="text-amber-400/80 text-sm font-sans shrink-0 tabular-nums">
              {matchCount} {matchCount === 1 ? "result" : "results"}
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFindOpen(false)}
            className="text-amber-500/60 hover:text-amber-300 hover:bg-amber-900/20 shrink-0"
            data-testid="button-find-close"
          >
            <X size={16} />
          </Button>
        </div>
      </div>

      {/* Shelf Area */}
      <main className="flex-1 w-full relative z-0">
        <div className="w-full h-full min-h-[80vh] px-4 md:px-12 py-8">
          {isLoading ? (
            <div
              className="w-full grid gap-x-1"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(3.5rem, 1fr))",
                gridAutoRows: "320px",
                alignItems: "end",
              }}
            >
              {Array.from({ length: 24 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full opacity-20 bg-amber-900/50 mb-6 rounded-sm" />
              ))}
            </div>
          ) : !books || books.length === 0 ? (
            <div className="w-full h-64 flex items-center justify-center border-b-[16px] border-black/40 relative">
              <div className="absolute bottom-[-16px] w-full h-[16px] bg-amber-950/80 border-t border-amber-800/30" />
              <div className="text-center parchment-texture p-8 rounded-md border border-amber-900/30 shadow-xl max-w-md">
                <h3 className="font-serif text-2xl mb-2 text-amber-900">An Empty Library</h3>
                <p className="text-amber-800/80 mb-6 font-sans">
                  The shelves are bare. Be the first to place your vibe-coded project on the shelf.
                </p>
                <Button onClick={() => setIsAddModalOpen(true)} variant="outline" className="border-amber-900/40 text-amber-900 hover:bg-amber-900/10">
                  Add Your Book
                </Button>
              </div>
            </div>
          ) : filteredBooks.length === 0 && query ? (
            /* No search results */
            <div className="w-full h-64 flex items-center justify-center">
              <div className="text-center parchment-texture p-8 rounded-md border border-amber-900/30 shadow-xl max-w-md">
                <Search size={32} className="mx-auto mb-4 text-amber-900/40" />
                <h3 className="font-serif text-xl mb-2 text-amber-900">Nothing found</h3>
                <p className="text-amber-800/70 font-sans text-sm">
                  No books match "<span className="italic">{findQuery}</span>". Try a different name or project.
                </p>
              </div>
            </div>
          ) : (
            <div
              className="w-full grid gap-x-[2px]"
              style={{
                gridTemplateColumns: "repeat(auto-fill, 3.5rem)",
                gridAutoRows: "320px",
                alignItems: "end",
                backgroundImage:
                  "repeating-linear-gradient(to bottom, transparent, transparent 300px, rgba(30,15,5,0.8) 300px, rgba(20,10,0,0.9) 305px, rgba(0,0,0,0.8) 305px, rgba(0,0,0,0.6) 320px)",
                backgroundSize: "100% 320px",
              }}
            >
              {filteredBooks.map((book) => (
                <div key={book.id} className="pb-[20px]">
                  <BookSpine
                    book={book}
                    onClick={() => setSelectedBook(book)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {selectedBook && (
        <BookDetails
          book={selectedBook}
          isOpen={!!selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}

      {/* Add Book Modal */}
      <AddBookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
