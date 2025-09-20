export type Drivetrain = "FWD" | "RWD" | "AWD";

export type RacePreference = "Circuit" | "Drift" | "Drag";
export type RaceStyle = "Balanced" | "Technical" | "HighSpeed";

export interface SpringRate {
  front: number;
  rear: number;
}

export interface Toe {
  front: number;
  rear: number;
}

export interface BumpRebound {
  bump: SpringRate;
  rebound: SpringRate;
}

export interface Alignment {
  camber: SpringRate;
  toe: SpringRate;
  caster: number;
}

export interface Differential {
  drivetrain: Drivetrain;
  front: { acceleration: number; deceleration: number };
  rear: { acceleration: number; deceleration: number };
  center: number;
}

export interface AntiRollBar {
  front: number;
  rear: number;
}

export interface TuneLimits {
  springRate: { min: number; max: number };
  caster: { min: number; max: number };
  camber: { min: number; max: number };
  toe: { min: number; max: number };
  tirePressure: { min: number; max: number };
  antiRoll: { min: number; max: number };
  bump: { min: number; max: number };
  rebound: { min: number; max: number };
  rollCenterOffset: { min: number; max: number };
  antiDiveSquat: { min: number; max: number };
  rideHeight: { min: number; max: number };
}

export interface TuneOutput {
  weight: number;
  distribution: { front: number; rear: number };
  springs: SpringRate;
  damping: BumpRebound;
  alignment: Alignment;
  diff: Differential;
  antiRoll: AntiRollBar;
  limits: TuneLimits;
  raceStyle?: RaceStyle;
}

export class ForzaTune {
  weight: number;
  frontDist: number;
  rearDist: number;
  drivetrain: Drivetrain;
  useAssists: boolean;

  springs: SpringRate;
  damping: BumpRebound;
  alignment: Alignment;
  diff: Differential;
  antiRoll: AntiRollBar;
  powerToWeight: number;

  raceStyle: RaceStyle;

  private readonly limits: TuneLimits = {
    springRate: { min: 100, max: 2000 },
    caster: { min: 1, max: 7 },
    camber: { min: -5, max: 5 },
    toe: { min: -5, max: 5 },
    tirePressure: { min: 15, max: 55 },
    antiRoll: { min: 1, max: 140 },
    bump: { min: 1, max: 13 },
    rebound: { min: 1, max: 13 },
    rollCenterOffset: { min: -9.8, max: 9.8 },
    antiDiveSquat: { min: -50, max: 150 },
    rideHeight: { min: 0, max: 10 }
  };

  constructor(
    weight: number,
    frontDist: number,
    drivetrain: Drivetrain,
    powerToWeight: number,
    useAssists = false,
    raceStyle: RaceStyle = "Balanced"
  ) {
    this.weight = weight;
    this.frontDist = frontDist;
    this.rearDist = 100 - frontDist;
    this.drivetrain = drivetrain;
    this.powerToWeight = powerToWeight;
    this.useAssists = useAssists;
    this.raceStyle = raceStyle;

    this.springs = this.calculateSprings();
    this.damping = this.calculateBumpRebound();
    this.alignment = this.calculateAlignment();
    this.diff = this.calculateDifferential(this.frontDist, this.drivetrain, powerToWeight);
    this.antiRoll = this.calculateAntiRoll();

  }


  private calculateSprings(): SpringRate {
    const frontWeight = this.weight * (this.frontDist / 100);
    const rearWeight = this.weight * (this.rearDist / 100);
    return {
      front: this.clamp((frontWeight / 2) * 0.9, this.limits.springRate.min, this.limits.springRate.max),
      rear: this.clamp((rearWeight / 2) * 0.9, this.limits.springRate.min, this.limits.springRate.max),
    };
  }

  private calculateBumpRebound(): BumpRebound {
    const max = 13;
    const factor = 1.6;
    const frontBump = this.clampInt(Math.round(max * (this.frontDist / 100) * 0.65), this.limits.bump.min, this.limits.bump.max);
    const rearBump = this.clampInt(Math.round(max * (this.rearDist / 100) * 0.65), this.limits.bump.min, this.limits.bump.max);
    return {
      bump: {
        front: frontBump,
        rear: rearBump,
      },
      rebound: {
        front: this.clamp(frontBump * factor, this.limits.rebound.min, this.limits.rebound.max),
        rear: this.clamp(rearBump * factor, this.limits.rebound.min, this.limits.rebound.max),
      },
    };
  }

