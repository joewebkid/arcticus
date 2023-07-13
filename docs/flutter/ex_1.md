## QuestApp

### Методы

#### `void loadPlayerData()`
Загружает данные игрока из локального хранилища.

#### `Future<void> loadQuest(void Function(Map<String, dynamic>) callback, int stepId)`
Загружает данные квеста для определенного ID шага.

- `callback`: Функция обратного вызова для обработки загруженных данных квеста.
- `stepId`: ID шага, который нужно загрузить.

#### `void showNextMessage()`
Отображает следующее сообщение из списка сообщений.

#### `void showMessage(String author, String content, [dynamic avatar = false])`
Отображает сообщение в окне чата.

- `author`: Автор сообщения.
- `content`: Содержимое сообщения.
- `avatar`: Аватар автора (необязательно).

#### `void increaseAttribute(String attribute)`
Увеличивает значение атрибута игрока.

- `attribute`: Название атрибута, который нужно увеличить.

#### `void decreaseAttribute(String attribute)`
Уменьшает значение атрибута игрока.

- `attribute`: Название атрибута, который нужно уменьшить.

#### `void updateAttributePoints()`
Обновляет отображение доступных очков атрибутов.

#### `void updateAttributeValue(String attribute)`
Обновляет отображение значения определенного атрибута.

- `attribute`: Название атрибута, который нужно обновить.

#### `void updateOptions(List<dynamic> options)`
Обновляет отображение доступных опций.

- `options`: Список объектов опций.

#### `void selectOption(dynamic option)`
Обрабатывает выбор опции.

- `option`: Выбранная опция.

#### `bool shouldShowObject(dynamic object)`
Проверяет, должен ли объект (опция или сообщение) быть показан на основе условий.

- `object`: Проверяемый объект.

#### `Widget createOptionElement(dynamic option)`
Создает виджет Flutter для опции.

- `option`: Объект опции.

#### `void executeStep(int stepId)`
Выполняет шаг квеста.

- `stepId`: ID шага, который нужно выполнить.

#### `void updateLocationImage(String imageUrl)`
Обновляет изображение локации.

- `imageUrl`: URL изображения.

#### `bool checkRequirements(Map<String, dynamic> requirements)`
Проверяет, соответствует ли игрок требованиям опции.

- `requirements`: Требования для опции.

#### `void clearMessage()`
Очищает окно чата.

#### `void clearOptions()`
Очищает список опций.

#### `void savePlayerData()`
Сохраняет данные игрока в локальное хранилище.

#### `void showGameSection()`
Отображает раздел игры и скрывает раздел создания персонажа.

#### `Widget build(BuildContext context)`
Создает интерфейс Flutter для приложения.