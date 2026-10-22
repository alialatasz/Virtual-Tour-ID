"use client"

import MorphGallery from "@/components/ui/morph-gallery"

const CAGAR_BUDAYA_ITEMS = [
  {
    src: "https://images.unsplash.com/photo-1596401057658-3e54589d972c?q=80&w=1200",
    thumb: "https://images.unsplash.com/photo-1596401057658-3e54589d972c?q=80&w=300",
    alt: "Candi Borobudur di pagi hari",
  },
  {
    src: "https://images.unsplash.com/photo-1583002621764-67210e30cb70?q=80&w=1200",
    thumb: "https://images.unsplash.com/photo-1583002621764-67210e30cb70?q=80&w=300",
    alt: "Candi Prambanan yang megah",
  },
  {
    src: "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?q=80&w=1200",
    thumb: "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?q=80&w=300",
    alt: "Pura Ulun Danu Bratan di Bali",
  },
  {
    src: "https://images.unsplash.com/photo-1627885065097-09fba24ad69f?q=80&w=1200",
    thumb: "https://images.unsplash.com/photo-1627885065097-09fba24ad69f?q=80&w=300",
    alt: "Kemegahan arsitektur Candi",
  },
  {
    src: "https://images.unsplash.com/photo-1532186651327-6ac236ad4dc9?q=80&w=1200",
    thumb: "https://images.unsplash.com/photo-1532186651327-6ac236ad4dc9?q=80&w=300",
    alt: "Pura Tanah Lot saat matahari terbenam",
  },
]

export default function CagarBudayaGallery() {
  // w-full is load-bearing: it ensures the gallery takes the full width of its container.
  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl">
      <MorphGallery items={CAGAR_BUDAYA_ITEMS} autoplay={4500} height="600px" />
    </div>
  )
}
