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
}
