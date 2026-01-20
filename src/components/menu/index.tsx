"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { useLogout, useMenu } from "@refinedev/core";
import { useRouter } from "next/navigation";
import { useTheme } from "../../providers/ThemeProvider";
import { useSidebar } from "../../providers/sidebar-provider/sidebar-provider";
import { Controls } from "./Controls";
import { NavigationMenu } from "./NavigationMenu";
import { UserSection } from "./UserSection";
import { Power, Package, Plus } from "lucide-react";

// --- HELPER: Map Resources to Groups ---
const getGroupForMenuItem = (itemKey: string): string => {
  if (["feed", "map", "saved"].includes(itemKey)) return "discover";
  if (["listings", "requests", "messages"].includes(itemKey)) return "my-stuffs";
  if (["impact", "leaderboard"].includes(itemKey)) return "community";
  return "discover"; // Default fallback
};

// --- COMPONENT: Retro Logout Dialog (Kept from your original) ---
interface LogoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutDialog: React.FC<LogoutDialogProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700 w-80 rounded-xl shadow-2xl overflow-hidden transform scale-100">
        <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 font-semibold">
            <Power className="w-4 h-4" />
            <span>Sign Out</span>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>
        <div className="p-6">
          <p className="text-zinc-300 mb-6 text-sm">
            Are you sure you want to log off StuffsDrop?
          </p>
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-500/20 transition-all"
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: Brand Header ---
// Replaces 'WorkspaceHeader' to focus on StuffsDrop branding
const BrandHeader = ({ collapsed }: { collapsed: boolean }) => {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <div className={`px-4 py-5 flex flex-col gap-4 ${collapsed ? 'items-center' : ''}`}>
      {/* Logo Area */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/20 flex-shrink-0">
          <Package className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className={`text-lg font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              StuffsDrop
            </span>
            <span className={`text-[10px] font-medium tracking-wide uppercase ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'}`}>
              Marketplace
            </span>
          </div>
        )}
      </div>

      {/* Primary Action Button (Drop Item) */}
      <button
        onClick={() => router.push('/items/create')}
        className={`
          flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300 shadow-lg
          ${collapsed 
            ? "w-10 h-10 p-0" 
            : "w-full py-2.5 px-4"
          }
          ${theme === "dark"
            ? "bg-white text-black hover:bg-teal-50 shadow-teal-500/10"
            : "bg-black text-white hover:bg-zinc-800 shadow-black/10"
          }
        `}
        title="Drop an Item"
      >
        <Plus className="w-5 h-5" />
        {!collapsed && <span className="text-sm">Drop Item</span>}
      </button>
    </div>
  );
};

// --- MAIN MENU COMPONENT ---
export const Menu: React.FC = () => {
  const { mutate: logout } = useLogout();
  const { menuItems, selectedKey } = useMenu();
  const [isClient, setIsClient] = useState<boolean>(false);
  
  // Sidebar State
  const { collapsed, setCollapsed } = useSidebar();
  
  // Group Expansion State
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["discover", "my-stuffs"]); 
  const userHasInteractedRef = useRef<boolean>(false);
  
  const { theme } = useTheme();
  const [showLogoutDialog, setShowLogoutDialog] = useState<boolean>(false);

  // Determine which group is active based on the current route
  const selectedItemGroup = useMemo(() => {
    if (!selectedKey) return null;
    return getGroupForMenuItem(selectedKey);
  }, [selectedKey]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Auto-expand group when navigating (unless user manually collapsed)
  useEffect(() => {
    if (!userHasInteractedRef.current && selectedItemGroup) {
      if (!expandedGroups.includes(selectedItemGroup)) {
        setExpandedGroups((prev) => [...prev, selectedItemGroup]);
      }
    }
  }, [selectedItemGroup, expandedGroups]);

  const toggleGroup = (groupId: string): void => {
    userHasInteractedRef.current = true;
    setExpandedGroups((prev) => {
      if (prev.includes(groupId)) {
        return prev.filter(id => id !== groupId);
      } else {
        return [...prev, groupId];
      }
    });
  };

  const handleLogout = (): void => {
    setShowLogoutDialog(true);
  };

  return (
    <div
      className={`
        h-screen sticky top-0 z-50 flex flex-col border-r transition-all duration-300 ease-in-out flex-shrink-0
        ${collapsed ? "w-[72px]" : "w-64"}
        ${theme === "dark" 
          ? "bg-black border-zinc-800/50" 
          : "bg-white border-gray-200"
        }
      `}
    >
      {/* 1. Header & Primary Action */}
      <div className="flex-shrink-0">
        <BrandHeader collapsed={collapsed} />
        <Controls collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* 2. Navigation Items (Scrollable) */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-2">
        <NavigationMenu
          isClient={isClient}
          collapsed={collapsed}
          menuItems={menuItems}
          selectedKey={selectedKey}
          expandedGroups={expandedGroups}
          toggleGroup={toggleGroup}
        />
      </div>

      {/* 3. User Profile (Fixed Bottom) */}
      <div className="flex-shrink-0">
        <UserSection collapsed={collapsed} handleLogout={handleLogout} />
      </div>

      {/* Logout Modal */}
      <LogoutDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={() => {
          logout();
          setShowLogoutDialog(false);
        }}
      />
    </div>
  );
};