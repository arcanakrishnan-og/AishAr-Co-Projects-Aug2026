import { motion } from "framer-motion";
import type { Book } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

const getPixelArt = (type: number) => {
  let layout: string[] = [];
  let colors: Record<string, string> = {};

  switch (type) {
    case 0:
      layout = [
        "   RRRR   ",
        "  RRRRRRR ",
        "  OOYYYKO ",
        " OYOYYYKOY",
        " OYOOYYYOY",
        " OOOYYYY  ",
        "   YYYYY  ",
        "  RRBRR   ",
        " RRRBRRR  ",
        "RRRRBRRRR ",
        "YYRBYBRYY ",
        "YYYBBBYYY ",
        "YYBBBBBBYY",
        "  OO OO   "
      ];
      colors = { R: '#E52521', B: '#0043A1', O: '#8B4513', Y: '#FFCC99', K: '#000000' };
      break;
    case 1:
      layout = [
        "          ",
        "   RRRR   ",
        "  RWWWRR  ",
        " RRWWWRRR ",
        " RRRRRWWR ",
        " RRRRRWWR ",
        "  RRRRRR  ",
        "   YYYY   ",
        "  YYKKY   ",
        "  YYYYY   ",
        "  YYYYY   ",
        "   YYY    ",
        "          ",
        "          "
      ];
      colors = { R: '#E52521', W: '#FFFFFF', Y: '#FFCC99', K: '#000000' };
      break;
    case 2:
      layout = [
        "          ",
        "    YY    ",
        "   YYYY   ",
        "   YYYY   ",
        "YYYYYYYYYY",
        " YYYYYYYY ",
        "  YKYKYY  ",
        "  YKYKYY  ",
        "  YYYYYY  ",
        "  YYYYYY  ",
        " YYY  YYY ",
        " YY    YY ",
        "          ",
        "          "
      ];
      colors = { Y: '#FFD700', K: '#000000' };
      break;
    case 3:
      layout = [
        "          ",
        "   YYYY   ",
        "  YOOOOY  ",
        " YOY  YOY ",
        " YOY YYOY ",
        " YOY YYOY ",
        " YOY YYOY ",
        " YOY YYOY ",
        " YOY  YOY ",
        "  YOOOOY  ",
        "   YYYY   ",
        "          ",
        "          "
      ];
      colors = { Y: '#FFD700', O: '#B8860B' };
      break;
    case 4:
      layout = [
        "          ",
        "          ",
        "   OOOO   ",
        "  OOOOOO  ",
        " OOKKOOKO ",
        " OKWWKOWK ",
        " OKKWKOWK ",
        " OOOOOOOO ",
        "  OOOOOO  ",
        "   YYYY   ",
        "  KKYYKK  ",
        " KKKYYKKK ",
        " KK    KK ",
        "          "
      ];
      colors = { O: '#8B4513', K: '#000000', W: '#FFFFFF', Y: '#FFCC99' };
      break;
    case 5:
      layout = [
        "          ",
        "          ",
        "   GGGG   ",
        "  GKKKKG  ",
        " GKGWWGKG ",
        " GKGWWGKG ",
        " GKGWWGKG ",
        " GKGWWGKG ",
        " GKGWWGKG ",
        "  GKKKKG  ",
        "   GGGG   ",
        "   WWWW   ",
        "          ",
        "          "
      ];
      colors = { G: '#00AA00', K: '#000000', W: '#FFFFFF' };
      break;
    case 6:
      layout = [
        "          ",
        "   RRRR   ",
        "  ROOOOR  ",
        "  ROWWOR  ",
        "  ROWWOR  ",
        "  ROOOOR  ",
        "   RRRR   ",
        "    GG    ",
        "   GGGG   ",
        " G  GG  G ",
        " GGGGGGGG ",
        "  GGGGGG  ",
        "    GG    ",
        "          "
      ];
      colors = { R: '#E52521', O: '#FF8C00', W: '#FFFFFF', G: '#00AA00' };
      break;
    case 7:
      layout = [
        "          ",
        "   GGGG   ",
        "  GWWWGG  ",
        " GGWWWGGG ",
        " GGGGGWWG ",
        " GGGGGWWG ",
        "  GGGGGG  ",
        "   YYYY   ",
        "  YYKKY   ",
        "  YYYYY   ",
        "  YYYYY   ",
        "   YYY    ",
        "          ",
        "          "
      ];
      colors = { G: '#00AA00', W: '#FFFFFF', Y: '#FFCC99', K: '#000000' };
      break;
  }

  const shadows = [];
  for (let r = 0; r < 14; r++) {
    for (let c = 0; c < 10; c++) {
      const char = layout[r]?.[c] || ' ';
      if (char !== ' ' && colors[char]) {
        shadows.push(`${c * 3}px ${r * 3}px 0 ${colors[char]}`);
      }
    }
  }
  return shadows.join(', ');
};

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
        
        {/* Top: character above gold bars */}
        <div className="flex flex-col items-center gap-1 w-full">
          {/* Mario character above gold bars */}
          <div 
            className="w-[30px] h-[42px] relative mb-1"
            style={{ imageRendering: "pixelated" }}
          >
            <div 
              className="absolute top-0 left-0 w-[3px] h-[3px]"
              style={{ boxShadow: getPixelArt(book.id % 8) }}
            />
          </div>

          {/* Gold bars */}
          <div className="w-full flex flex-col gap-[2px]">
            <div className="h-[2px] w-full bg-gradient-to-r from-amber-300/30 via-amber-200/60 to-amber-300/30"></div>
            <div className="h-[4px] w-full bg-gradient-to-r from-amber-300/30 via-amber-200/60 to-amber-300/30"></div>
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
        <div className="w-full flex flex-col items-center gap-1 mb-2">
          <div className="w-full flex flex-col gap-[2px]">
            <div className="h-[4px] w-full bg-gradient-to-r from-amber-300/30 via-amber-200/60 to-amber-300/30"></div>
            <div className="h-[2px] w-full bg-gradient-to-r from-amber-300/30 via-amber-200/60 to-amber-300/30"></div>
          </div>
          <div className="text-[10px] font-sans opacity-70 mt-1">
            {new Date(book.createdAt).getFullYear()}
          </div>
        </div>
      </div>
    </motion.button>
  );
}