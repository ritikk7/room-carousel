import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useAnimationControls, PanInfo, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { SignOut, House, SquaresFour, ShareFat, Check, Heart, Copy, IconProps, IconWeight } from '@phosphor-icons/react';

interface RoomCarouselProps {
  rooms: string[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  isRoomsMode: boolean;
  onChangeRoom?: () => void;
  onToggleRoomsMode?: () => void;
}

// Constants
const CARD_WIDTH_ROOMS = 0.7; // 70vw
const CARD_WIDTH_ROOMS_MD = 0.6; // 60vw
const CARD_WIDTH_SINGLE = 0.9; // 90vw
const CARD_WIDTH_SINGLE_MD = 0.8; // 80vw
const GAP = 48; // px, gap-12
const DRAG_VELOCITY_THRESHOLD = 300;
const DRAG_OFFSET_THRESHOLD = 0.25; // 1/4 of card width
const WHEEL_SNAP_DELAY = 120;

// Button configuration
const TOP_BAR_BUTTONS = [
  { icon: SignOut, label: 'EXIT', onClick: undefined },
  { icon: House, label: 'CHANGE ROOM', onClick: 'onChangeRoom' },
  { icon: SquaresFour, label: 'ROOMS', onClick: 'onToggleRoomsMode' },
  { icon: ShareFat, label: 'SHARE', onClick: undefined }
] as const;

const CARD_ACTION_BUTTONS = [
  { icon: ShareFat, label: 'SHARE' },
  { icon: Heart, label: 'FAVORITE' },
  { icon: Copy, label: 'DUPLICATE' }
] as const;

// Reusable Button Component
interface ActionButtonProps {
  icon: React.ComponentType<IconProps>;
  label: string;
  onClick?: () => void;
  size?: 'sm' | 'md';
  className?: string;
}

const ActionButton = ({ icon: Icon, label, onClick, size = 'md', className = '' }: ActionButtonProps) => {
  const baseClasses = "flex items-center gap-2 px-4 py-2 rounded-xl bg-[#444] text-white shadow transition hover:bg-gray-200 hover:text-gray-900 hover:font-semibold hover:border hover:border-gray-300 group";
  const sizeClasses = size === 'sm' ? 'text-xs' : 'text-sm font-medium';
  
  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses} ${className}`}
    >
      <Icon 
        size={size === 'sm' ? 16 : 20} 
        weight={"bold" as IconWeight}
        className="text-white group-hover:text-gray-900" 
      />
      {label}
    </button>
  );
};

// Empty State Component
const EmptyState = ({ isRoomsMode }: { isRoomsMode: boolean }) => (
  <div className={`${isRoomsMode ? 'w-full h-full flex items-center justify-center' : 'fixed inset-0 w-screen h-screen bg-black flex items-center justify-center'}`}>
    <div className={`text-center ${isRoomsMode ? 'text-gray-400' : 'text-white'}`}>
      <div className="text-lg">No rooms available</div>
      <div className={`text-sm ${isRoomsMode ? 'text-gray-400' : 'text-gray-400'}`}>Add some rooms to get started</div>
    </div>
  </div>
);

export const RoomCarousel = ({
  rooms,
  activeIndex,
  setActiveIndex,
  isRoomsMode,
  onChangeRoom,
  onToggleRoomsMode
}: RoomCarouselProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const x = useMotionValue(0);
  const isDragging = useMotionValue(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [cardFull, setCardFull] = useState(0);
  const [centerOffset, setCenterOffset] = useState(0);
  const [maxDrag, setMaxDrag] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  // Sync isDragging MotionValue with React state
  useEffect(() => {
    const unsubscribe = isDragging.on("change", (latest) => {
      setIsDragActive(latest);
    });
    return () => unsubscribe();
  }, [isDragging]);

  // Responsive card width based on mode
  const getCardWidth = useCallback(() => {
    if (typeof window === 'undefined') return 0;
    if (isRoomsMode) {
      return window.innerWidth * (window.innerWidth >= 768 ? CARD_WIDTH_ROOMS_MD : CARD_WIDTH_ROOMS);
    } else {
      return window.innerWidth * (window.innerWidth >= 768 ? CARD_WIDTH_SINGLE_MD : CARD_WIDTH_SINGLE);
    }
  }, [isRoomsMode]);

  // Measure card width, center offset, and max drag
  const recalc = useCallback(() => {
    const cardW = getCardWidth();
    setCardFull(cardW + GAP);
    setWindowWidth(window.innerWidth);
    if (wrapperRef.current) {
      const center = (wrapperRef.current.clientWidth - cardW) / 2;
      setCenterOffset(center);
      setMaxDrag(Math.max(0, (cardW + GAP) * (rooms.length - 1)));
      // Snap to active card
      controls.set({ x: -activeIndex * (cardW + GAP) + center });
      x.set(-activeIndex * (cardW + GAP) + center);
    }
  }, [rooms.length, activeIndex, controls, x, getCardWidth]);

  useEffect(() => {
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, [recalc]);

  // Snap to a specific index
  const snapTo = (idx: number) => {
    const bounded = Math.max(0, Math.min(idx, rooms.length - 1));
    setActiveIndex(bounded);
    controls.start({ x: -bounded * cardFull + centerOffset });
  };

  // Handle drag start
  const handleDragStart = useCallback(() => {
    isDragging.set(true);
  }, [isDragging]);

  // Drag end logic
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const velocity = info.velocity.x;
    const offset = info.offset.x;
    let next = activeIndex;
    if (velocity < -DRAG_VELOCITY_THRESHOLD || offset < -cardFull * DRAG_OFFSET_THRESHOLD) next += 1;
    if (velocity > DRAG_VELOCITY_THRESHOLD || offset > cardFull * DRAG_OFFSET_THRESHOLD) next -= 1;
    snapTo(next);
    isDragging.set(false);
  };

  // Wheel scroll logic
  const handleWheel = (e: React.WheelEvent) => {
    if (!isRoomsMode) return;
    e.preventDefault();
    const newX = Math.max(-maxDrag + centerOffset, Math.min(centerOffset, x.get() - e.deltaY));
    x.set(newX);
    // Snap after short delay
    clearTimeout((handleWheel as { _t?: NodeJS.Timeout })._t);
    (handleWheel as { _t?: NodeJS.Timeout })._t = setTimeout(() => {
      snapTo(Math.round(Math.abs(newX - centerOffset) / cardFull));
    }, WHEEL_SNAP_DELAY);
  };

  // Card style (blur/scale/opacity)
  const cardStyle = (i: number) => {
    const isActive = i === activeIndex;
    return {
      scale: isActive ? 1 : 0.96,
      opacity: isActive ? 1 : 0.5,
      filter: isRoomsMode ? (isActive ? 'blur(0px)' : 'blur(8px)') : 'blur(0px)',
      zIndex: isActive ? 2 : 1,
      transition: 'all 0.3s cubic-bezier(.4,0,.2,1)'
    };
  };

  // Top bar with icons and hover styling
  const renderTopBar = () => (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 flex gap-3 z-30 px-4 py-2 rounded-xl shadow-lg">
      {!isRoomsMode ? (
        <>
          {TOP_BAR_BUTTONS.map(({ icon, label, onClick }) => (
            <ActionButton
              key={label}
              icon={icon}
              label={label}
              onClick={onClick === 'onChangeRoom' ? onChangeRoom : onClick === 'onToggleRoomsMode' ? onToggleRoomsMode : undefined}
            />
          ))}
        </>
      ) : (
        <ActionButton
          icon={Check}
          label="DONE"
          onClick={onToggleRoomsMode}
        />
      )}
    </div>
  );

  // Handle empty rooms
  if (rooms.length === 0) {
    return (
      <>
        <EmptyState isRoomsMode={isRoomsMode} />
        {renderTopBar()}
      </>
    );
  }

  if (!isRoomsMode) {
    // Fullscreen image, no border, no peeking, no rounded corners
    const boundedIndex = Math.min(Math.max(activeIndex, 0), rooms.length - 1);
    return (
      <div className="fixed inset-0 w-screen h-screen bg-black">
        <Image
          src={rooms[boundedIndex]}
          alt={`Room ${boundedIndex + 1}`}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        {renderTopBar()}
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="w-full h-full overflow-hidden flex items-center select-none relative" onWheel={handleWheel}>
      {renderTopBar()}
      <motion.div
        ref={trackRef}
        className="flex gap-12"
        drag={rooms.length > 1 ? 'x' : false}
        dragElastic={0.05}
        dragMomentum={false}
        dragConstraints={{ left: -maxDrag + centerOffset, right: centerOffset }}
        style={{ x }}
        animate={controls}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        whileDrag={{ cursor: 'grabbing' }}
      >
        {rooms.map((room, i) => (
          <motion.div
            key={room}
            className="shrink-0 rounded-xl relative bg-gray-200"
            style={{
              width: windowWidth >= 768 ? '60vw' : '70vw',
              height: '70vh',
              ...cardStyle(i)
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
          >
            <Image
              src={room}
              alt={`Room ${i + 1}`}
              fill
              sizes="70vw"
              className="object-cover"
              priority={i === activeIndex}
              draggable={false}
            />
            {/* Action buttons for active card in rooms mode */}
            <AnimatePresence>
              {isRoomsMode && i === activeIndex && !isDragActive && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-[-4rem] right-4 flex gap-2 z-10"
                >
                  {CARD_ACTION_BUTTONS.map(({ icon, label }) => (
                    <ActionButton
                      key={label}
                      icon={icon}
                      label={label}
                      size="sm"
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}; 