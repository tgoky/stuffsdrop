import React from 'react';
import {
  LayoutGrid, // Feed
  PackagePlus, // Give/List
  Inbox, // Requests
  Heart, // Saved/Favorites
  MessageCircle, // Chat
  Trophy, // Leaderboard/Impact
  Settings,
  Map as MapIcon,
  Shirt, // Clothes category
  Watch, // Accessories
  FolderIcon
} from "lucide-react";

interface MenuIconProps {
  name: string;
}

export const MenuIcon = ({ name }: MenuIconProps) => {
  const iconMap: Record<string, React.ReactElement> = {
    // Core Navigation
    "feed": <LayoutGrid className="h-4 w-4" />,
    "map": <MapIcon className="h-4 w-4" />,
    
    // User Actions
    "listings": <PackagePlus className="h-4 w-4" />, // Giving
    "requests": <Inbox className="h-4 w-4" />, // Receiving
    "saved": <Heart className="h-4 w-4" />,
    
    // Social
    "messages": <MessageCircle className="h-4 w-4" />,
    "impact": <Trophy className="h-4 w-4" />,
    
    // Categories (if you have them in menu)
    "clothes": <Shirt className="h-4 w-4" />,
    "accessories": <Watch className="h-4 w-4" />,
    
    "settings": <Settings className="h-4 w-4" />,
    default: <FolderIcon className="h-4 w-4" />
  };

  return iconMap[name] || iconMap.default;
};