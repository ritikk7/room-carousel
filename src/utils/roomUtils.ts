// Utility function to get all room images from the public/rooms folder
export const getRoomImages = (): string[] => {
  // In a Next.js app, we can't directly read the filesystem at runtime
  // So we'll define the available images based on what we know exists
  // This could be replaced with an API call in a real application
  
  const roomImages = [
    '/rooms/living-room.jpg',
    '/rooms/study-room.jpg', 
    '/rooms/bed-room.jpg',
    '/rooms/drew-coffman-jUOaONoXJQk-unsplash.jpg',
    '/rooms/spacejoy-TKFskJy8PQ8-unsplash.jpg',
    '/rooms/patrick-perkins-3wylDrjxH-E-unsplash.jpg',
    '/rooms/spacejoy-9M66C_w_ToM-unsplash.jpg',
    '/rooms/francesca-tosolini-tHkJAMcO3QE-unsplash.jpg',
    '/rooms/francesca-tosolini-w1RE0lBbREo-unsplash.jpg',
    '/rooms/spacejoy-umAXneH4GhA-unsplash.jpg',
    '/rooms/benjamin-child-0sT9YhNgSEs-unsplash.jpg'
  ];
  
  return roomImages;
};

// Get initial rooms (first 2 by default)
export const getInitialRooms = (): string[] => {
  const allRooms = getRoomImages();
  return allRooms.slice(0, 2);
};

// Get the next available room to add
export const getNextAvailableRoom = (currentRooms: string[]): string | null => {
  const allRooms = getRoomImages();
  const nextIndex = currentRooms.length;
  
  if (nextIndex >= allRooms.length) {
    return null; // No more rooms available
  }
  
  return allRooms[nextIndex];
}; 