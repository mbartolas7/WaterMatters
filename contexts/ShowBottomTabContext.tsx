import React, { createContext, useState } from "react";

type ShowBottomTabContextType = {
  showBottomTab: boolean;
  setShowBottomTab: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ShowBottomTabContext = createContext<ShowBottomTabContextType>({
  showBottomTab: true,
  setShowBottomTab: () => {},
});

export const ShowBottomTabProvider = ({ children }: any) => {
  const [showBottomTab, setShowBottomTab] = useState(true);

  return (
    <ShowBottomTabContext.Provider value={{ showBottomTab, setShowBottomTab }}>
      {children}
    </ShowBottomTabContext.Provider>
  );
};
