"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, MapPin, Filter, Map, Grid, 
  Navigation, PackagePlus, Heart, Tag, 
  Clock, CheckCircle2, AlertCircle 
} from "lucide-react";
import { useTheme } from "@providers/ThemeProvider"; // Adjust path as needed

// Mock Data (Replace with useList from Refine)
type Item = {
  id: string;
  title: string;
  category: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  distance: number; // miles
  imageUrl: string;
  postedAt: string;
  tags: string[];
  isHot?: boolean; // lots of requests
  latitude: number;
  longitude: number;
};

const MOCK_ITEMS: Item[] = [
  {
    id: "1",
    title: "Vintage Denim Jacket",
    category: "Clothing",
    condition: "Good",
    distance: 1.2,
    imageUrl: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=800",
    postedAt: "2h ago",
    tags: ["Denim", "Vintage", "Size M"],
    isHot: true,
    latitude: 40.7128,
    longitude: -74.0060
  },
  {
    id: "2",
    title: "Unused Blender",
    category: "Household",
    condition: "New",
    distance: 3.5,
    imageUrl: "https://images.unsplash.com/photo-1570222094114-28a9d88a2b64?auto=format&fit=crop&q=80&w=800",
    postedAt: "5h ago",
    tags: ["Kitchen", "Electronics"],
    latitude: 40.7200,
    longitude: -74.0100
  },
  {
    id: "3",
    title: "Leather Boots",
    category: "Shoes",
    condition: "Like New",
    distance: 0.5,
    imageUrl: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=800",
    postedAt: "10m ago",
    tags: ["Leather", "Size 10"],
    latitude: 40.7300,
    longitude: -73.9950
  },
  // Add more items...
];

export default function HomePage() {
  const router = useRouter();
  const { theme } = useTheme();
  
  const [viewMode, setViewMode] = useState<"map" | "grid">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // --- Grid Item Component ---
  const ItemCard = ({ item }: { item: Item }) => (
    <div 
      onClick={() => router.push(`/items/${item.id}`)}
      className={`
        group relative rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer
        hover:-translate-y-1 hover:shadow-xl
        ${theme === "dark" 
          ? "bg-zinc-900/40 border-zinc-800 hover:border-teal-500/30 hover:shadow-teal-900/20" 
          : "bg-white border-gray-200 hover:border-teal-300 hover:shadow-teal-100"
        }
      `}
    >
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={item.imageUrl} 
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
        
        {/* Condition Badge */}
        <div className={`
          absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border
          ${item.condition === 'New' 
            ? "bg-teal-500/20 text-teal-300 border-teal-500/30" 
            : "bg-black/30 text-white border-white/20"
          }
        `}>
          {item.condition}
        </div>

        {/* Hot Badge */}
        {item.isHot && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-orange-500/90 text-white text-[10px] font-bold flex items-center gap-1 shadow-lg animate-pulse">
            <span className="w-1.5 h-1.5 bg-white rounded-full" />
            Hot Drop
          </div>
        )}

        {/* Distance Badge (Bottom Left) */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs text-zinc-300 font-medium">
          <MapPin className="w-3.5 h-3.5 text-teal-400" />
          {item.distance} mi away
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className={`font-semibold text-lg line-clamp-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {item.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>
                {item.category}
              </span>
              <span className={`text-xs ${theme === "dark" ? "text-zinc-600" : "text-gray-400"}`}>•</span>
              <span className={`text-xs flex items-center gap-1 ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>
                <Clock className="w-3 h-3" /> {item.postedAt}
              </span>
            </div>
          </div>
          <button 
            className={`p-2 rounded-full transition-colors ${
              theme === "dark" ? "hover:bg-zinc-800 text-zinc-400" : "hover:bg-gray-100 text-gray-400"
            }`}
            onClick={(e) => { e.stopPropagation(); /* Save Logic */ }}
          >
            <Heart className="w-5 h-5" />
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag, i) => (
            <span 
              key={i} 
              className={`
                px-2 py-0.5 rounded text-[10px] font-medium border
                ${theme === "dark" 
                  ? "bg-zinc-800/50 border-zinc-700 text-zinc-400" 
                  : "bg-gray-100 border-gray-200 text-gray-600"
                }
              `}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Button */}
        <button 
          className={`
            w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]
            ${theme === "dark"
              ? "bg-white text-black hover:bg-teal-50"
              : "bg-black text-white hover:bg-zinc-800"
            }
          `}
        >
          <PackagePlus className="w-4 h-4" />
          Request Item
        </button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen p-6 ${theme === "dark" ? "bg-black text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* --- HERO SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Live Drops <span className="text-teal-500">.</span>
            </h1>
            <p className={`text-lg max-w-xl ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
              Discover free hidden gems in your neighborhood. Claim them before they're gone.
            </p>
          </div>

          {/* Main Actions */}
          <div className="flex gap-3">
            <button 
              onClick={() => router.push('/items/create')}
              className={`
                px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-teal-500/20
                bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:brightness-110
              `}
            >
              <PackagePlus className="w-5 h-5" />
              Drop an Item
            </button>
          </div>
        </div>

        {/* --- FILTERS & CONTROLS --- */}
        <div className={`
          sticky top-4 z-30 p-2 rounded-2xl border backdrop-blur-xl flex flex-wrap items-center gap-3 shadow-lg
          ${theme === "dark" ? "bg-zinc-900/60 border-zinc-800" : "bg-white/80 border-gray-200"}
        `}>
          {/* Search */}
          <div className="flex-1 relative min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search clothes, furniture, tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`
                w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all
                ${theme === "dark" 
                  ? "bg-black/50 text-white placeholder-zinc-600 focus:bg-black focus:ring-1 focus:ring-teal-500/50" 
                  : "bg-gray-100 text-black focus:bg-white focus:ring-1 focus:ring-teal-500/50"
                }
              `}
            />
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {['All', 'Clothing', 'Electronics', 'Furniture', 'Books'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat.toLowerCase())}
                className={`
                  px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all
                  ${categoryFilter === cat.toLowerCase()
                    ? "bg-teal-500 text-white"
                    : theme === "dark" 
                      ? "bg-black/50 text-zinc-400 hover:text-white" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className={`w-px h-8 ${theme === "dark" ? "bg-zinc-800" : "bg-gray-200"}`} />

          {/* View Toggle */}
          <div className={`p-1 rounded-xl flex ${theme === "dark" ? "bg-black/50" : "bg-gray-100"}`}>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-teal-500 text-white shadow-md" : "text-zinc-500"}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`p-2 rounded-lg transition-all ${viewMode === "map" ? "bg-teal-500 text-white shadow-md" : "text-zinc-500"}`}
            >
              <Map className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* --- CONTENT GRID --- */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {MOCK_ITEMS.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className={`
            h-[600px] w-full rounded-3xl border flex items-center justify-center relative overflow-hidden
            ${theme === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-gray-100 border-gray-200"}
          `}>
            {/* In a real app, you'd insert the MapView component from your code snippet here.
               For brevity, I'm just putting a placeholder, but you can copy the 
               MapView logic from your StudioList component and adapt it.
            */}
            <div className="text-center space-y-4">
              <Map className="w-16 h-16 mx-auto text-teal-500 opacity-50" />
              <p className="text-zinc-500">Interactive Map Component goes here</p>
              <button 
                onClick={() => setViewMode("grid")}
                className="px-4 py-2 bg-zinc-800 rounded-lg text-sm text-white"
              >
                Back to Grid
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}