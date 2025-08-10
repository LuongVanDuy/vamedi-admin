import dayjs from "dayjs";
import { format } from "date-fns";

export function formatCurrency(amount: number): string {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return formattedAmount.replace("$", "").trim() + "$";
}

export function convertToSubCurrency(amount: number, factor = 100) {
  return Math.round(amount * factor);
}

export function formatTextDate(dateString: any) {
  const dayjsDate = dayjs(dateString);
  const day = dayjsDate.date();

  const suffix = (day: number): string => {
    if (day >= 11 && day <= 13) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return dayjsDate.format(`ddd, MMM D[${suffix(day)}] YYYY`);
}

export function formatDateToShort(dateString: string): string {
  const date = new Date(dateString);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export const formatDate = (timestamp: string | any) => {
  const date = new Date(timestamp);
  return format(date, "dd/MM/yyyy");
};

export function formatTime(timestamp: string | any) {
  const date = new Date(timestamp);
  return format(date, "dd/MM/yyyy' - 'HH:mm");
}

export function slugify(input: string): string {
  if (!input) return "";
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export function buildImageUrl(src?: string | null, baseOverride?: string): string {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) return src;

  const base =
    baseOverride ||
    process.env.NEXT_PUBLIC_FILE_BASE_URL ||
    process.env.NEXT_PUBLIC_IMAGE_BASE_URL ||
    process.env.NEXT_PUBLIC_BASE_API_URL ||
    "";

  const normalizedBase = base ? base.replace(/\/$/, "") : "";
  return normalizedBase ? `${normalizedBase}/${src}` : `/${src}`;
}
