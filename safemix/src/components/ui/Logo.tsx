import Image from "next/image";

interface LogoProps {
  size?: number;
  textSize?: string;
  hideText?: boolean;
}

export default function SafeMixLogo({ size = 36, textSize = "text-xl", hideText = false }: LogoProps) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      {/*
        Light mode: mix-blend-mode:multiply makes the black background disappear
        Dark mode:  We render the image inside a white-ish circle so the logo
                    is visible and the black bg blends into the circle fill
      */}
      <div
        className="flex-shrink-0 rounded-full overflow-hidden
                   bg-transparent dark:bg-[#dceae0]"
        style={{ width: size, height: size }}
      >
        <Image
          src="/safemix-logo.jpg"
          alt="SafeMix Logo"
          width={size * 2}
          height={size * 2}
          className="object-cover w-full h-full"
          style={{ mixBlendMode: "multiply" }}
          priority
        />
      </div>

      {!hideText && (
        <span
          className={`font-bold tracking-tight text-[#42594A] dark:text-[#b5ccba] ${textSize}`}
          style={{ fontFamily: "Manrope, Inter, sans-serif", letterSpacing: "-0.02em" }}
        >
          SafeMix
        </span>
      )}
    </div>
  );
}
