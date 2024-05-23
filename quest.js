import { QuestGame } from "./classes/quest-game.js";
import { Dice } from "./classes/dice.js";
// Инициализация игры
const game = new QuestGame();
game.initialize();

const dice = new Dice("dice", "text")