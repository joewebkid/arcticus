from flask import Flask, request
from flask_restful import Api, Resource
from mongoengine import connect

app = Flask(__name__)
api = Api(app)

# Подключение к MongoDB
connect('mydatabase')

class QuestResource(Resource):
    def get(self, quest_id):
        # Получение данных квеста по его id
        quest = Step.objects(id=quest_id).first()
        if quest:
            return quest.to_json()
        else:
            return {'message': 'Квест не найден'}, 404

class PlayerResource(Resource):
    def post(self):
        # Сохранение данных пользователя
        player_data = request.get_json()
        player = Player(**player_data)
        player.save()
        return {'message': 'Данные пользователя сохранены'}

    def get(self):
        # Получение данных пользователя
        players = Player.objects()
        return players.to_json()

api.add_resource(QuestResource, '/quests/<int:quest_id>')
api.add_resource(PlayerResource, '/players')

if __name__ == '__main__':
    app.run()
