import Phaser from 'phaser'

import BootScene from './Boot'
import SplashScene from './Splash'
import GameScene from './Game'
import MouseWheelToUpDownPlugin from 'phaser3-rex-plugins/plugins/mousewheeltoupdown-plugin.js';


export default {
  width: document.documentElement.clientWidth,
  height: document.documentElement.clientHeight,
  mode: Phaser.Scale.NO_SCALE,
  zoom: 1,
  resolution: 1,
  type: Phaser.AUTO,
  parent: 'world-content',
  localStorageName: 'aiworld',
  plugins: {
    global: [{
      key: 'rexMouseWheelToUpDown',
      plugin: MouseWheelToUpDownPlugin,
      start: true
    }]
  },
  scene: [BootScene, SplashScene, GameScene]
}