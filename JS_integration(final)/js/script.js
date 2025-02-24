// scroll (for navigation)
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  section.scrollIntoView({ behavior: 'smooth' });
}

// CAT MOOD GENERATOR
function playCatSound() {
  const moods = [
    { sound: 'https://www.myinstants.com/media/sounds/cat-meow.mp3', message: 'Ņau! Kaķis saka: "Spēlēsimies ar dziju!"' },
    { sound: 'https://www.myinstants.com/media/sounds/cat-purr.mp3', message: 'Murr! Kaķis ir laimīgs un murrā tev!' },
    { sound: 'https://www.myinstants.com/media/sounds/angry-cat.mp3', message: 'Ņauuurr! Kaķis ir mazliet īgns šodien!' }
  ];
  const randomMood = moods[Math.floor(Math.random() * moods.length)];
  const audio = new Audio(randomMood.sound);
  audio.play();
  document.getElementById('message').innerText = randomMood.message;
  document.querySelector('#mySection .cat-img').src = `https://cataas.com/cat/says/${randomMood.message.split(' ')[0]}`;
}

// Cat Fact 
let facts = [];
let currentFactIndex = 0;

async function loadFacts() {
  try {
    const response = await fetch('https://catfact.ninja/facts?limit=5');
    const data = await response.json();
    facts = data.data.map(item => item.fact);
    document.getElementById('catFactText').innerText = facts[0];
  } catch (error) {
    document.getElementById('catFactText').innerText = 'Kaķis paslēpa faktus!';
    console.error('Error fetching facts:', error);
  }
}

function changeFact(direction) {
  currentFactIndex = (currentFactIndex + direction + facts.length) % facts.length;
  document.getElementById('catFactText').innerText = facts[currentFactIndex];
}

loadFacts();


window.addEventListener('scroll', () => {
  const threadBall = document.querySelector('.thread-ball');
  const scrollPos = window.scrollY;
  threadBall.style.transform = `translateY(${scrollPos * 0.2}px) rotate(${scrollPos * 2}deg)`;
});

// Purring Audio
let purrAudio = new Audio('https://www.myinstants.com/media/sounds/cat-purr.mp3');
purrAudio.loop = true;
let isPurring = false;

function togglePurr() {
  if (!isPurring) {
    purrAudio.play();
    document.getElementById('purrToggle').innerText = 'Izslēgt Murrāšanu';
    isPurring = true;
  } else {
    purrAudio.pause();
    document.getElementById('purrToggle').innerText = 'Ieslēgt Murrāšanu';
    isPurring = false;
  }
}

// Cat Quiz
const quizQuestions = [
  { question: 'Cik stundas dienā kaķi parasti guļ?', options: ['8-10', '12-16', '20-22'], answer: '12-16' },
  { question: 'Kura šķirne ir pazīstama ar savu bezspalvainību?', options: ['Sfinksa', 'Maine Coon', 'Persiešu'], answer: 'Sfinksa' },
  { question: 'Kā sauc kaķu grupu?', options: ['Bars', 'Klaudrs', 'Ģimene'], answer: 'Klaudrs' }
];

function loadQuiz() {
  const container = document.getElementById('quizContainer');
  quizQuestions.forEach((q, index) => {
    const div = document.createElement('div');
    div.className = 'quiz-question';
    div.innerHTML = `
      <p>${q.question}</p>
      ${q.options.map(opt => `
        <label><input type="radio" name="q${index}" value="${opt}"> ${opt}</label>
      `).join('')}
    `;
    container.appendChild(div);
  });
}

function submitQuiz() {
  let score = 0;
  quizQuestions.forEach((q, index) => {
    const selected = document.querySelector(`input[name="q${index}"]:checked`);
    if (selected && selected.value === q.answer) score++;
  });
  const result = document.getElementById('quizResult');
  const level = score === 3 ? 'Kaķu meistars!' : score === 2 ? 'Kaķu draugs!' : 'Kaķu iesācējs!';
  result.innerText = `Tu ieguvi ${score} no 3! Tavs līmenis: ${level}`;
}

loadQuiz();

