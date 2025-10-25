interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({ width = 24, height = 24, className = '' }: LogoProps) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 481 481" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M480.5 0.5H0.5V480.5H480.5V0.5ZM244.922 368.5L80.5 109.833H304.957L282.983 146.368H154.237L176.413 183.238H260.807L237.97 219.438H198.185L244.922 297.143L357.581 109.833H400.5L244.922 368.5Z" 
        fill="currentColor"
        className="dark:fill-white fill-black"
      />
    </svg>
  );
}
