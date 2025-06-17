# 🏠 Room Visualizer - Interactive Carousel Experience

A modern, interactive room visualization application built with Next.js, TypeScript, and Framer Motion. Features a sophisticated carousel system with smooth animations, drag interactions, and responsive design.

## ✨ Live Demo

[View Live Project](https://room-carousel-wheat.vercel.app/)

## 🚀 Features

### 🎯 Core Functionality
- **Dual Mode Interface**: Seamless switching between fullscreen single-room view and multi-room carousel mode
- **Interactive Carousel**: Smooth drag-to-navigate with momentum and snap-to-card behavior
- **Dynamic Room Management**: Add rooms dynamically with visual feedback
- **Responsive Design**: Optimized for both desktop and mobile experiences

### 🎨 Animation & Interactions
- **Framer Motion Animations**: Spring-based transitions with custom easing curves
- **Drag Gestures**: Multi-touch and mouse drag support with velocity-based navigation
- **Wheel Scrolling**: Mouse wheel navigation with debounced snap behavior
- **Hover Effects**: Micro-interactions with scale, color, and border transitions
- **Blur Effects**: Depth-of-field simulation for inactive cards
- **Smooth Transitions**: 60fps animations with hardware acceleration

### 🎛️ UI/UX Highlights
- **Glass Morphism**: Backdrop blur effects on floating action buttons
- **Smart Positioning**: Context-aware button placement and visibility
- **Accessibility**: Keyboard navigation support and ARIA labels
- **Performance**: Optimized image loading with Next.js Image component
- **Type Safety**: Full TypeScript implementation with strict typing

## 🛠️ Technical Implementation

### Architecture
```
src/
├── components/
│   ├── RoomCarousel.tsx      # Main carousel with drag/wheel logic
│   ├── RoomVisualizer.tsx    # State management and layout
│   └── AddRoomButton.tsx     # Floating action button
├── utils/
│   └── roomUtils.ts          # Room data management
└── app/
    └── page.tsx              # Entry point
```

### Key Technical Decisions

#### 1. **Framer Motion Integration**
```typescript
// Spring-based animations for natural feel
const cardStyle = (i: number) => ({
  scale: isActive ? 1 : 0.96,
  opacity: isActive ? 1 : 0.5,
  filter: isRoomsMode ? (isActive ? 'blur(0px)' : 'blur(8px)') : 'blur(0px)',
  transition: 'all 0.3s cubic-bezier(.4,0,.2,1)'
});
```

#### 2. **Drag Interaction System**
```typescript
// Velocity and offset-based navigation
const handleDragEnd = (_, info: PanInfo) => {
  const velocity = info.velocity.x;
  const offset = info.offset.x;
  let next = activeIndex;
  if (velocity < -300 || offset < -cardFull / 4) next += 1;
  if (velocity > 300 || offset > cardFull / 4) next -= 1;
  snapTo(next);
};
```

#### 3. **Responsive Card Sizing**
```typescript
// Dynamic card width calculation
const getCardWidth = () => {
  if (isRoomsMode) {
    return window.innerWidth * (window.innerWidth >= 768 ? 0.6 : 0.7);
  } else {
    return window.innerWidth * (window.innerWidth >= 768 ? 0.8 : 0.9);
  }
};
```

#### 4. **Component Refactoring**
- **Reusable ActionButton**: Eliminated code duplication across all buttons
- **Configuration Arrays**: Centralized button definitions for easy maintenance
- **Custom Hooks**: Separated concerns for better testability

### Animation Details

#### **Carousel Transitions**
- **Spring Physics**: Natural bounce and damping for card movements
- **Staggered Animations**: Sequential card reveals with calculated delays
- **Blur Depth**: Progressive blur effect for depth perception

#### **Button Interactions**
- **Hover States**: Color transitions with group hover effects
- **Scale Animations**: Subtle 1.05x scale on hover for tactile feedback
- **Icon Transitions**: Synchronized icon color changes

#### **Mode Switching**
- **Smooth Transitions**: Crossfade between single and carousel modes
- **Layout Animations**: Responsive container resizing
- **State Preservation**: Maintains scroll position during mode changes

## 🎯 Performance Optimizations

### **Image Loading**
- Next.js Image component with automatic optimization
- Priority loading for active cards
- Responsive sizing with `sizes` attribute

### **Animation Performance**
- Hardware-accelerated transforms (transform3d)
- Debounced wheel events to prevent excessive calculations
- Efficient re-renders with React.memo and useCallback

### **Bundle Optimization**
- Tree-shaking for unused Framer Motion features
- Dynamic imports for heavy components
- Optimized TypeScript compilation

## 🎨 Design System

### **Color Palette**
- Primary: `#444` (Dark gray for buttons)
- Secondary: `gray-200` (Light gray for hover states)
- Accent: `white/10` (Glass morphism effect)

### **Typography**
- Font: System fonts with fallbacks
- Weights: Medium (400) and Semibold (600)
- Sizes: Responsive text scaling

### **Spacing**
- Gap: 48px (gap-12) between carousel items
- Padding: Consistent 16px (px-4) for buttons
- Margins: 8px (gap-2) for icon spacing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/room-visualizer.git
cd room-visualizer

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

## 🧪 Testing

```bash
# Run linting
npm run lint

# Type checking
npm run type-check
```

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion 12
- **Icons**: Phosphor Icons
- **Deployment**: Vercel (recommended)

---

**Built with ❤️ using modern web technologies**
