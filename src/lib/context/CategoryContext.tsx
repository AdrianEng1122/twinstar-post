"use client";

import React, { createContext, useContext, useState } from "react";

interface CategoryContextType {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const CategoryContext = createContext<CategoryContextType>({
  activeCategory: "All",
  setActiveCategory: () => {},
});

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  return (
    <CategoryContext.Provider value={{ activeCategory, setActiveCategory }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategory() {
  return useContext(CategoryContext);
}
