import crypto from "crypto";

interface MultiplierStateI {
  serverSeed: string | null;
  hashedServerSeed: string | null;
  clientSeed: string | null;
  clientSeedDetails: { userId: string; seed: string }[];
  hash: string | null;
  hashAsNumber: number | null;
  normalizedValue: number | null;
  rawMultiplier: number | null;
  finalMultiplier: number | null;
}

interface ClientSeedDetailsI {
  seed: string;
  userId: string;
}

/**
 * MultiplierGenerator - Generates provably fair multipliers
 * Uses cryptographic hashing to ensure fairness and verifiability
 */
export class MultiplierGenerator {
  private static readonly CONFIG = {
    houseEdge: 0.03, // House edge percentage
    sliceHashLength: 13, // Length to slice hash for multiplier calculation
    hashingAlgorithm: "sha256",
    encodingFormat: "hex",
    minMultiplier: 1,
    maxMultiplier: 9999,
  } as const;

  private readonly multiplierState: MultiplierStateI = {
    serverSeed: null,
    hashedServerSeed: null,
    clientSeed: null,
    clientSeedDetails: [],
    hash: null,
    hashAsNumber: null,
    normalizedValue: null,
    rawMultiplier: null,
    finalMultiplier: null,
  };

  /**
   * Generates a cryptographically secure server seed and its hash
   * The hash is used to prove fairness before the game round starts
   */
  public generatedServerSeed(): string {
    const serverSeed = crypto
      .randomBytes(32)
      .toString(MultiplierGenerator.CONFIG.encodingFormat);

    const hashedServerSeed = crypto
      .createHash(MultiplierGenerator.CONFIG.hashingAlgorithm)
      .update(serverSeed)
      .digest(MultiplierGenerator.CONFIG.encodingFormat);

    this.multiplierState.serverSeed = serverSeed;
    this.multiplierState.hashedServerSeed = hashedServerSeed;

    return serverSeed;
  }

  /**
   * Generates the final multiplier result using server and client seeds
   */
  public generateFinalResults(params: {
    clientSeed: string;
    clientSeedDetails: ClientSeedDetailsI[];
  }): number {
    this.validateClientSeed(params.clientSeed);

    this.multiplierState.clientSeed = params.clientSeed.trim();
    this.multiplierState.clientSeedDetails = params.clientSeedDetails;

    this.generateHash();
    const finalMultiplier = this.calculateMultiplier();

    return finalMultiplier;
  }

  /**
   * Generates the hash by combining server and client seeds
   * This hash is used to calculate the final multiplier
   */
  private generateHash(): string {
    if (!this.multiplierState.serverSeed) {
      throw new Error("Server seed was not generated");
    }

    if (!this.multiplierState.clientSeed) {
      throw new Error("Client seed is required to generate hash");
    }

    const combinedSeeds = `${this.multiplierState.serverSeed}${this.multiplierState.clientSeed}`;
    const hash = crypto
      .createHash(MultiplierGenerator.CONFIG.hashingAlgorithm)
      .update(combinedSeeds)
      .digest(MultiplierGenerator.CONFIG.encodingFormat);

    this.multiplierState.hash = hash;

    return hash;
  }

  /**
   * Calculates the multiplier from the generated hash
   */
  private calculateMultiplier(): number {
    if (!this.multiplierState.hash) {
      throw new Error("Hash must be generated before calculating multiplier");
    }

    // Slice hash to prevent exceeding JavaScript's max safe integer (2^53 - 1)
    const slicedHash = this.multiplierState.hash.slice(
      0,
      MultiplierGenerator.CONFIG.sliceHashLength
    );

    // Calculate the max value sliced hash can hold
    // Each hex character represents 4 bits, so 2 hex chars = 1 byte
    const numBytes = slicedHash.length / 2;
    const numBits = numBytes * 8;
    const maxHashValue = 2 ** numBits - 1;

    const hashAsNumber = parseInt(slicedHash, 16);

    if (isNaN(hashAsNumber)) {
      throw new Error(
        `Failed to parse hash as number. Sliced hash: "${slicedHash}", length: ${slicedHash.length}`
      );
    }

    // Normalize to range [0, 1] for fair distribution
    const normalizedValue = hashAsNumber / maxHashValue;

    // Calculate raw multiplier using formula: 1 / (1 - normalizedValue)
    // Edge case: if normalizedValue = 1, rawMultiplier = Infinity (handled by max cap below)
    const rawMultiplier = 1 / (1 - normalizedValue);

    // Apply house edge: multiply by (1 - houseEdge)
    // Example: rawMultiplier = 2.0, houseEdge = 0.03 → 2.0 * 0.97 = 1.94
    const withHouseEdge =
      rawMultiplier * (1 - MultiplierGenerator.CONFIG.houseEdge);

    // Clamp multiplier between min and max values
    let finalMultiplier: number;
    if (withHouseEdge > MultiplierGenerator.CONFIG.maxMultiplier) {
      finalMultiplier = MultiplierGenerator.CONFIG.maxMultiplier;
    } else if (withHouseEdge < MultiplierGenerator.CONFIG.minMultiplier) {
      finalMultiplier = MultiplierGenerator.CONFIG.minMultiplier;
    } else {
      finalMultiplier = withHouseEdge;
    }

    finalMultiplier = Math.round(finalMultiplier * 100) / 100;

    this.multiplierState.hashAsNumber = hashAsNumber;
    this.multiplierState.normalizedValue = normalizedValue;
    this.multiplierState.rawMultiplier = rawMultiplier;
    this.multiplierState.finalMultiplier = finalMultiplier;

    return finalMultiplier;
  }

  /**
   * Validates the client seed input
   */
  private validateClientSeed(clientSeed: string): void {
    if (typeof clientSeed !== "string") {
      throw new Error(
        `Client seed must be a string, got type ${typeof clientSeed}`
      );
    }
    if (!clientSeed.trim()) {
      throw new Error("Client seed cannot be empty or whitespace only");
    }

    if (clientSeed.length > 75) {
      throw new Error("Client seed is too long (max 75 characters)");
    }
  }
}
