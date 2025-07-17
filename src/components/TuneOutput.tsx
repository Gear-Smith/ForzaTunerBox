import { GiFlatTire } from "react-icons/gi";
import { TuneStatBar } from "./ProgressBarWithLabel";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

interface TuneOutputProps {
  tune: ReturnType<import("../ForzaTune").ForzaTune["toJSON"]> | null;
}

export function TuneOutput({ tune }: TuneOutputProps) {
  if (!tune) {
    return (
      <div className="flex flex-col items-center justify-center p-6 gap-12">
        <p className="text-muted-foreground">No tune calculated yet.</p>
        <GiFlatTire className="ml-2 text-[240px] fill-primary/30" />
        <p className="text-muted-foreground">Please enter your car specs.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Baseline Tune</h2>
      <ScrollArea className="">
        <section className="p-6 space-y-6">
          {/* Springs */}
          <section>
            <Card className="p-4 gap-1">
              <CardHeader>
                <CardTitle className="font-semibold">Spring Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <TuneStatBar
                  label="Front"
                  value={tune.springs.front}
                  min={tune.limits.springRate.min}
                  max={tune.limits.springRate.max}
                  unit="lb/in"
                />
                <TuneStatBar
                  label="Rear"
                  value={tune.springs.rear}
                  min={tune.limits.springRate.min}
                  max={tune.limits.springRate.max}
                  unit="lb/in"
                />
              </CardContent>
            </Card>
          </section>

          {/* Damping */}
          <section className="grid grid-cols-2 gap-4">
            <Card className="p-4 gap-1">
              <CardTitle className="font-semibold">Damping Settings</CardTitle>
              <TuneStatBar
                label="Front"
                value={tune.damping.bump.front}
                min={tune.limits.bump.min}
                max={tune.limits.bump.max}
              />
              <TuneStatBar
                label="Rear"
                value={tune.damping.bump.rear}
                min={tune.limits.bump.min}
                max={tune.limits.bump.max}
              />
            </Card>
            <Card className="p-4 gap-1">
              <CardTitle className="font-semibold">Rebound Settings</CardTitle>
              <TuneStatBar
                label="Front"
                value={tune.damping.rebound.front}
                min={tune.limits.rebound.min}
                max={tune.limits.rebound.max}
              />
              <TuneStatBar
                label="Rear"
                value={tune.damping.rebound.rear}
                min={tune.limits.rebound.min}
                max={tune.limits.rebound.max}
              />
            </Card>
          </section>

          <section>
            <Card className="p-4 gap-1">
              <CardHeader>
                <CardTitle className="font-semibold">Anti-Roll Bar</CardTitle>
              </CardHeader>
              <CardContent>
                <TuneStatBar
                  label="Front"
                  value={tune.antiRoll.front}
                  min={tune.limits.antiRoll.min}
                  max={tune.limits.antiRoll.max}
                />
                <TuneStatBar
                  label="Rear"
                  value={tune.antiRoll.rear}
                  min={tune.limits.antiRoll.min}
                  max={tune.limits.antiRoll.max}
                />
              </CardContent>
            </Card>
          </section>

          <Separator className="my-4" orientation="horizontal" />

          {/* Alignment */}
          <section>
            <Card className="p-4 gap-1">
              <CardHeader>
                <CardTitle className="font-semibold">Alignment</CardTitle>
              </CardHeader>
              <CardContent>
                <TuneStatBar
                  label="Camber Front"
                  value={tune.alignment.camber.front}
                  min={tune.limits.camber.min}
                  max={tune.limits.camber.max}
                  unit="°"
                  centeredAt={0}
                />
                <TuneStatBar
                  label="Camber Rear"
                  value={tune.alignment.camber.rear}
                  min={tune.limits.camber.min}
                  max={tune.limits.camber.max}
                  unit="°"
                  centeredAt={0}
                />
                <TuneStatBar
                  label="Toe Front"
                  value={tune.alignment.toe.front}
                  min={tune.limits.toe.min}
                  max={tune.limits.toe.max}
                  unit="°"
                  centeredAt={0}
                />
                <TuneStatBar
                  label="Toe Rear"
                  value={tune.alignment.toe.rear}
                  min={tune.limits.toe.min}
                  max={tune.limits.toe.max}
                  unit="°"
                  centeredAt={0}
                />
                <TuneStatBar
                  label="Caster"
                  value={tune.alignment.caster}
                  min={tune.limits.caster.min}
                  max={tune.limits.caster.max}
                  unit="°"
                />
              </CardContent>
            </Card>
          </section>

          <Separator className="my-4" orientation="horizontal" />

          {/* Differential */}
          <section>
            <Card className="p-4 gap-1">
              <CardHeader>
                <CardTitle className="font-semibold">Differential</CardTitle>
              </CardHeader>
              <CardContent>
                {tune.diff.front && (
                  <>
                    <p className="text-foreground font-semibold text-sm text-left">Front</p>
                    <TuneStatBar
                      label="Acceleration"
                      value={tune.diff.front.acceleration}
                      min={0}
                      max={100}
                      unit="%"
                    />
                    <TuneStatBar
                      label="Deceleration"
                      value={tune.diff.front.deceleration}
                      min={0}
                      max={100}
                      unit="%"
                    />
                  </>
                )}

                <Separator className="my-2" orientation="horizontal" />

                {typeof tune.diff.center === "number" && (
                  <>
                    <p className="text-foreground font-semibold text-sm">Center Balance</p>
                    <TuneStatBar
                      label="Balance (to Rear)"
                      value={tune.diff.center}
                      min={0}
                      max={100}
                      unit="%"
                      centeredAt={50}
                    />
                  </>
                )}

                <Separator className="my-2" orientation="horizontal" />

                {tune.diff.rear && (
                  <>
                    <p className="text-foreground font-semibold text-sm text-left">Rear</p>
                    <TuneStatBar
                      label="Acceleration"
                      value={tune.diff.rear.acceleration}
                      min={0}
                      max={100}
                      unit="%"
                    />
                    <TuneStatBar
                      label="Deceleration"
                      value={tune.diff.rear.deceleration}
                      min={0}
                      max={100}
                      unit="%"
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </section>
        </section>
      </ScrollArea>
    </div>
  );
}
