import Image from "next/image";

type WhLogoProps = {
  className?: string;
  /** Compact for outcome pages; larger for intake / hero. */
  size?: "sm" | "md" | "lg";
};

export function WhLogo({ className = "", size = "sm" }: WhLogoProps) {
  const height = size === "lg" ? 110 : size === "md" ? 72 : 56;
  const width = size === "lg" ? 400 : size === "md" ? 260 : 200;

  return (
    <Image
      src="/woodlands-hospital-logo.png"
      alt="Woodlands Hospital"
      width={width}
      height={height}
      className={`h-auto w-auto object-contain ${className}`}
      style={{ maxHeight: height }}
      priority
    />
  );
}
