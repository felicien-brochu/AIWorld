import map from './map206.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level206-messages-${language}.json`)
}

const winCondition = {
  beforeStart(world) {
    this.markers = world.configObjects.filter(o => o.type === 'marker')
  },

  check(world) {
    return world.eggs.every(egg => {
        return !egg.owner && this.markers.find(marker => marker.x === egg.x && marker.y === egg.y)
      }) &&
      world.heroes.every(hero => hero.y === 13)
  }
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 300,
  speedTarget: 48,
  lengthTarget: 8,
  deterministic: true,

  compilerConfig: {
    excludePrimary: ['clone'],
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['hero', 'egg', 'nothing'],
    actionFunctions: ['step_once', 'take', 'drop'],
    valueFunctions: ['set', 'calc'],
    variables: 1,
    leftComparisonExpressions: ['direction', 'myitem', 'variable'],
    rightComparisonExpressions: ['object_type', 'terrain_type', 'integer', 'myitem', 'variable']
  },

  ruleset: {
    win: [winCondition],
    lose: 'default_loss'
  },
}

export default level