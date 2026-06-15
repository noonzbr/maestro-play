import { allGames } from "../lib/games"
import { Game, Scene } from "../lib/games/types"

console.log("=== STARTING MAESTRO PLAY GAME CONFIGURATION AUDIT ===");

let totalErrors = 0;
let totalWarnings = 0;

allGames.forEach((game: Game) => {
  console.log(`\nAuditing Game: [Week ${game.week}] "${game.title}" (slug: "${game.slug}")`);
  let gameErrors = 0;
  let gameWarnings = 0;

  // 1. Basic properties check
  if (!game.slug) {
    console.error(`[ERROR] Game is missing a slug!`);
    gameErrors++;
  }
  if (!game.title) {
    console.error(`[ERROR] Game is missing a title!`);
    gameErrors++;
  }
  if (!game.characterName) {
    console.warn(`[WARN] Game is missing characterName.`);
    gameWarnings++;
  }
  if (!game.scenes || game.scenes.length === 0) {
    console.error(`[ERROR] Game has no scenes defined!`);
    gameErrors++;
    totalErrors += gameErrors;
    totalWarnings += gameWarnings;
    return;
  }

  // Map to store scene details
  const sceneIds = new Set<string>();
  const scenesMap = new Map<string, Scene>();

  game.scenes.forEach((scene: Scene, idx: number) => {
    if (!scene.id) {
      console.error(`[ERROR] Scene at index ${idx} is missing an ID!`);
      gameErrors++;
    } else {
      if (sceneIds.has(scene.id)) {
        console.error(`[ERROR] Duplicate scene ID found: "${scene.id}" at index ${idx}`);
        gameErrors++;
      }
      sceneIds.add(scene.id);
      scenesMap.set(scene.id, scene);
    }
  });

  // 2. Branching and transition checks
  game.scenes.forEach((scene: Scene, idx: number) => {
    // Check choices
    if (scene.choices) {
      scene.choices.forEach((choice, cIdx) => {
        if (choice.leadsTo) {
          if (!sceneIds.has(choice.leadsTo)) {
            console.error(`[ERROR] Scene "${scene.id}" Choice ${cIdx} ("${choice.text.substring(0, 30)}...") leadsTo a non-existent scene ID: "${choice.leadsTo}"`);
            gameErrors++;
          }
        }
      });
    }

    // Check nextLeadsTo
    if (scene.nextLeadsTo) {
      if (!sceneIds.has(scene.nextLeadsTo)) {
        console.error(`[ERROR] Scene "${scene.id}" has nextLeadsTo pointing to a non-existent scene ID: "${scene.nextLeadsTo}"`);
        gameErrors++;
      }
    }

    // Check felipeCard rejoinsAt
    if (scene.felipeCard && scene.felipeCard.rejoinsAt) {
      if (!sceneIds.has(scene.felipeCard.rejoinsAt)) {
        console.error(`[ERROR] Scene "${scene.id}" (Felipe Card) rejoinsAt a non-existent scene ID: "${scene.felipeCard.rejoinsAt}"`);
        gameErrors++;
      }
    }

    // Check consequence scene next element connection
    if (scene.type === "consequence" && idx + 1 < game.scenes.length) {
      const nextScene = game.scenes[idx + 1];
      if (nextScene.type !== "felipe") {
        console.warn(`[WARN] Consequence scene "${scene.id}" is not immediately followed by a "felipe" scene (next is "${nextScene.id}" of type "${nextScene.type}"). Check story flow.`);
        gameWarnings++;
      }
    }
  });

  console.log(`-> Summary for "${game.slug}": ${game.scenes.length} scenes, ${gameErrors} errors, ${gameWarnings} warnings`);
  totalErrors += gameErrors;
  totalWarnings += gameWarnings;
});

console.log(`\n======================================================`);
console.log(`TOTAL AUDIT RESULTS: ${totalErrors} Errors, ${totalWarnings} Warnings`);
console.log(`======================================================`);

if (totalErrors > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
