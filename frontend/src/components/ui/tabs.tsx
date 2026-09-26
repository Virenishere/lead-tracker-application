import * as React from "react";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className = "",
}: {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const [selected, setSelected] = React.useState(value || defaultValue || "");

  const activeTab = value !== undefined ? value : selected;

  const setActiveTab = React.useCallback(
    (newValue: string) => {
      if (value === undefined) {
        setSelected(newValue);
      }
      if (onValueChange) {
        onValueChange(newValue);
      }
    },
    [value, onValueChange]
  );

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`w-full ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl bg-muted p-1 text-muted-foreground border border-border w-full sm:w-auto overflow-x-auto ${className}`}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
  className = "",
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("TabsTrigger must be used within a Tabs component");
  }

  const isActive = context.activeTab === value;

  return (
    <button
      type="button"
      onClick={() => context.setActiveTab(value)}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all focus-visible:outline-none cursor-pointer ${
        isActive
          ? "bg-background text-foreground shadow-sm font-bold"
          : "hover:bg-background/50 hover:text-foreground text-muted-foreground"
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className = "",
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("TabsContent must be used within a Tabs component");
  }

  if (context.activeTab !== value) {
    return null;
  }

  return <div className={`mt-6 space-y-6 animate-in fade-in-50 ${className}`}>{children}</div>;
}
