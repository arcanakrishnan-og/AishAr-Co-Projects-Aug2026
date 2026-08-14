import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { Book } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Github, ExternalLink, Mail, Calendar, BookOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteBook } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getListBooksQueryKey, getGetShelfStatsQueryKey } from "@workspace/api-client-react";

interface BookDetailsProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
}

export function BookDetails({ book, isOpen, onClose }: BookDetailsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const deleteBook = useDeleteBook();

  const handleDelete = () => {
    if (confirm("Are you sure you want to remove this book from the shelf?")) {
      deleteBook.mutate(
        { id: book.id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListBooksQueryKey() });
            queryClient.invalidateQueries({ queryKey: getGetShelfStatsQueryKey() });
            toast({
              title: "Book removed",
              description: "The book has been taken off the shelf.",
            });
            onClose();
          },
          onError: () => {
            toast({
              title: "Error",
              description: "Could not remove the book. The magic faded.",
              variant: "destructive",
            });
          }
        }
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md parchment-texture border-amber-900/20 shadow-2xl bg-card text-card-foreground p-0 overflow-hidden rounded-md">
        
        {/* Top colored binding matching the book spine */}
        <div 
          className="h-3 w-full" 
          style={{ backgroundColor: book.spineColor }}
        />
        
        <div className="p-8">
          <DialogHeader className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-amber-800/60 font-sans text-sm tracking-widest uppercase">
                <BookOpen size={16} />
                <span>Volume No. {book.id}</span>
              </div>
            </div>
            
            <DialogTitle className="text-3xl font-serif text-amber-950 leading-tight">
              {book.projectName}
            </DialogTitle>
            
            <DialogDescription className="text-lg font-serif italic text-amber-900/80 mt-2">
              by {book.firstName} {book.lastName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-900/20 to-transparent" />
            
            <div className="flex flex-col gap-4 font-sans">
              <a 
                href={book.githubLink} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-3 text-amber-950 hover:text-amber-700 transition-colors group"
              >
                <div className="p-2 rounded-full bg-amber-900/5 group-hover:bg-amber-900/10 transition-colors">
                  <Github size={18} />
                </div>
                <span className="font-medium underline decoration-amber-900/30 underline-offset-4">Source Code Repository</span>
              </a>

              {book.liveLink && (
                <a 
                  href={book.liveLink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-3 text-amber-950 hover:text-amber-700 transition-colors group"
                >
                  <div className="p-2 rounded-full bg-amber-900/5 group-hover:bg-amber-900/10 transition-colors">
                    <ExternalLink size={18} />
                  </div>
                  <span className="font-medium underline decoration-amber-900/30 underline-offset-4">Live Demonstration</span>
                </a>
              )}

              {book.email && (
                <a 
                  href={`mailto:${book.email}`} 
                  className="flex items-center gap-3 text-amber-950 hover:text-amber-700 transition-colors group"
                >
                  <div className="p-2 rounded-full bg-amber-900/5 group-hover:bg-amber-900/10 transition-colors">
                    <Mail size={18} />
                  </div>
                  <span className="font-medium underline decoration-amber-900/30 underline-offset-4">Contact for Collaboration</span>
                </a>
              )}
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-900/20 to-transparent mt-6" />

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-sm text-amber-900/60 font-sans">
                <Calendar size={14} />
                <span>Placed on shelf {format(new Date(book.createdAt), 'MMMM do, yyyy')}</span>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleDelete}
                disabled={deleteBook.isPending}
                className="text-amber-900/40 hover:text-destructive hover:bg-destructive/10 h-8 w-8 rounded-full"
                title="Remove book"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}