export class Quest {
    constructor(id, name, description, type, status = 'not started') {
      this.id = id;
      this.name = name;
      this.description = description;
      this.type = type; // Основной, побочный и т.д.
      this.status = status; // Не начат, в процессе, завершен и т.д.
    }
  
    updateStatus(newStatus) {
      this.status = newStatus;
    }
  }