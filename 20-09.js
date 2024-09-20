function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(deepClone);
    }

    const clonedObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            clonedObj[key] = deepClone(obj[key]);
        }
    }
    return clonedObj;
}

const original = {
    name: 'Vlad',
    address: {
        city: 'Sukhum',
        country: 'Abkhazia'
    }
};

const clone = deepClone(original);
console.log(clone);

class Payment {
    constructor(amount) {
        this.amount = amount;
    }

    processPayment() {
        throw new Error('Метод processPayment должен быть реализован в подклассе!');
    }
}

class CreditCardPayment extends Payment {
    constructor(amount, cardNumber) {
        super(amount);
        this.cardNumber = cardNumber;
    }

    processPayment() {
        console.log(`Оплата ${this.amount} с помощью кредитной карты ${this.cardNumber}`);
    }
}

class PayPalPayment extends Payment {
    constructor(amount, email) {
        super(amount);
        this.email = email;
    }

    processPayment() {
        console.log(`Оплата ${this.amount} с помощью PayPal на аккаунт ${this.email}`);
    }
}

class CryptoPayment extends Payment {
    constructor(amount, walletAddress) {
        super(amount);
        this.walletAddress = walletAddress;
    }

    processPayment() {
        console.log(`Оплата ${this.amount} с помощью криптовалюты на кошелек ${this.walletAddress}`);
    }
}

const creditCardPayment = new CreditCardPayment(100, '1234-5678-9012-3456');
creditCardPayment.processPayment();

const payPalPayment = new PayPalPayment(200, 'argun@argun.com');
payPalPayment.processPayment();

const cryptoPayment = new CryptoPayment(300, '1A2b3C4d5E6f7G8H9I0J');
cryptoPayment.processPayment();
