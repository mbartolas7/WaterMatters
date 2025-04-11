import { useContext } from "react";
import { ShowBottomTabContext } from "@/contexts/ShowBottomTabContext";

export const useShowBottomTab = () => useContext(ShowBottomTabContext);
