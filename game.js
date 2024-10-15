const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let player = {
    name: 'Исследователь',
    health: 100,
    inventory: [],
    location: 'start'
};

let messageBuffer = [];

const locations = {
    start: {
        name: 'Начальная деревня',
        description: 'Тихая деревня, окруженная густым лесом.',
        choices: [
            { text: 'Пойти в лес', nextLocation: 'forest' },
            { text: 'Заглянуть на рынок', nextLocation: 'market' },
            { text: 'Пойти в горы', nextLocation: 'mountains' },
        ]
    },
    forest: {
        name: 'Темный лес',
        description: 'Опасный лес, полный загадок и сокровищ.',
        choices: [
            { text: 'Искать ягоды', event: 'findBerries' },
            { text: 'Углубиться в лес', nextLocation: 'deepForest' },
            { text: 'Вернуться в деревню', nextLocation: 'start' }
        ]
    },
    market: {
        name: 'Рынок',
        description: 'Оживленное место, где можно купить и продать товары.',
        choices: [
            { text: 'Купить зелье здоровья', event: 'buyHealthPotion' },
            { text: 'Вернуться в деревню', nextLocation: 'start' }
        ]
    },
    deepForest: {
        name: 'Глубокий лес',
        description: 'Густой лес, где обитают загадочные существа.',
        choices: [
            { text: 'Сразиться с монстром', event: 'fightMonster' },
            { text: 'Вернуться в лес', nextLocation: 'forest' }
        ]
    },
    mountains: {
        name: 'Горы',
        description: 'Высокие и заснеженные горы, полные древних тайн.',
        choices: [
            { text: 'Искать пещеры', event: 'findCaves' },
            { text: 'Вернуться в деревню', nextLocation: 'start' }
        ]
    }
};

function findBerries() {
    return new Promise(resolve => {
        setTimeout(() => {
            messageBuffer.push('Вы нашли ягоды и восстановили 10 очков здоровья.');
            player.health += 10;
            resolve();
        }, 2000);
    });
}

function buyHealthPotion() {
    return new Promise(resolve => {
        setTimeout(() => {
            messageBuffer.push('Вы купили зелье здоровья и добавили его в инвентарь.');
            player.inventory.push('Зелье здоровья');
            resolve();
        }, 1000);
    });
}

function fightMonster() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const outcome = Math.random() > 0.75 ? 'win' : 'lose';
            if (outcome === 'win') {
                messageBuffer.push('Вы победили монстра и получили сокровище!');
                player.inventory.push('Сокровище');
                resolve();
            } else {
                messageBuffer.push('Вы проиграли сражение и потеряли 50 очков здоровья.');
                player.health -= 50;
                if (player.health <= 0) {
                    reject('Поражение: вы потеряли все здоровье.');
                } else {
                    resolve();
                }
            }
        }, 3000);
    });
}


function findCaves() {
    return new Promise(resolve => {
        setTimeout(() => {
            const outcome = Math.random() > 0.75 ? 'win' : 'lose';
            if (outcome === 'win') {
                messageBuffer.push('Вы нашли оружие: \'Потерянный меч\'.');
                player.inventory.push('Потерянный меч');
            } else {
                messageBuffer.push('Вы нашли древние пещеры, но они оказались пустыми.');
            }
            resolve();
        }, 1500);
    });
}


async function playGame() {
    try {
        while (true) {
            clearConsole();
            showPlayerStats();
            displayMessages();
            const location = locations[player.location];
            console.log(`Вы находитесь в локации: ${location.name}`);
            console.log(location.description);

            location.choices.forEach((choice, index) => {
                console.log(`${index + 1}. ${choice.text}`);
            });
            console.log('0. Выйти из игры');

            const choiceIndex = await getPlayerChoice(location.choices.length);
            if (choiceIndex === 0) {
                if (await confirmExit()) {
                    console.log('Вы вышли из игры.');
                    process.exit();
                }
                continue;
            }
            const choice = location.choices[choiceIndex - 1];
            if (choice.nextLocation) {
                player.location = choice.nextLocation;
            } else if (choice.event) {
                await handleEvent(choice.event);
            }

            if (player.inventory.includes('Сокровище')) {
                console.log('Поздравляем! Вы нашли сокровище и успешно завершили путешествие.');
                process.exit();
                break;
            }
        }
    } catch (error) {
        console.log(error);
        process.exit();
    }
}

function getPlayerChoice(maxChoices) {
    return new Promise(resolve => {
        rl.question('Сделайте выбор: ', (input) => {
            const choice = parseInt(input.trim(), 10);
            if (choice >= 0 && choice <= maxChoices) {
                resolve(choice);
            } else {
                console.log('Неверный выбор, попробуйте снова.');
                resolve(getPlayerChoice(maxChoices));
            }
        });
    });
}

function confirmExit() {
    return new Promise(resolve => {
        rl.question('Вы уверены, что хотите выйти? Весь прогресс будет утерян. (y/n): ', (input) => {
            if (input.toLowerCase() === 'y') {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

async function handleEvent(eventName) {
    switch (eventName) {
        case 'findBerries':
            await findBerries();
            break;
        case 'buyHealthPotion':
            await buyHealthPotion();
            break;
        case 'fightMonster':
            await fightMonster();
            break;
        case 'findCaves':
            await findCaves();
            break;
        default:
            messageBuffer.push('Неизвестное событие.');
    }
}

function showPlayerStats() {
    console.log(`Имя: ${player.name}`);
    console.log(`Здоровье: ${player.health}`);
    console.log(`Инвентарь: ${player.inventory.join(', ') || 'пусто'}`);
}

function clearConsole() {
    process.stdout.write('\x1Bc');
}

function displayMessages() {
    if (messageBuffer.length > 0) {
        console.log('\n\t\t\t\tСообщение');
        messageBuffer.forEach(msg => console.log("\t| " + msg + " |"));
        messageBuffer = [];
    }
}

console.log('Добро пожаловать в игру "Мир путешествий"!');
playGame();
