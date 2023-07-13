import 'package:flutter/material.dart';

class TextAdventureGame extends StatefulWidget {
  @override
  _TextAdventureGameState createState() => _TextAdventureGameState();
}

class _TextAdventureGameState extends State<TextAdventureGame> {
  int currentStep = 0;
  int currentMessageIndex = 0;
  List<dynamic> messages = [];
  List<String> selectedOptions = [];
  Map<String, dynamic> player = {
    "name": "Герой",
    "health": 100,
    "attributePoints": 15,
    "strength": 5,
    "agility": 5,
    "intelligence": 5,
    "charisma": 5,
    "inventory": [],
    "currentStep": 0,
    "visitedSteps": [],
    "encounteredCharacters": [],
  };

  @override
  void initState() {
    super.initState();
    // Загрузка сохраненных данных из localStorage
    loadPlayerData();
    // Загрузка начального шага квеста
    executeStep(currentStep);
  }

  void loadPlayerData() {
    // Загрузка сохраненных данных игрока из localStorage
    // Если сохраненные данные есть, присваиваем их переменной player
  }

  void savePlayerData() {
    // Сохранение данных игрока в localStorage
  }

  void executeStep(int stepId) {
    // Загрузка данных текущего шага квеста с помощью API или из файла JSON
    // Обновление значений messages и других переменных на основе загруженных данных
  }

  void selectOption(dynamic option) {
    // Обработка выбранной опции
    // Обновление значений переменных и переход к следующему шагу, если есть
    // Сохранение данных игрока
  }

  void showNextMessage() {
    // Отображение следующего сообщения из messages
    // Обработка опций и логика перехода к следующему сообщению или шагу
    // Сохранение данных игрока
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Text Adventure'),
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Current Step: $currentStep',
              style: TextStyle(
                fontSize: 18.0,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16.0),
            Text(
              'Messages:',
              style: TextStyle(
                fontSize: 16.0,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8.0),
            Expanded(
              child: ListView.builder(
                itemCount: messages.length,
                itemBuilder: (context, index) {
                  dynamic message = messages[index];
                  return ListTile(
                    leading: CircleAvatar(
                      backgroundImage: AssetImage(message.avatar),
                    ),
                    title: Text(message.author),
                    subtitle: Text(message.content),
                  );
                },
              ),
            ),
            SizedBox(height: 16.0),
            Text(
              'Options:',
              style: TextStyle(
                fontSize: 16.0,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8.0),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: options
                  .map((option) => ElevatedButton(
                        onPressed: () => selectOption(option),
                        child: Text(option),
                      ))
                  .toList(),
            ),
          ],
        ),
      ),
    );
  }
}

void main() {
  runApp(MaterialApp(
    title: 'Text Adventure Game',
    home: TextAdventureGame(),
  ));
}
