import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { store } from "@/redux/store"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// For Day-Month-Year, hours:minuts:seconds
export function formatCustomDate(dateString) {
  if (!dateString) return
  const isoCompatibleString = dateString.replace(" ", "T");
  const date = new Date(isoCompatibleString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const isPM = hours >= 12;
  const formattedHours = String(hours % 12 || 12).padStart(2, '0'); // Handle midnight (0) as 12
  const ampm = isPM ? 'PM' : 'AM';

  return `${day}-${month}-${year}, ${formattedHours}:${minutes}:${seconds} ${ampm}`;
}

export const isRtl = () => {
  const state = store.getState();
  const isLangRtl = state?.Language?.selectedLanguage?.type == "RTL" ? true : false
  return isLangRtl
}