class QuestGenerator {
  constructor(npcData, locationData, interactionData) {
    this.npcData = npcData; // Данные о персонажах (NPC)
    this.locationData = locationData; // Данные о локациях
    this.interactionData = interactionData; // Данные о взаимодействиях
  }

  // Функция для получения случайного элемента из массива
  getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Генерация случайного NPC
  generateRandomNPC() {
    const npc = this.getRandomElement(this.npcData);
    return npc;
  }

  // Генерация случайной локации
  generateRandomLocation() {
    const location = this.getRandomElement(this.locationData);
    return location;
  }

  // Генерация случайного взаимодействия
  generateRandomInteraction() {
    const interaction = this.getRandomElement(this.interactionData);
    return interaction;
  }

  // Генерация квеста
  generateQuest() {
    const npc = this.generateRandomNPC();
    const location = this.generateRandomLocation();
    const interaction = this.generateRandomInteraction();

    // Создаем структуру квеста на основе данных
    const quest = {
      id: Date.now(), // Уникальный ID квеста
      npc: npc,
      location: location,
      interaction: interaction,
      messages: [
        {
          author: npc.name,
          content: interaction.dialog[0].content,
        },
      ],
      options: interaction.options || [],
    };

    return quest;
  }
}

// Пример данных NPC
const npcData = [
  { race: "человек", gender: "мужчина", job: "рыцарь", name: "Артур" },
  { race: "эльф", gender: "женщина", job: "маг", name: "Элианна" },
];

// Пример данных локаций
const locationData = [
  {
    type: "город",
    image: "city/city_square.jpg",
    description: "Шумная площадь.",
  },
  { type: "лес", image: "forest/forest_night.jpg", description: "Темный лес." },
];

// Пример данных взаимодействий
const interactionData = [
  {
    interaction_type: "quest",
    dialog: [
      { author: "Рыцарь Артур", content: "У меня есть задание для тебя!" },
    ],
    quest: { description: "Найди древний меч", reward: "Меч Света" },
    options: [{ id: 1, text: "Принять задание" }],
  },
  {
    interaction_type: "dialog",
    dialog: [
      { author: "Крестьянин", content: "Сегодня на площади продают овощи." },
    ],
  },
];

// Создаем экземпляр генератора квестов
const questGenerator = new QuestGenerator(
  npcData,
  locationData,
  interactionData
);

// Генерируем случайный квест
const randomQuest = questGenerator.generateQuest();
console.log(randomQuest);
