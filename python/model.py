from mongoengine import Document, StringField, IntField, ListField, EmbeddedDocument, EmbeddedDocumentField

class Player(Document):
    name = StringField(required=True)
    health = IntField(default=100)
    attributePoints = IntField(default=15)
    strength = IntField(default=5)
    agility = IntField(default=5)
    intelligence = IntField(default=5)
    charisma = IntField(default=5)
    inventory = ListField()
    currentStep = IntField(default=0)
    visitedSteps = ListField()
    encounteredCharacters = ListField()

class Option(EmbeddedDocument):
    id = StringField(required=True)
    text = StringField(required=True)
    nextStep = IntField()
    result = EmbeddedDocumentField('Result')
    requirements = EmbeddedDocumentField('Requirements')

class Result(EmbeddedDocument):
    messages = ListField()
    options = ListField(EmbeddedDocumentField(Option))
    item = StringField()

class Requirements(EmbeddedDocument):
    step = ListField()
    item = StringField()
    characters = ListField()

class Step(Document):
    id = IntField(required=True)
    messages = ListField()
    item = StringField()
    character = StringField()
    location = StringField()
    options = ListField(EmbeddedDocumentField(Option))

class GameData(Document):
    player = EmbeddedDocumentField(Player)
    steps = ListField(EmbeddedDocumentField(Step))
    currentStep = IntField(default=0)
