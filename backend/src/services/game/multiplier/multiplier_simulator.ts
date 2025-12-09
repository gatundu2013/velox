import { MultiplierGenerator } from "./multiplier_generator";
import crypto from "crypto";

type MultiplierRangeT =
  | "1-2"
  | "2-3"
  | "3-5"
  | "5-10"
  | "10-20"
  | "20-50"
  | "50-100"
  | "100-500"
  | "500-1000"
  | "1000+";

interface DistributionDataI {
  count: number;
  percentage: number;
}

interface SimulationResultI {
  distribution: Record<MultiplierRangeT, DistributionDataI>;
  minMultiplierHit: number;
  maxMultiplierHit: number;
  totalRounds: number;
  statistics: {
    averageMultiplier: number;
    medianMultiplier: number;
  };
}

export class MultiplierSimulator {
  private static readonly MULTIPLIER_DISTRIBUTION_RANGE = {
    "1-2": { minInc: 1, maxExc: 2 },
    "2-3": { minInc: 2, maxExc: 3 },
    "3-5": { minInc: 3, maxExc: 5 },
    "5-10": { minInc: 5, maxExc: 10 },
    "10-20": { minInc: 10, maxExc: 20 },
    "20-50": { minInc: 20, maxExc: 50 },
    "50-100": { minInc: 50, maxExc: 100 },
    "100-500": { minInc: 100, maxExc: 500 },
    "500-1000": { minInc: 500, maxExc: 1000 },
    "1000+": { minInc: 1000, maxExc: Infinity },
  } as const;

  private generateDistribution() {
    const distribution: Record<MultiplierRangeT, DistributionDataI> =
      {} as Record<MultiplierRangeT, DistributionDataI>;
    for (const key in MultiplierSimulator.MULTIPLIER_DISTRIBUTION_RANGE) {
      distribution[key as MultiplierRangeT] = { count: 0, percentage: 0 };
    }
    return distribution;
  }

  private calculateAverage(multipliers: number[]) {
    if (multipliers.length === 0) return 0;
    const sum = multipliers.reduce((acc, val) => acc + val, 0);
    return sum / multipliers.length;
  }

  private calculateMedian(multipliers: number[]) {
    if (multipliers.length === 0) return 0;

    const sorted = [...multipliers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
      const lower = sorted[mid - 1];
      const upper = sorted[mid];
      if (lower !== undefined && upper !== undefined) {
        return (lower + upper) / 2;
      }
    }

    const median = sorted[mid];
    return median !== undefined ? median : 0;
  }

  private simulateMultipliers(rounds = 1000): SimulationResultI {
    const distribution = this.generateDistribution();
    const multiplier = new MultiplierGenerator();
    const allMultipliers: number[] = [];

    let minMultiplierHit = Infinity;
    let maxMultiplierHit = -Infinity;

    for (let i = 0; i < rounds; i++) {
      multiplier.generateServerSeed();
      const finalMultiplier = multiplier.generateFinalResults({
        clientSeed: crypto.randomBytes(8).toString("hex"),
        clientSeedDetails: [],
      });

      // Track min and max
      minMultiplierHit = Math.min(minMultiplierHit, finalMultiplier);
      maxMultiplierHit = Math.max(maxMultiplierHit, finalMultiplier);
      allMultipliers.push(finalMultiplier);

      // Find matching range
      let matched = false;
      for (const [key, value] of Object.entries(
        MultiplierSimulator.MULTIPLIER_DISTRIBUTION_RANGE
      )) {
        const typedKey = key as MultiplierRangeT;

        if (finalMultiplier >= value.minInc && finalMultiplier < value.maxExc) {
          distribution[typedKey].count += 1;
          matched = true;
          break;
        }
      }

      if (!matched) {
        console.warn(`Multiplier ${finalMultiplier} outside defined ranges`);
      }
    }

    // Calculate all percentages once after counting
    for (const key in distribution) {
      const typedKey = key as MultiplierRangeT;
      distribution[typedKey].percentage =
        (distribution[typedKey].count / rounds) * 100;
    }

    // Calculate statistics
    const averageMultiplier = this.calculateAverage(allMultipliers);
    const medianMultiplier = this.calculateMedian(allMultipliers);

    return {
      distribution,
      minMultiplierHit: minMultiplierHit === Infinity ? 0 : minMultiplierHit,
      maxMultiplierHit: maxMultiplierHit === -Infinity ? 0 : maxMultiplierHit,
      totalRounds: rounds,
      statistics: {
        averageMultiplier,
        medianMultiplier,
      },
    };
  }

  public runSimulation(rounds = 10000) {
    console.log(`\n🎮 Running Crash Game Simulation (${rounds} rounds)...\n`);
    const results = this.simulateMultipliers(rounds);
    return results;
  }
}
