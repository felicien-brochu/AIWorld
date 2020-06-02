import map from './map301.json'
import supportedLanguages from '../../locale/supportedLanguages'

const messages = {}
for (let language of supportedLanguages) {
  messages[language] = require(`./level301-messages-${language}.json`)
}

const level = {
  mapConfig: map,
  messages: messages,

  maxStep: 200,
  speedTarget: 32,
  lengthTarget: 6,
  deterministic: true,

  compilerConfig: {
    excludePrimary: ['clone'],
    terrainTypes: ['floor', 'wall', 'hole'],
    objectTypes: ['switch', 'spikes'],
    actionFunctions: ['step', 'tell', 'listen'],
    valueFunctions: [],
    variables: 0,
    messages: 8,
    leftComparisonExpressions: ['direction'],
    rightComparisonExpressions: ['terrain_type', 'object_type'],
    forbiddenExpressions: ['everyone']
  },

  ruleset: {
    win: ['all_switches'],
    lose: ['one_hero_dead', 'or', 'default_loss']
  },
}

export default level