// Cat Breeds 
async function loadBreeds() {
  try {
    const response = await fetch('https://api.thecatapi.com/v1/breeds');
    const breeds = await response.json();
    const select = document.getElementById('breedSelect');
    breeds.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching breeds:', error);
  }
}

async function showBreedInfo() {
  const select = document.getElementById('breedSelect');
  const breedId = select.value;
  if (!breedId) return;

  try {
    const response = await fetch(`https://api.thecatapi.com/v1/breeds/${breedId}`);
    const breed = await response.json();
    document.getElementById('breedDescription').innerText = breed.description || 'Nav apraksta.';
    const imageResponse = await fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`);
    const imageData = await imageResponse.json();
    const img = document.getElementById('breedImage');
    img.src = imageData[0]?.url || 'https://cataas.com/cat';
    img.style.display = 'block';
  } catch (error) {
    console.error('Error fetching breed info:', error);
  }
}

loadBreeds();


class TreasureGame {
  constructor() {
    this.grid = document.getElementById('gameArea');
    this.movesLeftElement = document.getElementById('movesLeft');
    this.treasuresFoundElement = document.getElementById('treasuresFound');
    this.resultElement = document.getElementById('gameResult');
    this.happyCat = document.getElementById('happyCat');
    this.gridSize = 5;
    this.totalMoves = 15;
    this.totalTreasures = 5;
    this.movesLeft = this.totalMoves;
    this.treasuresFound = 0;
    this.treasurePositions = [];
  }

  start() {
    this.movesLeft = this.totalMoves;
    this.treasuresFound = 0;
    this.treasurePositions = [];
    this.grid.innerHTML = '';
    this.updateMoves();
    this.updateTreasures();
    this.resultElement.innerText = '';
    this.happyCat.style.display = 'none';

    while (this.treasurePositions.length < this.totalTreasures) {
      const pos = Math.floor(Math.random() * this.gridSize * this.gridSize);
      if (!this.treasurePositions.includes(pos)) this.treasurePositions.push(pos);
    }

    for (let i = 0; i < this.gridSize * this.gridSize; i++) {
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.dataset.index = i;
      tile.addEventListener('click', () => this.revealTile(i));
      this.grid.appendChild(tile);
    }
  }

  revealTile(index) {
    if (this.movesLeft <= 0 || this.treasuresFound === this.totalTreasures) return;

    const tile = this.grid.children[index];
    if (tile.classList.contains('revealed')) return;

    this.movesLeft--;
    tile.classList.add('revealed');

    if (this.treasurePositions.includes(index)) {
      tile.innerText = '💎';
      this.treasuresFound++;
      this.updateTreasures();
    } else {
      tile.innerText = '😿';
    }

    this.updateMoves();
    this.checkGameEnd();
  }

  updateMoves() {
    this.movesLeftElement.innerText = `Atlikušie gājieni: ${this.movesLeft}`;
  }

  updateTreasures() {
    this.treasuresFoundElement.innerText = `Atrastie dārgumi: ${this.treasuresFound}`;
  }

  checkGameEnd() {
    if (this.movesLeft <= 0 || this.treasuresFound === this.totalTreasures) {
      const message = this.treasuresFound === this.totalTreasures
        ? 'Apsveicu! Tu atradi visus dārgumus!'
        : `Spēle beigusies! Atrasti ${this.treasuresFound} no ${this.totalTreasures} dārgumiem.`;
      this.resultElement.innerText = message;
      this.happyCat.style.display = this.treasuresFound === this.totalTreasures ? 'block' : 'none';
    }
  }
}

const treasureGame = new TreasureGame();

function startTreasureGame() {
  treasureGame.start();
}

class SlotGame {
  constructor() {
    this.coinsElement = document.getElementById('catCoins');
    this.resultElement = document.getElementById('slotResult');
    this.slotCat = document.getElementById('slotCat');
    this.reels = [
      document.getElementById('reel1').querySelector('span'),
      document.getElementById('reel2').querySelector('span'),
      document.getElementById('reel3').querySelector('span')
    ];
    this.coins = 100;
    this.symbols = ['🐾', '🐱', '💎', '🍤', '🧀'];
    this.isSpinning = false;
  }

  spin() {
    if (this.isSpinning) return;

    const betAmount = parseInt(document.getElementById('betAmount').value);

    if (isNaN(betAmount) || betAmount <= 0 || betAmount > this.coins) {
      this.resultElement.innerText = 'Nepareiza likme! Ievadi derīgu summu.';
      return;
    }

    this.coins -= betAmount;
    this.updateCoins();
    this.isSpinning = true;
    this.resultElement.innerText = 'Griežas sloti...';
    this.slotCat.style.display = 'none';

    this.reels.forEach(reel => reel.parentElement.classList.add('spinning'));

    const result = this.symbols.map(() => this.symbols[Math.floor(Math.random() * this.symbols.length)]);

    setTimeout(() => this.stopReel(0, result[0]), 1500);
    setTimeout(() => this.stopReel(1, result[1]), 2000);
    setTimeout(() => this.stopReel(2, result[2], true), 2500);
  }

  instantWin() {
    if (this.isSpinning) return;

    const instantBet = 50; // instant win

    if (this.coins < instantBet) {
      this.resultElement.innerText = 'Nepietiek monētu! Tev vajag 50 kaķu monētas.';
      return;
    }

    this.coins -= instantBet;
    this.updateCoins();
    this.isSpinning = true;
    this.resultElement.innerText = 'Griežas sloti... Tūlītēja uzvara!';
    this.slotCat.style.display = 'none';

    this.reels.forEach(reel => reel.parentElement.classList.add('spinning'));

    // two matching
    const isJackpot = Math.random() < 0.5;
    const winningSymbol = this.symbols[Math.floor(Math.random() * this.symbols.length)];
    const result = isJackpot
      ? [winningSymbol, winningSymbol, winningSymbol]
      : [
          winningSymbol,
          winningSymbol,
          this.symbols[Math.floor(Math.random() * (this.symbols.length - 1))] // third is different
        ];

    setTimeout(() => this.stopReel(0, result[0]), 1500);
    setTimeout(() => this.stopReel(1, result[1]), 2000);
    setTimeout(() => this.stopReel(2, result[2], true, instantBet), 2500);
  }

  stopReel(index, symbol, isLast = false, instantBet = null) {
    const reel = this.reels[index];
    reel.parentElement.classList.remove('spinning');
    reel.innerText = symbol;

    if (isLast) {
      const result = this.reels.map(r => r.innerText);
      const betAmount = instantBet || parseInt(document.getElementById('betAmount').value);

      if (result[0] === result[1] && result[1] === result[2]) {
        const winnings = betAmount * 5; // 5x multiplier
        this.coins += winnings;
        this.resultElement.innerText = `Džekpots! Trīs "${result[0]}". Tu laimēji ${winnings} kaķu monētas!`;
        this.slotCat.src = 'https://cataas.com/cat/says/Jackpot';
      } else if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) {
        const winnings = betAmount * 2; // 2x multiplier
        this.coins += winnings;
        this.resultElement.innerText = `Uzvara! Divi vienādi. Tu laimēji ${winnings} kaķu monētas!`;
        this.slotCat.src = 'https://cataas.com/cat/says/Win';
      } else {
        this.resultElement.innerText = `Zaudējums! Nekādu sakritību. Tu zaudēji ${betAmount} kaķu monētas.`;
        this.slotCat.src = 'https://cataas.com/cat/says/Lose';
      }

      this.slotCat.style.display = 'block';
      this.updateCoins();

      if (this.coins <= 0) {
        this.resultElement.innerText += ' Tu esi bankrotējis! Sāc no jauna ar 100 monētām.';
        this.coins = 100;
        this.updateCoins();
      }

      this.isSpinning = false;
    }
  }

  updateCoins() {
    this.coinsElement.innerText = `Kaķu monētas: ${this.coins}`;
  }
}

const slotGame = new SlotGame();

function spinSlots() {
  slotGame.spin();
}

// INSTANT WIN
/* FOR TEST
function instantWin() {
  slotGame.instantWin();
}
*/ 