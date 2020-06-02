import map from './map305.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level305-messages-${language}.json`)
}

const winCondition = {
  beforeStart(world) {
    this.masterEgg = world.eggs.find(egg => egg.id === 316).shallowCopy()
    this.selectedEggs = world.eggs
      .filter(egg => egg.value % 2 === this.masterEgg.value % 2 && egg.id !== this.masterEgg.id)
      .map(egg => egg.id)
  },

  check(world) {
    return this.selectedEggs.every(eggID => world.cauldrons.some(cauldron => cauldron.items.some(item => item.id === eggID)))
  },
}

const wrongEggInCauldronLossCondition = {
  beforeStart(world) {
    this.masterEgg = world.eggs.find(egg => egg.id === 316).shallowCopy()
    this.selectedEggs = world.eggs
      .filter(egg => egg.value % 2 === this.masterEgg.value % 2 && egg.id !== this.masterEgg.id)
      .map(egg => egg.id)
  },

  check(world) {
    return world.cauldrons.some(cauldron => cauldron.items.some(item => this.selectedEggs.every(eggID => item.id !== eggID)))
  },

  getReason(world) {
    if (this.masterEgg.value % 2 === 0) {
      return 'loss_reason_wrong_egg_in_cauldron_even'
    } else {
      return 'loss_reason_wrong_egg_in_cauldron_odd'
    }
  }
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 40,
  speedTarget: 5,
  lengthTarget: 10,

  compilerConfig: {
    excludePrimary: ['clone'],
    terrainTypes: ['floor', 'wall'],
    objectTypes: ['cauldron'],
    actionFunctions: ['drop', 'tell', 'listen'],
    valueFunctions: ['set', 'calc'],
    variables: 1,
    messages: 8,
    leftComparisonExpressions: ['direction', 'myitem', 'variable'],
    rightComparisonExpressions: ['terrain_type', 'object_type', 'integer'],
  },

  ruleset: {
    win: [winCondition],
    lose: [wrongEggInCauldronLossCondition, 'or', 'default_loss']
  },
}

export default level