import { motion, AnimatePresence } from 'framer-motion';

interface ProfileSectionProps {
  isCollapsed?: boolean;
  onExpand?: () => void;
}

export default function ProfileSection({ isCollapsed = false, onExpand }: ProfileSectionProps) {
  return (
    <div className="space-y-2">
      <h1 className="font-geometric text-lg font-bold text-foreground tracking-wide leading-normal">
        Chris Thomas
      </h1>
      
      <AnimatePresence mode="wait">
        {!isCollapsed ? (
          <motion.div 
            key="expanded"
            className="space-y-1.5"
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: 1, 
              height: "auto",
              transition: { 
                duration: 0.4, 
                ease: [0.25, 0.1, 0.25, 1],
                opacity: { duration: 0.3, delay: 0.1 }
              }
            }}
            exit={{ 
              opacity: 0, 
              height: 0,
              transition: { 
                duration: 0.4, 
                ease: [0.25, 0.1, 0.25, 1],
                opacity: { duration: 0.3 }
              }
            }}
          >
            <p className="font-geometric text-lg font-normal text-foreground tracking-wide leading-normal">
              Product Design Engineer building humanoid robots
            </p>
            <p className="font-geometric text-lg font-normal text-foreground tracking-wide leading-normal opacity-50">
              Designing with care and intent, guiding technology to serve humanity in tangible ways.
            </p>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            className="font-geometric text-base underline underline-offset-4 text-muted-foreground hover:text-foreground transition-colors"
            onClick={onExpand}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            More...
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}