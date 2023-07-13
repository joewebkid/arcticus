import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

void main() {
  runApp(QuestApp());
}

class QuestApp extends StatefulWidget {
  @override
  _QuestAppState createState() => _QuestAppState();
}

class _QuestAppState extends State<QuestApp> {
  Player player = Player(
    name: 'Герой',
    health: 100,
    attributePoints: 15,
    strength: 5,
    agility: 5,
    intelligence: 5,
    charisma: 5,
    inventory: [],
    currentStep: 0,
    visitedSteps: [],
    encounteredCharacters: [],
  );
  int currentStep = 0;
  int currentMessageIndex = 0;
  bool messages = false;
  List<int> selectedOptions = [];

  @override
  void initState() {
    super.initState();
    loadPlayerData();
  }

  void loadPlayerData() {
    String savedPlayerData = localStorage.getItem('playerData');
    if (savedPlayerData != null) {
      player = Player.fromJson(jsonDecode(savedPlayerData));
    }
  }

  Future<void> loadQuest(void Function(Map<String, dynamic>) callback, int stepId) async {
    try {
      var response = await http.get(Uri.parse('/data/ar_$stepId.json'));
      if (response.statusCode == 200) {
        Map<String, dynamic> data = jsonDecode(response.body);
        callback(data);
      }
    } catch (e) {
      print('Error loading quest: $e');
    }
  }

  void showNextMessage() {
    if (currentMessageIndex < messages.length) {
      var message = messages[currentMessageIndex];

      if (!shouldShowObject(message)) {
        currentMessageIndex++;
        showNextMessage();
        return;
      }

      showMessage(message['author'], message['content'], message['avatar']);
      bool lastBlock = currentMessageIndex + 1 == messages.length;

      // Show typing indicator if there are more message blocks
      final typingIndicator = document.getElementById('typingIndicator');
      typingIndicator.style.display = lastBlock ? 'none' : 'flex';

      // Show options or hide them
      final optionsContainer = document.getElementById('optionsList');

      if (lastBlock) {
        final chatWindow = document.getElementById('chatWindow');

        setTimeout(() {
          optionsContainer.style.display = 'block';
          chatWindow.scrollTop = chatWindow.scrollHeight;
        }, 500);
      } else {
        optionsContainer.style.display = 'none';
      }

      currentMessageIndex++;
    }
  }

  void showMessage(String author, String content, [dynamic avatar = false]) {
    final chatWindow = document.getElementById('chatWindow');
    final chatContainer = document.getElementById('chatContainer');
    final messageContainer = document.createElement('div');
    messageContainer.className = 'message';

    final authorElement = document.createElement('div');
    authorElement.className = 'author';
    authorElement.innerText = author;

    dynamic avatarElement;
    if (author == 'Система') {
      avatar = 'system.png';
    }
    if (author == 'Герой') {
      avatar = 'hero.png';
    }
    if (author == 'Неизвестный голос') {
      avatar = 'unknown.png';
    }
    if (avatar != false) {
      avatarElement = document.createElement('img');
      avatarElement.classList.add('avatar');
      messageContainer.classList.add('left');
      avatarElement.src = 'img/persons/$avatar';
    } else {
      avatarElement = document.createElement('div');
      avatarElement.classList.add('avatar');
      messageContainer.classList.add('left');
      avatarElement.innerText = author[0];
    }
    if (author == 'Неизвестный голос') {
      messageContainer.classList.add('right');
    }

    final contentElement = document.createElement('div');
    contentElement.className = 'content';
    contentElement.innerText = content;

    if (author == 'Система') {
      messageContainer.classList.add('system');
    }

    messageContainer.appendChild(avatarElement);
    messageContainer.appendChild(contentElement);
    contentElement.appendChild(authorElement);
    chatContainer.appendChild(messageContainer);
  }

  void increaseAttribute(String attribute) {
    if (player.attributePoints > 0) {
      setState(() {
        player.attributePoints--;
        player[attribute]++;
      });
    }
  }

  void decreaseAttribute(String attribute) {
    if (player[attribute] > 1) {
      setState(() {
        player.attributePoints++;
        player[attribute]--;
      });
    }
  }

