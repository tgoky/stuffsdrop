"use client";

import React, { useMemo } from "react";
import { useTheme } from "../../providers/ThemeProvider";
import { MenuGroup } from "./MenuGroup";
import { 
  Sparkles, 
  Package, 
  Users 
} from "lucide-react";

// ... [Keep Interfaces IMenuItem and MenuGroupConfig the same as Beeps] ...
// Rerendering interfaces here for clarity if you copy-paste
export interface IMenuItem {
  key: string;
  name: string;
  label?: string;
  route?: string;
  icon?: React.ReactNode;
  children?: IMenuItem[];
  checked?: boolean;
}

export interface MenuGroupConfig {
  id: string;
  label: string;
  icon: React.ReactElement;
  items?: string[];
  subGroups?: MenuGroupConfig[];
}

interface NavigationMenuProps {
  isClient: boolean;
  collapsed: boolean;
  menuItems: IMenuItem[];
  selectedKey: string;
  expandedGroups: string[];
  toggleGroup: (groupId: string) => void;
}

const getStuffsDropMenuItems = (refineMenuItems: IMenuItem[], selectedKey: string): IMenuItem[] => {
  // Map Refine resource names to readable labels
  const labelMap: Record<string, string> = {
    "feed": "Live Drops",
    "map": "Nearby Gems",
    "listings": "Give Away",
    "requests": "My Requests",
    "saved": "Watchlist",
    "messages": "Chats",
    "impact": "My Impact",
  };

  return refineMenuItems.map(item => ({
    ...item,
    label: labelMap[item.name] || item.label || item.name,
    // Icon is handled by MenuIcon component inside MenuItem
    checked: item.key === selectedKey,
  }));
};

const menuGroups: MenuGroupConfig[] = [
  {
    id: "discover",
    label: "Discover",
    icon: <Sparkles className="h-4 w-4" />,
    items: [
      "feed",
      "map",
      "saved"
    ],
  },
  {
    id: "my-stuffs",
    label: "My Stuffs",
    icon: <Package className="h-4 w-4" />,
    items: [
      "listings", // Outgoing
      "requests", // Incoming
      "messages"
    ],
  },
  {
    id: "community",
    label: "Community",
    icon: <Users className="h-4 w-4" />,
    items: [
      "impact", // Leaderboard/Karma
    ],
  }
];

export const NavigationMenu = ({
  isClient,
  collapsed,
  menuItems,
  selectedKey,
  expandedGroups,
  toggleGroup,
}: NavigationMenuProps) => {
  const { theme } = useTheme();

  // You can keep the Supabase user logic here if you need it for dynamic roles
  
  const displayMenuItems = getStuffsDropMenuItems(menuItems, selectedKey);

  const getMenuItemsByGroup = (groupItems: string[] = []) => {
    return displayMenuItems.filter((item) =>
      groupItems.includes(item.name)
    );
  };

  return (
    <nav className="h-full">
      <div className={`px-4 py-4 space-y-6 ${theme === "dark" ? "bg-black" : "bg-white"}`}>
        {isClient &&
          menuGroups.map((group) => {
            const groupItems = getMenuItemsByGroup(group.items || []);
            if (groupItems.length === 0) return null;

            return (
              <MenuGroup
                key={group.id}
                group={group}
                collapsed={collapsed}
                groupItems={groupItems}
                selectedKey={selectedKey}
                isExpanded={expandedGroups.includes(group.id)}
                toggleGroup={toggleGroup}
                allMenuItems={displayMenuItems}
              />
            );
          })}
      </div>
    </nav>
  );
};