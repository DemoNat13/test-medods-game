<template>
  <div>
    <h1 class="simon__title">
      Simon the Game
    </h1>
    <div class="simon__main">
      <div class="simon__message">
        <span v-if="gameMessage">
          {{ gameMessage }}
        </span>
      </div>
      <div class="simon__circle">
        <div
          class="sircle__quarter quarter_green"
          @click="btnPushed(1)"
          @KeyDown="btnPushed(1)"
          :class="{bright : isBright[1]}"
        />
        <div
          class="sircle__quarter quarter_red"
          @click="btnPushed(2)"
          @KeyDown="btnPushed(2)"
          :class="{bright : isBright[2]}"
        />
        <div
          class="sircle__quarter quarter_yellow"
          @click="btnPushed(3)"
          @KeyDown="btnPushed(3)"
          :class="{bright : isBright[3]}"
        />
        <div
          class="sircle__quarter quarter_blue"
          @click="btnPushed(4)"
          @KeyDown="btnPushed(4)"
          :class="{bright : isBright[4]}"
        />
      </div>

      <div class="simon__tools">
        <button class="tools__button" @click="clickStart">
          {{ buttonText }}
        </button>
        <div class="tools__round">
          Раунд: {{ turnCounter }}
        </div>
        <div>
          <ul class="tools__levels">
            <li
              v-for="level in levels"
              :key="level.label"
            >
              <label :for="level.id">
                <input
                  v-model="chosenLevel"
                  type="radio"
                  :value="level.timer"
                  :name="level.name"
                  :id="level.id"
                >
                {{ level.label }}
              </label>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SimonGame',
  data: () => ({
    buttonText: 'Начать',
    turnCounter: 0,
    gameMessage: '',
    canClick: false,
    startGame: false,
    winGame: false,
    hasMistake: false,
    gameOrder: [],
    playerOrder: [],
    orderGap: null,
    lightButton: 0,
    successTurn: true,
    gameTurn: true,
    gameInterval: 0,
    chosenLevel: 1500,
    levels: {
      easy: {
        id: 'easy',
        label: 'Лёгкий',
        name: 'level',
        timer: 1500,
      },
      normal: {
        id: 'normal',
        label: 'Средний',
        name: 'level',
        timer: 1000,
      },
      hard: {
        id: 'hard',
        label: 'Сложный',
        name: 'level',
        timer: 400,
      },
    },
    isBright: {
      1: false,
      2: false,
      3: false,
      4: false,
    },
  }),
  methods: {
    clickStart() {
      this.gameMessage = '';
      this.buttonText = 'Начать';
      this.startGame = true;
      this.gameOrder = [];
      this.playerOrder = [];
      this.hasMistake = false;
      this.winGame = false;
      this.turnCounter = 1;
      clearInterval(this.orderGap);
      this.showOrder();
    },
    btnPushed(button) {
      this.buttonText = 'Сбросить';
      if (this.canClick) {
        this.playSound(button);
        this.btnBright(button);
        this.playerOrder.push(button);
        this.checkOrder();
      }
    },
    // eslint-disable-next-line
    checkOrder() {
      for (let i = 0; i < this.playerOrder.length; i += 1) {
        if (this.playerOrder[i] !== this.gameOrder[i]) {
          this.hasMistake = true;
          this.gameMessage = `Вы проиграли после ${this.turnCounter} раундов`;
          this.canClick = false;
          return setTimeout(() => {
            this.gameOrder = [];
            this.playerOrder = [];
            this.buttonText = 'Начать';
            this.turnCounter = 0;
          }, 1500);
        }
      }
      if (this.playerOrder.length === this.gameOrder.length) {
        this.playerOrder = [];
        this.turnCounter += 1;
        if (this.turnCounter === 15) {
          this.canClick = false;
          this.winGame = true;
          this.buttonText = 'Сыграть снова';
          this.gameMessage = 'Поздравляем с победой!';
        } else {
          this.showOrder();
        }
      }
    },
    btnBright(button) {
      this.isBright[button] = true;
      setTimeout(() => {
        this.isBright[button] = false;
      }, 500);
    },
    playSound(button) {
      // eslint-disable-next-line
      new Audio(require(`@/assets/sounds/sounds_${button}.mp3`)).play();
    },
    showOrder() {
      let index = 0;
      const interval = index === 0 ? this.chosenLevel + 300 : this.chosenLevel;
      this.canClick = false;
      this.gameOrder.push(Math.floor(Math.random() * 4 + 1));
      this.orderGap = setInterval(() => {
        if (index >= this.gameOrder.length) {
          clearInterval(this.orderGap);
          this.canClick = true;
          return;
        }
        this.playSound(this.gameOrder[index]);
        this.btnBright(this.gameOrder[index]);
        index += 1;
      }, interval);
    },
  },
};
</script>
