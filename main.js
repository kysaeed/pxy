
const Constants = {
  Screen: {
    Width: 800,
    Height: 480,
  },
}

const scene = {
  preload() {
    this.load.image('board', './board.png');
    this.load.image('card_a', './card_a.png');
    this.load.image('card_b', './card_b.png');

  },


  create() {

    // 回転用の親コンテナ すべての表示要素をこのコンテナにいれる
    this.anchor = this.add.container(0, 0)
    this.anchor.angle = 0


    // 背景画像
    let board = this.add.image(0, 0, 'board')
    board.setPosition(board.width / 2, board.height / 2)
    this.anchor.add(board)


    let text = this.add.text(10, 10, '画面回転のデモ')
      .setFontSize(48)
      .setColor('#0a0a0a')
      .setPadding(0, 4, 0, 4)
    this.anchor.add(text)

    let cardB = this.add.image(400, 200, 'card_b')
    this.anchor.add(cardB)

    let cardA = this.add.image(400, 360, 'card_a')
    this.anchor.add(cardA)

    cardB.scale = 0.5
    cardA.scale = 0.5

    cardA.setInteractive()
    cardA.on('pointerdown', (pointer) => {
      cardA.disableInteractive()

      this.tweens.chain({
        targets: cardA,
        tweens: [
          {
            scale: 1.0,
            y: 380,
            duration: 350,
            ease: 'power1',
          },
          {
            y: 260,
            duration: 50,
            ease: 'power1',
          },
          {
            y: 360,
            dely: 100,
            duration: 250,
            ease: 'power1',
          },

          {
            scale: 0.5,
            duration: 350,
            ease: 'power1',
          },
        ],
        onComplete: () => {
          cardA.setInteractive()
        }
      })

      this.tweens.chain({
        targets: cardB,
        tweens: [
          {
            scale: 1.0,
            y: 160,
            duration: 350,
            ease: 'power1',
          },
          {
            y: 10,
            angle: 30,
            delay: 100,
            duration: 100,
            ease: 'power1',
          },
          {
            scale: 0.5,
            angle: 0,
            y: 200,
            delay: 100,
            duration: 250,
            ease: 'power1',
          },
        ],
      })
    })

    const isVertical = () => {

      const game = window.game

      const w = game.scale.parentSize.width
      const h = game.scale.parentSize.height

      let isVertical = false
      if (w && h) {
        if (w < h) {
          isVertical = true
        }
      }

      return isVertical
    }

    const setRotateState = (isRotate) => {
      if (isRotate) {
        // [|] 縦長スクリーンに表示
        game.scale.displaySize.setAspectRatio( Constants.Screen.Height/Constants.Screen.Width );
        game.scale.resize(Constants.Screen.Height, Constants.Screen.Width)
        this.anchor.angle = 90
        this.anchor.x = Constants.Screen.Height
        game.scale.refresh()
      } else {
        // [--] 横長スクリーンに表示
        game.scale.displaySize.setAspectRatio( Constants.Screen.Width/Constants.Screen.Height );
        game.scale.resize(Constants.Screen.Width, Constants.Screen.Height)
        this.anchor.x = 0
        this.anchor.angle = 0
        game.scale.refresh()
      }
    }

    const fit = () => {
      /*
      // PCの場合は、ディレプレイの持ち方を変えないので回転しない
      if (game.device.os.desktop) {
        return
      }
      */
      setRotateState(isVertical())
    }

    let h
    const onResize = () => {

      if (h) {
        clearTimeout(h)
      }
      h = setTimeout(() => {
        fit()
      }, 100)
    }

    window.onresize = () => {
      onResize()
    }

    /*
    // 旧仕様互換
    window.onorientationchange = () => {
      onResize()
    }
    */

    screen.orientation.onchange = () => {
      onResize()
    }

    // 初期化
    fit()
  },

  update() {
    //
  },
}



import Phaser from 'phaser'
const config = {
  parent: 'app',
  autoCenter: Phaser.Scale.CENTER_BOTH,
  type: Phaser.AUTO,
  width: Constants.Screen.Width,
  height: Constants.Screen.Height,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'app',
    width: Constants.Screen.Width,
    height: Constants.Screen.Height
  },
  scene: scene,
};

window.game = new Phaser.Game(config);
