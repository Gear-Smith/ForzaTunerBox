import { Card } from "@/components/ui/card";
import { GiBigGear, GiGearHammer, GiGearStickPattern } from "react-icons/gi";

const roadmapPhases = [
  {
    title: "Core Tuner MVP",
    items: ["Vehicle stats form", "Tuning logic", "UI layout"],
    complete: true,
    quarter: "Q1",
  },
  {
    title: "Driving Behavior & Fine Tuning",
    items: ["Tire pressure model", "Ride height", "Save/share tunes"],
    complete: false,
    quarter: "Q2",
  },
  {
    title: "Telemetry Integration",
    items: ["UDP listener", "Compare handling", "Alerts overlay"],
    complete: false,
    quarter: "Q3",
  },
  {
    title: "Smart Recommendations",
    items: ["Feedback prompts", "Presets engine", "Driver tracking"],
    complete: false,
    quarter: "Q4",
  },
];

export function Roadmap() {
  return (
    <div className="p-8 max-w-7xl mx-auto ">
      <h2 className="text-3xl font-bold text-primary font-ethnocentric mb-6">
        Forza Tuner Box Roadmap
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roadmapPhases.map((phase) => (
          <Card
            key={phase.title}
            className={`p-4 border border-gray-700 ${
              phase.complete ? "bg-gray-800" : "bg-gray-900"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              {phase.complete ? (
                <>
                  <span className="text-green-500 font-semibold">
                    <GiGearStickPattern />
                  </span>
                  <div>
                    <GiGearHammer className="text-green-500 w-6 h-6" />
                  </div>
                </>
              ) : (
                <>
                  <span className="text-yellow-500 font-semibold">
                    <GiGearStickPattern />
                  </span>
                  <GiBigGear className="text-gray-500 w-6 h-6" />
                </>
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-100 mb-2">{phase.title}</h3>
            <ul className="space-y-1">
              {phase.items.map((i) => (
                <li key={i} className="text-gray-300 text-sm">
                  • {i}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