  private calculateCamber(frontPercent: number): SpringRate {
    let frontCamber = -2.2 + ((50 - frontPercent) / 15);
    frontCamber = this.clamp(frontCamber, -1.8, 1.8);

    let rearCamber = frontCamber + 0.7;
    rearCamber = this.clamp(rearCamber, -1.3, 1.2);

    return {
      front: parseFloat(frontCamber.toFixed(1)),
      rear: parseFloat(rearCamber.toFixed(1)),
    };
  }


  private calculateCaster(frontPercent: number, drivetrain: Drivetrain, powerToWeight: number): number {
    let caster = drivetrain === "FWD" ? 5.6 : 6.0;

    const rearBias = 100 - frontPercent;
    if (rearBias > 55 || powerToWeight > 0.3) {
      caster += 0.1;
    }

    return this.clamp(parseFloat(caster.toFixed(1)), this.limits.caster.min, this.limits.caster.max);
  }

  private calculateToe(preference: RaceStyle): Toe {
    switch (preference) {
      case "Technical":
        return { front: 0.2, rear: 0.1 };
      case "HighSpeed":
        return { front: -0.1, rear: -0.1 };
      default:
        return { front: 0, rear: 0 };
    }
  }
  private calculateAlignment(): Alignment {
    return {
      camber: this.calculateCamber(this.frontDist),
      toe: this.calculateToe(this.raceStyle),
      caster: this.calculateCaster(this.frontDist, this.drivetrain, this.powerToWeight),
    };
  }


  private calculateAWDDiff(frontPercent: number, powerToWeight: number): Differential {
    const rearPercent = 100 - frontPercent;

    const frontAccel = this.clamp(25 + (frontPercent - 50) * 0.2, 10, 40);
    const frontDecel = this.clamp(5 + (frontPercent - 50) * 0.1, 0, 15);

    const rearAccel = this.clamp(60 + (rearPercent - 50) * 0.4 + (powerToWeight - 0.15) * 25, 50, 85);
    const rearDecel = this.clamp(15 + (rearPercent - 50) * 0.2, 10, 35);

    const centerBalance = this.clamp(60 + (rearPercent - 50) * 0.3, 60, 75);

    return {
      drivetrain: "AWD",
      front: {
        acceleration: Math.round(frontAccel),
        deceleration: Math.round(frontDecel),
      },
      rear: {
        acceleration: Math.round(rearAccel),
        deceleration: Math.round(rearDecel),
      },
      center: Math.round(centerBalance),
    };
  }


  private calculateDifferential(
    frontPercent: number,
    drivetrain: Drivetrain,
    powerToWeight: number = 0
  ): Differential {
    const differential: Differential = {
      drivetrain,
      front: { acceleration: 0, deceleration: 0 },
      rear: { acceleration: 0, deceleration: 0 },
      center: 0,
    };

    const rearBias = 100 - frontPercent;
    const baseAccel = 40 + (rearBias - 50) * 0.75;
    const baseDecel = 30;

    if (drivetrain === "FWD") {
      differential.front.acceleration = Math.round(this.clamp(baseAccel - 3, 0, 100));
      differential.front.deceleration = Math.round(this.clamp(baseDecel, 0, 100));
      differential.center = 50
    } else if (drivetrain === "RWD") {
      differential.rear.acceleration = Math.round(this.clamp(baseAccel, 0, 100));
      differential.rear.deceleration = Math.round(this.clamp(baseDecel, 0, 100));
      differential.center = 50
    } else if (drivetrain === "AWD") {
      return this.calculateAWDDiff(frontPercent, powerToWeight);
    }

    return differential;
  }

  private calculateAntiRoll(): AntiRollBar {
    const baseFactor = 0.0112;
    let front = (this.weight * this.frontDist / 100) * baseFactor;
    let rear = (this.weight * this.rearDist / 100) * baseFactor;

    switch (this.drivetrain) {
      case "FWD": front *= 1.1; rear *= 0.9; break;
      case "AWD": front *= 0.95; rear *= 1.05; break;
      case "RWD": front *= 0.9; rear *= 1.1; break;
    }

    return {
      front: this.clamp(this.roundToTenth(front), this.limits.antiRoll.min, this.limits.antiRoll.max),
      rear: this.clamp(this.roundToTenth(rear), this.limits.antiRoll.min, this.limits.antiRoll.max),
    };
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, parseFloat(value.toFixed(2))));
  }

  private clampInt(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  private roundToTenth(value: number) {
    return Math.round(value * 10) / 10;
  }

  toJSON(): TuneOutput {
    return {
      weight: this.weight,
      distribution: { front: this.frontDist, rear: this.rearDist },
      springs: this.springs,
      damping: this.damping,
      alignment: this.alignment,
      diff: this.diff,
      antiRoll: this.antiRoll,
      limits: this.limits
    };
  }
}
