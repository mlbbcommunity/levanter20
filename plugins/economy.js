const fs = require('fs');
const path = require('path');

class Economy {
  constructor() {
    this.filePath = path.join(__dirname, 'economy.json');
    this.data = this.loadData();
  }

  loadData() {
    if (fs.existsSync(this.filePath)) {
      return JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
    } else {
      return {};
    }
  }

  saveData() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf8');
  }

  getUserData(userId) {
    if (!this.data[userId]) {
      this.data[userId] = { balance: 0 };
    }
    return this.data[userId];
  }

  getBalance(userId) {
    return this.getUserData(userId).balance;
  }

  earn(userId, amount) {
    this.getUserData(userId).balance += amount;
    this.saveData();
  }

  spend(userId, amount) {
    if (this.getUserData(userId).balance >= amount) {
      this.getUserData(userId).balance -= amount;
      this.saveData();
      return true;
    } else {
      return false;
    }
  }
}

const economy = new Economy();

module.exports = {
  name: 'economy',
  description: 'Economy plugin for earning and spending currency',
  commands: {
    balance: {
      description: 'Check your balance',
      execute: (message, args) => {
        const balance = economy.getBalance(message.sender);
        message.reply(`Your balance is ${balance} coins.`);
      },
    },
    earn: {
      description: 'Earn some coins',
      execute: (message, args) => {
        const amount = parseInt(args[0], 10) || 10;
        economy.earn(message.sender, amount);
        message.reply(`You earned ${amount} coins.`);
      },
    },
    spend: {
      description: 'Spend some coins',
      execute: (message, args) => {
        const amount = parseInt(args[0], 10);
        if (economy.spend(message.sender, amount)) {
          message.reply(`You spent ${amount} coins.`);
        } else {
          message.reply('Insufficient balance.');
        }
      },
    },
  },
};
