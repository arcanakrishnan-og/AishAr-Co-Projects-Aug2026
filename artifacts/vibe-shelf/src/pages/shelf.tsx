import { useState } from "react";
import { useListBooks, useGetShelfStats } from "@workspace/api-client-react";
import type { Book } from "@workspace/api-client-react";
import { BookSpine } from "@/components/book-spine";
import { BookDetails } from "@/components/book-details";
import { AddBookModal } from "@/components/add-book";
import { Button } from "@/components/ui/button";
import { Plus, Library } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShelfPage() {
  const { data: books, isLoading } = useListBooks();
  const { data: stats } = useGetShelfStats();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background wood-texture text-foreground flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="relative z-10 w-full p-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 bg-background/90 backdrop-blur-md border-b border-border shadow-md">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/20 rounded-full text-primary border border-primary/30">
            <Library size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary tracking-wide">Vibe Shelf</h1>
            <p className="text-sm text-muted-foreground font-sans mt-1">
              A community bookshelf of vibe-coded GitHub projects.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {stats && (
            <div className="text-right hidden md:block">
              <div className="text-2xl font-serif text-foreground">{stats.totalBooks}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Volumes</div>
            </div>
          )}
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="font-serif tracking-wide shadow-lg hover:scale-105 transition-transform"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Your Book
          </Button>
        </div>
      </header>

      {/* Shelf Area */}
      <main className="flex-1 w-full relative z-0">
        <div className="w-full h-full min-h-[80vh] px-4 md:px-12 py-8">
          {/* Books Container */}
          {isLoading ? (
            <div 
              className="w-full grid gap-x-1" 
              style={{ 
                gridTemplateColumns: 'repeat(auto-fill, minmax(3.5rem, 1fr))',
                gridAutoRows: '320px',
                alignItems: 'end'
              }}
            >
              {Array.from({ length: 24 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full opacity-20 bg-amber-900/50 mb-6 rounded-sm" />
              ))}
            </div>
          ) : !books || books.length === 0 ? (
            <div className="w-full h-64 flex items-center justify-center border-b-[16px] border-black/40 relative">
              <div className="absolute bottom-[-16px] w-full h-[16px] bg-amber-950/80 border-t border-amber-800/30"></div>
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
          ) : (
            <div 
              className="w-full grid gap-x-[2px]" 
              style={{ 
                gridTemplateColumns: 'repeat(auto-fill, 3.5rem)',
                gridAutoRows: '320px',
                alignItems: 'end',
                // Draw shelves!
                backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 300px, rgba(30,15,5,0.8) 300px, rgba(20,10,0,0.9) 305px, rgba(0,0,0,0.8) 305px, rgba(0,0,0,0.6) 320px)',
                backgroundSize: '100% 320px'
              }}
            >
              {books.map((book) => (
                <div key={book.id} className="pb-[20px]"> {/* padding-bottom to sit exactly on the shelf line */}
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