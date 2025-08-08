import { useState } from "react";

import { GiGearHammer } from "react-icons/gi";
import { Toaster } from "sonner";
import "./App.css";
import { Feedback } from "./components/FeedbackButton";
import { Roadmap } from "./components/Roadmap";
import { ThemeProvider } from "./components/theme-provider";
import { TuneForm } from "./components/TuneForm";
import { TuneOutput } from "./components/TuneOutput";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardFooter } from "./components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./components/ui/hover-card";
import { Separator } from "./components/ui/separator";
import { ForzaTune } from "./ForzaTune";

function App() {
  const [tune, setTune] = useState<ReturnType<ForzaTune["toJSON"]> | null>(null);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="forzaTune-ui-theme">
      <section className="">
        <section className="flex flex-col max-w-7xl mx-auto p-4">
          <Card className="gap-0 py-2">
            <CardContent>
              <h1 className="font-ethnocentric-italic text-primary">Forza Tuner Box</h1>
            </CardContent>
            <CardFooter className="flex justify-end">
              <div>
                <HoverCard>
                  <HoverCardTrigger>
                    <Button variant={"link"}>v{import.meta.env.VITE_APP_VERSION}</Button>
                    <HoverCardContent className="w-96">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src="/steering-wheel.svg" />
                          <AvatarFallback>FTB</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">Changelog</h4>
                          <div id="latest-version" className="space-y-1">
                            <p className="text-xs text-muted-foreground">
                              <span className="font-semibold">
                                v{import.meta.env.VITE_APP_VERSION}
                              </span>
                            </p>
                            <p className="text-sm">
                              - Adjusted differential output weights
                              <br />
                              - Fixed Center Balance UI
                              <br />
                              - Added form validation
                              <br />- Camber now less aggressive
                            </p>
                          </div>
                          <div className="text-muted-foreground text-xs">Updated 16 July 2025</div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCardTrigger>
                </HoverCard>
              </div>
            </CardFooter>
          </Card>

          <Card className="my-4 bg-black p-0">
            <div className="grid lg:grid-cols-2">
              <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex relative start-0">
                  <Feedback tune={tune} />
                </div>
                <div className="flex flex-1 items-center justify-center">
                  <div className="w-full max-w-xs">
                    <TuneForm onTuneCalculated={setTune} />
                  </div>
                </div>
              </div>

              <div className="bg-muted w-full relative rounded-r-lg lg:block flex flex-col gap-4 p-6 md:p-10">
                <div className="flex flex-1 w-full items-center justify-center">
                  <TuneOutput tune={tune} />
                </div>
              </div>
            </div>
          </Card>
        </section>
        <div className="w-1/2 mx-auto">
          <Separator orientation="horizontal" />
        </div>

        <Roadmap />

        <footer>
          <p>
            My tank runs on caffeine. With ❤️,{" "}
            <a className="font-ethnocentric-italic" href="https://coff.ee/gearsmith">
              GearSmith
            </a>
            <span className="ml-2">
              <GiGearHammer className=" fill-primary inline-block text-2xl" />
            </span>
          </p>
          <p>Copyright © 2025 GearSmith Integrations LLC</p>
        </footer>
      </section>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
