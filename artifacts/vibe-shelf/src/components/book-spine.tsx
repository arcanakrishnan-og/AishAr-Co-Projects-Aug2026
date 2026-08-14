import { motion, useAnimation } from "framer-motion";
import { useState } from "react";
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
  const controls = useAnimation();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPages, setShowPages] = useState(false);

  const handleHoverStart = () => {
    if (!isAnimating) {
      controls.start({
        y: -22,
        scale: 1.02,
        transition: { type: "spring", stiffness: 320, damping: 22 },
      });
    }
  };

  const handleHoverEnd = () => {
    if (!isAnimating) {
      controls.start({
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 280, damping: 26 },
      });
    }
  };

  const handleClick = async () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Phase 1 — lift forward
    await controls.start({
      y: -48,
      scale: 1.05,
      transition: { duration: 0.14, ease: "easeOut" },
    });

    // Phase 2 — covers spread open
    setShowPages(true);
    await controls.start({
      scaleX: 1.38,
      transition: { duration: 0.18, ease: [0.34, 1.3, 0.64, 1] },
    });

    // Phase 3 — snap shut slightly before modal
    await controls.start({
      scaleX: 1.1,
      transition: { duration: 0.09, ease: "easeIn" },
    });

    setShowPages(false);
    setIsAnimating(false);
    onClick();

    // Settle back to idle
    controls.start({
      y: 0,
      scale: 1,
      scaleX: 1,
      transition: { duration: 0.32, ease: "easeInOut" },
    });
  };

  return (
    <motion.button
      animate={controls}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      onClick={handleClick}
      className={cn(
        "relative w-full h-[280px] rounded-sm flex flex-col items-center py-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
        "shadow-[-3px_0px_10px_rgba(0,0,0,0.4)]"
      )}
      style={{
        backgroundColor: book.spineColor,
        backgroundImage: `linear-gradient(to right, 
          rgba(255,255,255,0.1) 0%, 
          rgba(255,255,255,0.2) 15%, 
          rgba(0,0,0,0) 30%, 
          rgba(0,0,0,0.1) 85%, 
          rgba(0,0,0,0.4) 100%)`,
        zIndex: isAnimating ? 20 : undefined,
      }}
    >
      {/* Texture overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />

      {/* Pages flash — visible during opening animation */}
      {showPages && (
        <div className="absolute inset-0 rounded-sm pointer-events-none"
          style={{
            background: "linear-gradient(to right, #f5efe0 0%, #fffdf5 40%, #f5efe0 100%)",
            opacity: 0.88,
          }}
        />
      )}

      {/* Crown badge — floats above the top edge */}
      {book.isBadged && (
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
          title="AI Builder of the Week"
        >
          <span
            className="text-lg leading-none drop-shadow-[0_0_6px_rgba(255,200,0,0.9)]"
            style={{ filter: "drop-shadow(0 0 4px gold)" }}
          >
            👑
          </span>
        </div>
      )}

      {/* Details/Decorations */}
      <div className="w-full flex-1 flex flex-col items-center justify-between z-10 text-white/90 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">

        {/* Top: character above gold bars */}
        <div className="flex flex-col items-center gap-1 w-full">
          <div
            className="w-[30px] h-[42px] relative mb-1"
            style={{ imageRendering: "pixelated" }}
          >
            <div
              className="absolute top-0 left-0 w-[3px] h-[3px]"
              style={{ boxShadow: getPixelArt(book.id % 8) }}
            />
          </div>

          <div className="w-full flex flex-col gap-[2px]">
            <div className="h-[2px] w-full bg-gradient-to-r from-amber-300/30 via-amber-200/60 to-amber-300/30" />
            <div className="h-[4px] w-full bg-gradient-to-r from-amber-300/30 via-amber-200/60 to-amber-300/30" />
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
            <div className="h-[4px] w-full bg-gradient-to-r from-amber-300/30 via-amber-200/60 to-amber-300/30" />
            <div className="h-[2px] w-full bg-gradient-to-r from-amber-300/30 via-amber-200/60 to-amber-300/30" />
          </div>
          <div className="text-[10px] font-sans opacity-70 mt-1 tracking-wide">
            {book.week != null ? `Wk ${book.week}` : "—"}
          </div>
        </div>
      </div>
    </motion.button>
  );
}
