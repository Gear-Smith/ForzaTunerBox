import { Progress } from "./ui/progress";

interface TuneStatBarProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  lowLabel?: string;
  highLabel?: string;
  centeredAt?: number;
}

export const TuneStatBar: React.FC<TuneStatBarProps> = ({
  label,
  value,
  min,
  max,
  unit = "",
  lowLabel = "",
  highLabel = "",
  centeredAt,
}) => {
  const percent = getProgressPercent(value, min, max);

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums font-mono">
          {value.toFixed(2)} {unit}
        </span>
      </div>

      {typeof centeredAt === "number" ? (
        <ZeroCenterProgressBar value={value} min={min} max={max} center={centeredAt} />
      ) : (
        <Progress value={percent} />
      )}

      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
};

const getProgressPercent = (value: number, min: number, max: number): number => {
  return ((value - min) / (max - min)) * 100;
};

interface ZeroCenterProgressBarProps {
  value: number;
  min: number;
  max: number;
  center: number;
}

const ZeroCenterProgressBar: React.FC<ZeroCenterProgressBarProps> = ({
  value,
  min,
  max,
  center,
}) => {
  const totalRange = max - min;
  const centerOffset = ((center - min) / totalRange) * 100;

  const fillPercent =
    value >= center
      ? ((value - center) / (max - center)) * (100 - centerOffset)
      : ((center - value) / (center - min)) * centerOffset;

  const side = value >= center ? "right" : "left";

  return (
    <div className="w-full flex flex-col gap-1">
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-primary/20">
        <div
          className="absolute h-full w-[2px] bg-foreground"
          style={{ left: `${centerOffset}%` }}
        />

        {side === "left" && (
          <div
            className="absolute h-full bg-primary transition-all"
            style={{
              right: `${100 - centerOffset}%`,
              width: `${fillPercent}%`,
            }}
          />
        )}

        {side === "right" && (
          <div
            className="absolute h-full bg-primary transition-all"
            style={{
              left: `${centerOffset}%`,
              width: `${fillPercent}%`,
            }}
          />
        )}
      </div>
    </div>
  );
};
