import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { RoomCarousel } from './RoomCarousel';
import { AddRoomButton } from './AddRoomButton';
import { getInitialRooms, getNextAvailableRoom } from '@/utils/roomUtils';

export const RoomVisualizer = () => {
  const [isRoomsMode, setIsRoomsMode] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [roomList, setRoomList] = useState<string[]>([]);

  // Load initial rooms on component mount
  useEffect(() => {
    const initialRooms = getInitialRooms();
    setRoomList(initialRooms);
  }, []);

  const addRoom = () => {
    // Get the next available room
    const nextRoom = getNextAvailableRoom(roomList);
    
    if (!nextRoom) {
      // Show alert or handle "no more rooms available"
      alert('No more rooms available to add');
      return;
    }

    // Add the next available room
    setRoomList([...roomList, nextRoom]);
    setActiveIndex(roomList.length); // Focus on the newly added room
  };

  return (
    <div className={`fixed inset-0 w-screen h-screen ${isRoomsMode ? 'bg-neutral-800' : 'bg-black'}`}>
      <div className="relative w-full h-full">
        <AnimatePresence>
          {/* Removed dead AnimatePresence block that was never rendered */}
        </AnimatePresence>

        <div className="w-full h-full">
          <RoomCarousel
            rooms={roomList}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            isRoomsMode={isRoomsMode}
            onToggleRoomsMode={() => setIsRoomsMode(!isRoomsMode)}
            onChangeRoom={() => setActiveIndex((prev) => (prev + 1) % roomList.length)}
          />
        </div>

        <AddRoomButton
          onClick={addRoom}
          isRoomsMode={isRoomsMode}
          isLastCardActive={activeIndex === roomList.length - 1}
        />
      </div>
    </div>
  );
}; 