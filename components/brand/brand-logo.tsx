import Image from "next/image";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

type BrandLogoVariant = "mark" | "lockup" | "lockup-on-dark" | "horizontal";
type BrandLogoSize = "sm" | "md" | "lg";

const sizeMap: Record<
  BrandLogoSize,
  Record<BrandLogoVariant, { width: number; height: number; className: string }>
> = {
  sm: {
    mark: { width: 32, height: 32, className: "h-8 w-8" },
    lockup: { width: 72, height: 74, className: "h-10 w-auto" },
    "lockup-on-dark": { width: 72, height: 74, className: "h-10 w-auto" },
    horizontal: { width: 120, height: 55, className: "h-8 w-auto" }
  },
  md: {
    mark: { width: 40, height: 40, className: "h-10 w-10" },
    lockup: { width: 96, height: 99, className: "h-14 w-auto" },
    "lockup-on-dark": { width: 96, height: 99, className: "h-14 w-auto" },
    horizontal: { width: 160, height: 73, className: "h-10 w-auto" }
  },
  lg: {
    mark: { width: 72, height: 72, className: "h-[4.5rem] w-[4.5rem]" },
    lockup: { width: 160, height: 164, className: "h-28 w-auto" },
    "lockup-on-dark": { width: 160, height: 164, className: "h-28 w-auto" },
    horizontal: { width: 220, height: 101, className: "h-14 w-auto" }
  }
};

const srcMap: Record<BrandLogoVariant, string> = {
  mark: BRAND.logos.mark,
  lockup: BRAND.logos.lockup,
  "lockup-on-dark": BRAND.logos.lockupOnDark,
  horizontal: BRAND.logos.lockupHorizontal
};

export function BrandLogo({
  variant = "horizontal",
  size = "sm",
  className,
  priority = false,
  showCaption = false
}: {
  variant?: BrandLogoVariant;
  size?: BrandLogoSize;
  className?: string;
  priority?: boolean;
  /** Optional product name under the mark for compact shells */
  showCaption?: boolean;
}) {
  const dims = sizeMap[size][variant];
  return (
    <span className={cn("inline-flex flex-col items-start gap-1", className)}>
      <Image
        src={srcMap[variant]}
        alt={BRAND.officialName}
        width={dims.width}
        height={dims.height}
        className={cn("object-contain", dims.className)}
        priority={priority}
      />
      {showCaption ? (
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-slate">
          {BRAND.name}
        </span>
      ) : null}
    </span>
  );
}
