import { useState } from "react";
import { ForzaTune, type Drivetrain, type RaceStyle } from "../ForzaTune";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Slider } from "./ui/slider";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

interface TuneFormProps {
  onTuneCalculated: (tune: ReturnType<ForzaTune["toJSON"]>) => void;
}

export function TuneForm({ onTuneCalculated }: TuneFormProps) {
  const [distribution, setDistribution] = useState<number[]>([57]);
  const [weight, setWeight] = useState<number>(0);
  const [drivetrain, setDrivetrain] = useState<Drivetrain>("RWD");
  const [powerToWeight, setPowerToWeight] = useState<number>(0);
  const [raceStyle, setRaceStyle] = useState<RaceStyle>("Balanced");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const frontDist = distribution[0];
    const tune = new ForzaTune(
      weight,
      frontDist,
      drivetrain,
      powerToWeight,
      false,
      raceStyle
    ).toJSON();
    onTuneCalculated(tune);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex flex-row justify-center">
          <ToggleGroup
            defaultValue="Balanced"
            onValueChange={(value) => setRaceStyle(value as RaceStyle)}
            type="single"
          >
            <ToggleGroupItem value="Technical" aria-label="Toggle Technical">
              <span className="italic">Technical</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="Balanced" aria-label="Toggle Balanced">
              <span className="italic">Balanced</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="HighSpeed" aria-label="Toggle HighSpeed">
              <span className="italic">HighSpeed</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      <Separator className="my-2" orientation="horizontal" />
      <label htmlFor="carWeight" className="text-sm text-left font-medium">
        Total Weight
      </label>
      <input
        step={1}
        type="number"
        placeholder="e.g. 1500"
        id="carWeight"
        className="border border-muted-foreground rounded-md p-2"
        onChange={(e) => setWeight(parseFloat(e.target.value))}
      />

      <label htmlFor="carPowerToWeight" className="text-sm text-left font-medium">
        Power to Weight Ratio
      </label>
      <input
        step={0.001}
        type="number"
        placeholder="e.g. 0.5"
        id="carPowerToWeight"
        className="border border-muted-foreground rounded-md p-2"
        onChange={(e) => setPowerToWeight(parseFloat(e.target.value))}
      />

      <label htmlFor="carWeightDistribution" className="text-sm text-left font-medium">
        Weight Distribution
      </label>
      <Slider
        defaultValue={[distribution[0]]}
        max={100}
        step={1}
        onValueChange={(value) => setDistribution(value)}
      />
      <div className="flex flex-row justify-center">
        <span>
          {distribution[0]}F / {100 - distribution[0]}R
        </span>
      </div>
      <div className="flex flex-row justify-center">
        <ToggleGroup
          defaultValue="RWD"
          onValueChange={(value) => setDrivetrain(value as Drivetrain)}
          type="single"
        >
          <ToggleGroupItem value="FWD" aria-label="Toggle FWD">
            <span className="italic">FWD</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="AWD" aria-label="Toggle AWD">
            <span className="italic">AWD</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="RWD" aria-label="Toggle RWD">
            <span className="italic">RWD</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <Button type="submit" className="w-full">
        Calculate Tune
      </Button>
    </form>
  );
}
