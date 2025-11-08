import { createContext, useContext, useState } from "react";
import "./Tabs.css";

const TabsContext = createContext();

function Tabs({ children, defaultValue, value, onValueChange, className = "" }) {
  const [activeTab, setActiveTab] = useState(defaultValue || value);

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={`tabs ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
}

function TabsList({ children, className = "" }) {
  return <div className={`tabs-list ${className}`}>{children}</div>;
}

function TabsTrigger({ children, value, className = "" }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      className={`tabs-trigger ${isActive ? "active" : ""} ${className}`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

function TabsContent({ children, value, className = "" }) {
  const { activeTab } = useContext(TabsContext);
  
  if (activeTab !== value) return null;

  return <div className={`tabs-content ${className}`}>{children}</div>;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
