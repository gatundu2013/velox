import crypto from "crypto";

interface MultiplierStateI {
  serverSeed: string | null;
  hashedServerSeed: string | null;
  clientSeed: string | null;
  clientSeedDetails: { userId: string; seed: string }[];
  hash: string | null;
  hashAsNumber: number | null;
  rawMultiplier: number | null;
  finalMultiplier: number | null;
}

interface ClientSeedDetailsI {
  seed: string;
  userId: string;
}

export class MultiplierGenerator {
  private static readonly CONFIG = {
    houseEdge: 3,
    sliceHashLength: 13,
    hashingAlgorithm: "sha256",
    encodingFormat: "hex",
  } as const;

  private readonly multiplierState: MultiplierStateI = {
    serverSeed: null,
    hashedServerSeed: null,
    clientSeed: null,
    clientSeedDetails: [],
    hash: null,
    hashAsNumber: null,
    rawMultiplier: null,
    finalMultiplier: null,
  };

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

  public generateFinalResults(params: {
    clientSeed: string;
    clientSeedDetails: ClientSeedDetailsI[];
  }) {
    this.validateClientSeed(params.clientSeed);

    this.multiplierState.clientSeed = params.clientSeed.trim();
    this.multiplierState.clientSeedDetails = params.clientSeedDetails;

    this.generateHash();
  }

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

    console.log(this);

    return hash;
  }

  private validateClientSeed(clientSeed: string) {
    if (typeof clientSeed !== "string") {
      throw new Error(
        `Client Seed should be a string, got type ${typeof clientSeed}`
      );
    }
    if (!clientSeed.trim()) {
      throw new Error("Client seed cannot be empty or whitespace only");
    }

    if (clientSeed.length > 75) {
      throw new Error("Client seed is too long (max 1000 characters)");
    }
  }
}