  void updateAttributePoints() {
    document.getElementById('attributePointsValue').innerText =
        player.attributePoints.toString();
  }

  void updateAttributeValue(String attribute) {
    document.getElementById('${attribute}Value').innerText = player[attribute].toString();
  }

  void updateOptions(List<dynamic> options) {
    final optionsContainer = document.getElementById('optionsList');
    optionsContainer.innerHTML = '';

    options.forEach((option) {
      if (shouldShowObject(option)) {
        final optionElement = createOptionElement(option);
        optionsContainer.appendChild(optionElement);
      }
    });
  }

  void selectOption(dynamic option) {
    setState(() {
      selectedOptions.add(option['id']);
    });

    if (option['nextStep'] != null) {
      executeStep(option['nextStep']);
    }

    if (option['result'] != null) {
      final result = option['result'];
      messages = result['messages'];

      if (result['options'] != null) {
        updateOptions(result['options']);
      }

      currentMessageIndex = 0;
      if (messages != null) {
        showNextMessage();
      }

      if (option['item'] != null) {
        setState(() {
          player.inventory.add(option['item']);
        });
        showMessage('Система', 'Получен предмет: ${option['item']['name']}');
      }
    }

    if (option['item'] != null) {
      setState(() {
        player.inventory.add(option['item']);
      });
      showMessage('Система', 'Получен предмет: ${option['item']['name']}');
    }
  }

  bool shouldShowObject(dynamic object) {
    if (object['once'] != null && selectedOptions.contains(object['id'])) {
      return false;
    }

    if (object['item'] != null && !player.inventory.contains(object['item'])) {
      return false;
    }

    if (object['characters'] != null &&
        !object['characters'].every((character) => player.encounteredCharacters.contains(character))) {
      return false;
    }

    if (object['showIfStep'] != null &&
        !object['showIfStep'].every((step) => player.visitedSteps.contains(step))) {
      return false;
    }

    if (object['hideIfStep'] != null &&
        object['hideIfStep'].any((step) => player.visitedSteps.contains(step))) {
      return false;
    }

    return true;
  }

  Widget createOptionElement(dynamic option) {
    return InkWell(
      onTap: () => selectOption(option),
      child: Container(
        child: Text(option['text']),
      ),
    );
  }

  void executeStep(int stepId) {
    loadQuest((step) {
      setState(() {
        clearMessage();
        clearOptions();
        currentMessageIndex = 0;
        currentStep = step['id'];

        if (!player.visitedSteps.contains(step['id'])) {
          player.visitedSteps.add(step['id']);
        }

        messages = step['messages'];

        if (messages != null) {
          showNextMessage();
        }

        if (step['item'] != null) {
          setState(() {
            player.inventory.add(step['item']);
          });
          showMessage('Система', 'Получен предмет: ${step['item']['name']}');
        }

        if (step['character'] != null) {
          player.encounteredCharacters.add(step['character']);
        }

        if (step['location'] != null) {
          updateLocationImage(step['location']['image']);
        }

        if (step['options'] != null) {
          updateOptions(step['options']);
        }

        savePlayerData();
      });
    }, stepId);
  }

  void updateLocationImage(String imageUrl) {
    final locationImage = document.getElementById('locationImage');
    if (imageUrl == null) {
      imageUrl = 'black.png';
    }

    locationImage.classList.add('open-animation');
    locationImage.src = 'img/locations/$imageUrl';
    setTimeout(() {
      locationImage.classList.remove('open-animation');
    }, 500);
  }

  bool checkRequirements(Map<String, dynamic> requirements) {
    if (requirements == null) {
      return true;
    }

    for (var key in requirements.keys) {
      if (player[key] < requirements[key]) {
        return false;
      }
    }

    return true;
  }

  void clearMessage() {
    final messageContainer = document.getElementById('chatContainer');
    messageContainer.innerHTML = '';
  }

  void clearOptions() {
    final optionsList = document.getElementById('optionsList');
    optionsList.innerHTML = '';
  }

  void savePlayerData() {
    player.currentStep = currentStep;
    localStorage.setItem('playerData', jsonEncode(player.toJson()));
  }

