interface ProfileSectionProps {
  condensed?: boolean;
  onExpand?: () => void;
}

export default function ProfileSection({ condensed, onExpand }: ProfileSectionProps) {
  return (
    <div className="space-y-2 transition-all duration-300">
      <h1 className="font-geometric text-lg font-bold text-foreground tracking-wide leading-normal">
        Chris Thomas
      </h1>
      {condensed ? (
        <button
          type="button"
          onClick={onExpand}
          className="font-geometric text-base font-normal text-muted-foreground tracking-wide leading-normal underline underline-offset-4 hover:text-foreground transition-colors"
        >
          More...
        </button>
      ) : (
        <div className="space-y-1.5">
          <p className="font-geometric text-lg font-normal text-foreground tracking-wide leading-normal">
            Product Design Engineer building humanoid robots
          </p>
          <p className="font-geometric text-lg font-normal text-foreground tracking-wide leading-normal opacity-50">
            Designing with care and intent, guiding technology to serve humanity in tangible ways.
          </p>
        </div>
      )}
    </div>
  );
}