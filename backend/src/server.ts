import { MultiplierGenerator } from "./services/game/multiplier_generator";

console.log("Velox server");

const multiplier = new MultiplierGenerator();

multiplier.generatedServerSeed();
multiplier.generateFinalResults({
  clientSeed: "hellothere    ",
  clientSeedDetails: [],
});
