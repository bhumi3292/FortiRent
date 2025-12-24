# FortiRent Design System & Redesign Plan

## 🎨 Visual Identity

### Color Palette
- **Primary (Midnight Teal)**: `#004F5D` (Trust, Security, Premium)
- **Secondary (Electric Cyan)**: `#00D4FF` (Innovation, Energy, Highlights)
- **Backgrounds**: 
  - Main: `#F7F9FC` (Soft Cool Gray)
  - Cards/Paper: `#FFFFFF` (Pure White)
- **Text**:
  - Headings: `#002B36` (Deep Green/Black)
  - Body: `#555555` (Accessible Gray)

### Typography
- **Headings**: `Poppins` (Weights: 600, 700) - Geometric, friendly but authoritative.
- **Body**: `Roboto` (Weights: 400, 500) - Highly legible neutral sans-serif.
- **Technical/Data**: `Fira Code` - For ID numbers, coordinates, or verification codes.

---

## 📐 Layout Strategies

### 1. Global Navigation (Floating Capsule)
- **Concept**: A detached, floating navigation bar that sits independently of the page content.
- **Behavior**: Smoothly transitions from transparent/glass to solid white upon scroll.
- **Visuals**: Rounded corners (`rounded-full` or `rounded-2xl`), subtle drop shadow, centered on large screens.

### 2. Home Page (Immersive Discovery)
- **Hero Section**: 
  - Split layout: Text left, "Floating Element" 3D/Image right.
  - Background: Dynamic gradient blobs (Morphing shapes) to create depth.
- **Property Grid**: 
  - Card Style: "Overlay Mode" - High impact imagery with text overlaid on gradients.
  - Interaction: Hover lifts the card, overlaid details slide up or reveal buttons.

### 3. Property Details (Magazine Layout)
- **Header**: Full-width hero gallery (Mosaic grid of 5 images).
- **Content**: 
  - Left Column (2/3): Description, Amenities (Icon grid), Map.
  - Right Column (1/3): **Sticky Booking Card**. Stays fixed as user scrolls.
- **Aesthetics**: Clean whites, plentiful whitespace, dividers are subtle greys.

### 4. Authentication (Split Screen Glass)
- **Layout**: 50/50 Split.
  - Left: Brand visual/Illustration (Fixed).
  - Right: Form area (Scrollable).
- **Form Style**: minimalist inputs with bottom borders or soft gray backgrounds. No heavy outlines.

### 5. Dashboard (Admin/User)
- **Layout**: Sidebar with "Active Marker" (pill shape).
- **Cards**: "Glassmorphism" effect for widget backgrounds.
- **Tables**: Clean rows, hover effects, status badges (Pill shaped).

---

## 🧩 Component Structure Suggestions

### Molecules
- **`PropertyCard`**: (Redesigned) Image-centric. Title overlay.
- **`ReviewCard`**: Avatar left, bubble right.
- **`InputGroup`**: Label, Input, optional Icon prefix.

### Atoms
- **`Button`**: 
  - Primary: Gradient Background, Rounded-xl, Shadow-lg.
  - Secondary: Ghost/Outline with colored text.
- **`Badge`**: Pill shape, uppercase text, pastel background + dark text.
- **`Avatar`**: Circle, border-2, status dot indicator.

---

## 🚀 Implementation Roadmap
1. [x] **Navbar**: Convert to Floating Capsule.
2. [x] **PropertyCard**: Convert to Overlay Style.
3. [ ] **Home Page**: Update Hero patterns and spacing.
4. [ ] **Property Details**: Implement Sticky Sidebar & Mosaic Gallery.
5. [ ] **Auth Pages**: Update to Split View.