  void showGameSection() {
    final introSection = document.getElementById('intro');
    final gameSection = document.getElementById('game');

    introSection.style.display = 'none';
    gameSection.style.display = 'block';
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Quest Game',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: Scaffold(
        body: Container(
          child: Column(
            children: [
              Expanded(
                child: SingleChildScrollView(
                  child: Column(
                    children: [
                      Container(
                        id: 'chatWindow',
                        child: GestureDetector(
                          onTap: showNextMessage,
                          child: ListView(
                            shrinkWrap: true,
                            children: [
                              Container(
                                id: 'chatContainer',
                              ),
                            ],
                          ),
                        ),
                      ),
                      Container(
                        id: 'typingIndicator',
                      ),
                      Container(
                        id: 'optionsList',
                      ),
                    ],
                  ),
                ),
              ),
              Container(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('Attribute Points:'),
                    TextButton(
                      onPressed: () => increaseAttribute('attributePoints'),
                      child: Text('+'),
                    ),
                    Text(player.attributePoints.toString()),
                    TextButton(
                      onPressed: () => decreaseAttribute('attributePoints'),
                      child: Text('-'),
                    ),
                  ],
                ),
              ),
              Container(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    Column(
                      children: [
                        Text('Strength:'),
                        TextButton(
                          onPressed: () => increaseAttribute('strength'),
                          child: Text('+'),
                        ),
                        Text(player.strength.toString()),
                        TextButton(
                          onPressed: () => decreaseAttribute('strength'),
                          child: Text('-'),
                        ),
                      ],
                    ),
                    Column(
                      children: [
                        Text('Agility:'),
                        TextButton(
                          onPressed: () => increaseAttribute('agility'),
                          child: Text('+'),
                        ),
                        Text(player.agility.toString()),
                        TextButton(
                          onPressed: () => decreaseAttribute('agility'),
                          child: Text('-'),
                        ),
                      ],
                    ),
                    Column(
                      children: [
                        Text('Intelligence:'),
                        TextButton(
                          onPressed: () => increaseAttribute('intelligence'),
                          child: Text('+'),
                        ),
                        Text(player.intelligence.toString()),
                        TextButton(
                          onPressed: () => decreaseAttribute('intelligence'),
                          child: Text('-'),
                        ),
                      ],
                    ),
                    Column(
                      children: [
                        Text('Charisma:'),
                        TextButton(
                          onPressed: () => increaseAttribute('charisma'),
                          child: Text('+'),
                        ),
                        Text(player.charisma.toString()),
                        TextButton(
                          onPressed: () => decreaseAttribute('charisma'),
                          child: Text('-'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              Container(
                child: ElevatedButton(
                  onPressed: startQuest,
                  child: Text('Start Quest'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class Player {
  String name;
  int health;
  int attributePoints;
  int strength;
  int agility;
  int intelligence;
  int charisma;
  List<dynamic> inventory;
  int currentStep;
  List<int> visitedSteps;
  List<dynamic> encounteredCharacters;

  Player({
    required this.name,
    required this.health,
    required this.attributePoints,
    required this.strength,
    required this.agility,
    required this.intelligence,
    required this.charisma,
    required this.inventory,
    required this.currentStep,
    required this.visitedSteps,
    required this.encounteredCharacters,
  });

  factory Player.fromJson(Map<String, dynamic> json) {
    return Player(
      name: json['name'],
      health: json['health'],
      attributePoints: json['attributePoints'],
      strength: json['strength'],
      agility: json['agility'],
      intelligence: json['intelligence'],
      charisma: json['charisma'],
      inventory: json['inventory'],
      currentStep: json['currentStep'],
      visitedSteps: json['visitedSteps'],
      encounteredCharacters: json['encounteredCharacters'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'health': health,
      'attributePoints': attributePoints,
      'strength': strength,
      'agility': agility,
      'intelligence': intelligence,
      'charisma': charisma,
      'inventory': inventory,
      'currentStep': currentStep,
      'visitedSteps': visitedSteps,
      'encounteredCharacters': encounteredCharacters,
    };
  }
}

void startQuest() {
  final characterCreationSection = document.getElementById('characterCreation');
  final gameSection = document.getElementById('game');
  gameSection.style.display = 'block';
  characterCreationSection.style.display = 'none';
}
