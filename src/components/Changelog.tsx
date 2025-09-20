import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

// Add new changelog entries at the top of this array
// Most recent version should be first
const changelogData: ChangelogEntry[] = [
  {
    version: "1.0.2",
    date: "20 September 2025",
    changes: ["Added feedback system with email integration"],
  },
  {
    version: "1.0.1",
    date: "16 July 2025",
    changes: [
      "Adjusted differential output weights",
      "Fixed Center Balance UI",
      "Added form validation",
      "Camber now less aggressive",
    ],
  },
];

export function Changelog() {
  const latestVersion = changelogData[0];

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Button variant="link">v{latestVersion.version}</Button>
        <HoverCardContent className="w-96">
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarImage src="/steering-wheel.svg" />
              <AvatarFallback>FTB</AvatarFallback>
            </Avatar>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Changelog</h4>

              {changelogData.map((entry, index) => (
                <div key={entry.version} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">
                      v{entry.version}
                    </span>
                    {index === 0 && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded-full">
                        Latest
                      </span>
                    )}
                  </div>

                  <ul className="space-y-1">
                    {entry.changes.map((change, changeIndex) => (
                      <li key={changeIndex} className="text-sm flex items-start gap-2">
                        <span className="text-primary mt-1.5 text-xs">•</span>
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="text-muted-foreground text-xs">Updated {entry.date}</p>

                  {index < changelogData.length - 1 && <hr className="border-border/50" />}
                </div>
              ))}
            </div>
          </div>
        </HoverCardContent>
      </HoverCardTrigger>
    </HoverCard>
  );
}
