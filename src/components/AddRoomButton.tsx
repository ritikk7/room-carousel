import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from '@phosphor-icons/react';

interface AddRoomButtonProps {
  onClick: () => void;
  isRoomsMode: boolean;
}

export const AddRoomButton = ({ onClick, isRoomsMode }: AddRoomButtonProps) => {
  return (
    <AnimatePresence>
      {isRoomsMode && (
        <motion.button
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.93 }}
          onClick={onClick}
          className="fixed right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 
            backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 
            transition-colors z-50"
        >
          <Plus size={24} weight="bold" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}; 