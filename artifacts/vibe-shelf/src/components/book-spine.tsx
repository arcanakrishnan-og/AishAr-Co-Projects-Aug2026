import { motion } from "framer-motion";
import type { Book } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

interface BookSpineProps {
  book: Book;
  onClick: () => void;
}

export function BookSpine({ book, onClick }: BookSpineProps) {
  // Extract initials
  const firstInitial = book.firstName ? book.firstName.charAt(0).toUpperCase() : "";
  const lastInitial = book.lastName ? book.lastName.charAt(0).toUpperCase() : "";

  return (
    <motion.button
      whileHover={{ y: -20, scale: 1.02, zIndex: 20 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative w-full h-[280px] rounded-sm flex flex-col items-center py-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
        // A subtle shadow that anchors it to the shelf
        "shadow-[-3px_0px_10px_rgba(0,0,0,0.4)]"
      )}
      style={{
        backgroundColor: book.spineColor,
        // Add a gradient to simulate a curved book spine lighting
        backgroundImage: `linear-gradient(to right, 
          rgba(255,255,255,0.1) 0%, 
          rgba(255,255,255,0.2) 15%, 
          rgba(0,0,0,0) 30%, 
          rgba(0,0,0,0.1) 85%, 
          rgba(0,0,0,0.4) 100%)`
      }}
    >
      {/* Texture overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]"></div>

      {/* Details/Decorations */}
      <div className="w-full flex-1 flex flex-col items-center justify-between z-10 text-white/90 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
        
        {/* Top decorations & Initials */}
        <div className="flex flex-col items-center gap-2">
          {/* Gold bars */}
          <div className="w-full flex flex-col gap-[2px]">
            <div className="h-[2px] w-full bg-gradient-to-r from-amber-300/30 via-amber-200/60 to-amber-300/30"></div>
            <div className="h-[4px] w-full bg-gradient-to-r from-amber-300/30 via-amber-200/60 to-amber-300/30"></div>
          </div>
          
          <div className="font-serif text-lg leading-none font-bold tracking-widest mt-2 flex flex-col items-center">
            <span>{firstInitial}</span>
            <span>{lastInitial}</span>
          </div>
        </div>

        {/* Project Name (Rotated) */}
        <div className="flex-1 flex items-center justify-center w-full relative my-4">
          <div 
            className="absolute whitespace-nowrap font-serif text-sm tracking-widest uppercase origin-center -rotate-90"
            style={{ width: '200px', textAlign: 'center' }}
          >
            <span className="truncate block max-w-full px-2" title={book.projectName}>
              {book.projectName}
            </span>
          </div>
        </div>

        {/* Bottom decorations */}
        <div className="w-full flex flex-col items-center gap-2 mb-2">
          <div className="text-[10px] font-sans opacity-70">
            {new Date(book.createdAt).getFullYear()}
          </div>
          <div className="w-full flex flex-col gap-[2px]">
            <div className="h-[4px] w-full bg-gradient-to-r from-amber-300/30 via-amber-200/60 to-amber-300/30"></div>
            <div className="h-[2px] w-full bg-gradient-to-r from-amber-300/30 via-amber-200/60 to-amber-300/30"></div>
          </div>
        </div>
      </div>
    </motion.button>
  );
}