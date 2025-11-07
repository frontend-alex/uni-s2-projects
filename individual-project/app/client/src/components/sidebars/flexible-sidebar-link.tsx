import { ChevronRight } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

type SidebarSubItem = {
  title: string;
  url: string;
  icon?: any;
  isActive?: boolean;
  colorHex?: string; // For document icon color (inherits from workspace)
};

type SidebarItem = {
  title: string;
  icon: any;
  isActive?: boolean;
  url?: string;
  items?: SidebarSubItem[]; // For collapsible groups
  colorHex?: string; // For workspace icon color
};

function CollapsibleNavItem({ item }: { item: SidebarItem }) {
  // Render as regular link if it has a url and no sub-items
  const hasSubItems = item.items && item.items.length > 0;
  const shouldRenderAsLink = item.url && !hasSubItems;
  
  if (shouldRenderAsLink && item.url) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          tooltip={item.title}
          className={cn(
            item.isActive && "bg-accent text-accent-foreground hover:bg-accent"
          )}
        >
          <NavLink to={item.url!} className="flex items-center gap-2">
            <item.icon />
            <span>{item.title}</span>
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  const storageKey = `sidebar-${item.title.toLowerCase().replace(/\s+/g, "-")}`;

  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : item.isActive || false;
    }
    return item.isActive || false;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(isOpen));
    }
  }, [isOpen, storageKey]);

  useEffect(() => {
    if (item.isActive) {
      setIsOpen(true);
    }
  }, [item.isActive]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} asChild>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title}>
            <item.icon 
              className=""
              style={item.colorHex ? { color: item.colorHex } : undefined}
            />
            <span className="max-w-[150px] truncate">{item.title}</span>
            <ChevronRight
              className={`ml-auto transition-transform duration-200 ${
                isOpen ? "rotate-90" : ""
              }`}
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden transition-all duration-300 ease-in-out data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <SidebarMenuSub>
            {item.items && item.items.length > 0 ? (
              item.items.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    asChild
                    className={cn(
                      subItem.isActive &&
                        "bg-accent text-accent-foreground hover:bg-accent"
                    )}
                  >
                    <NavLink to={subItem.url} className="flex items-center gap-2">
                      {subItem.icon && (
                        <subItem.icon 
                          style={subItem.colorHex ? { color: subItem.colorHex } : undefined}
                        />
                      )}
                      <span>{subItem.title}</span>
                    </NavLink>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))
            ) : (
              <SidebarMenuSubItem>
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No documents yet
                </div>
              </SidebarMenuSubItem>
            )}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export function SidebarGroupRenderer({
  group,
}: {
  group: { label: React.ReactNode; items: SidebarItem[] };
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
      <SidebarMenu>
        {group.items.map((item) => (
          <CollapsibleNavItem key={item.title} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export type { SidebarItem };
