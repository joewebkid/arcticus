// questController.js

export class QuestController {

    constructor(questData) {
      this.quest = new Quest(questData);
      this.currentStep = 0;
    }
  
    startQuest() {
      // Начать квест
      this.showCurrentStep();  
    }
  
    showCurrentStep() {
      // Показать текущий шаг квеста  
      const step = this.quest.getStep(this.currentStep);
      
      // Обновить UI
      uiController.showLocation(step.location);
      uiController.showDialog(step.dialog);
      uiController.updateChoices(step.choices);
    }
  
    makeChoice(choiceId) {
      // Обработать выбор варианта
      const nextStep = this.quest.getNextStep(this.currentStep, choiceId);
      
      if (nextStep) {
        // Если есть следующий шаг
        this.currentStep = nextStep;
        this.showCurrentStep();
      } else {
        // Иначе квест завершен
        uiController.showQuestComplete(); 
      }
    }
  
    isCompleted() {
      // Проверить, завершен ли квест
      return this.currentStep >= this.quest.steps.length;
    }
  
  }
  
  
  // Использование
  
  const quest = loadQuestData(); 
  const controller = new QuestController(quest);
  
  controller.startQuest();
  
  // Делаем выбор
  controller.makeChoice(choiceId);
  
  // Проверка завершения
  if (controller.isCompleted()) {
    // Квест пройден
  }