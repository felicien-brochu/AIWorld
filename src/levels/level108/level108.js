import map from './map108.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level108-messages-${language}.json`)
}

const winCondition = {
  beforeStart(world) {
    const eggOriginMarkerID = 99
    const originMarker = world.findConfigObjectByID(eggOriginMarkerID)
    this.eggs = []
    for (let x = originMarker.x; x < originMarker.x + 10; x++) {
      let columnEggs = world.eggs.filter(egg => egg.x === x).sort((a, b) => a.y - b.y).map(egg => egg.id)
      this.eggs.push(columnEggs)
    }
  },

  check(world) {
    const eggOriginMarkerID = 99
    const originMarker = world.findConfigObjectByID(eggOriginMarkerID)
    for (let i = 0; i < 10; i++) {
      let columnEggs = world.eggs.filter(egg => egg.x === i + originMarker.x && !egg.owner).sort((a, b) => a.y - b.y)

      if (columnEggs.length !== this.eggs[i].length) {
        return false
      }

      if (columnEggs[columnEggs.length - 1].y !== originMarker.y + 9) {
        return false
      }

      for (let j = 0; j < columnEggs.length; j++) {
        if (columnEggs[j].id !== this.eggs[i][j]) {
          return false
        }
      }

      for (let j = 0; j < columnEggs.length - 1; j++) {
        if (columnEggs[j + 1].y - columnEggs[j].y !== 1) {
          return false
        }
      }
    }
    return true
  },
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 1000,
  speedTarget: 132,
  lengthTarget: 9,

  compilerConfig: {
    excludePrimary: ['assign', 'clone'],
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['egg', 'hero', 'nothing'],
    actionFunctions: ['step', 'take', 'drop'],
    leftComparisonExpressions: ['direction', 'myitem'],
    rightComparisonExpressions: ['object_type', 'terrain_type']
  },

  ruleset: {
    win: [winCondition],
    lose: ['default_loss']
  },

  worldGenerator: [{
    type: 'eggs_matrix',
    config: {
      originMarkerID: 99,
      width: 10,
      height: 10,

      strategy: {
        type: 'random_columns',
        minEggs: 1,
        maxEggs: 5,
        eggConfig: {
          value: 'rng(0,9)',
        }
      }
    }
  }]
}

export default level