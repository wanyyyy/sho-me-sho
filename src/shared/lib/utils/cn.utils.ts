import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** 조건부 className 결합 + Tailwind 충돌 해소 (뒤에 오는 클래스가 우선) */
export function cn(...values: ClassValue[]) {
  return twMerge(clsx(values));
}
