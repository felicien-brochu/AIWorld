import Map from './map/Map'

import ObjectType from './objects/ObjectType'
import CharacterDeathReason from './objects/CharacterDeathReason'
import Character from './objects/Character'
import Hero from './objects/Hero'
import Npc from './objects/Npc'
import Switch from './objects/Switch'
import Bonfire from './objects/Bonfire'
import Cauldron from './objects/Cauldron'
import Spikes from './objects/Spikes'
import Item from './objects/Item'
import Egg from './objects/Egg'
import Symbol from './objects/Symbol'
import AIConfig from './objects/AIConfig'
import PathConfig from './objects/PathConfig'
import Marker from './objects/Marker'
import TerrainType from './map/TerrainType'

import NpcAIFactory from './ai/NpcAIFactory'
import IdleAI from './ai/IdleAI'
import PathFinder from './ai/PathFinder'

import StepAction from './actions/StepAction'

import Direction from './Direction'
import EventLog from './EventLog'

import {
  namedObjectListToObject
} from './utils'


export default class World {
  constructor(level, aiFactory, rng) {
    this.level = level
    this.aiFactory = aiFactory
    this.rng = rng

    this.map = new Map(level.mapConfig)
    this.characters = []
    this.heroes = []
    this.npcs = []
    this.switches = []
    this.bonfires = []
    this.cauldrons = []
    this.spikes = []
    this.eggs = []

    this.symbols = []

    this.configObjects = []

    this.proxy = null

    this.parseObjects()
    this.ruleset = this.level.buildRuleset(this)
    this.level.generateWorld(this)
    this.initWorldObjects()

    this.speachChannels = []

    this.hasWon = false
    this.hasLost = false
    this.lossReason = null
    this.gameOver = false
    this.steps = 0

    this.ruleset.beforeStart()

    this.eventLog = new EventLog(this)
    this.eventLog.attachAll()
  }

  parseObjects() {
    let layers = namedObjectListToObject(this.level.mapConfig.layers)

    if (!layers.objects) {
      throw new Error("objects layer is missing from the map object: " + JSON.stringify(this.level.mapConfig))
    }

    for (var i = 0; i < layers.objects.objects.length; i++) {
      this.createObjectFromMapObject(layers.objects.objects[i])
    }
  }

  initWorldObjects() {
    // Item ownership + hero AIs
    for (let hero of this.heroes) {
      if (this.aiFactory) {
        hero.ai = this.aiFactory.buildAI(this, hero)
      }

      if (Number.isInteger(hero.item)) {
        let item = this.findWorldObjectByID(hero.item)
        hero.takeItem(item)
      }
    }

    // NPCs AIs
    for (let npc of this.npcs) {
      npc.ai = NpcAIFactory.buildAI(this, npc)
    }

    // Generate eggs values with rng if necessary
    for (let egg of this.eggs) {
      egg.initValue(this.rng)
    }

    // Init switch enable state
    for (let mySwitch of this.switches) {
      if (this.characters.some(character => character.overlaps(mySwitch) && !character.dead)) {
        mySwitch.enable()
      } else {
        mySwitch.disable()
      }
    }

    // Init spikes triggers
    for (let spikes of this.spikes) {
      spikes.initTriggers(this)
      spikes.checkTriggers()
    }
  }

  createObjectFromMapObject(config) {
    let objectConfig = {
      id: config.id,
      name: config.name,
      x: Math.floor(config.x / this.level.mapConfig.tilewidth),
      y: Math.floor(config.y / this.level.mapConfig.tileheight),
    }

    if (config.properties) {
      for (let property of config.properties) {
        objectConfig[property.name] = property.value
      }
    }

    if (config.type === 'path') {
      const pointMap = point => ({
        x: Math.floor((config.x + point.x) / this.level.mapConfig.tilewidth),
        y: Math.floor((config.y + point.y) / this.level.mapConfig.tileheight)
      })
      if (config.polygon) {
        objectConfig.polygon = config.polygon.map(pointMap)
      } else if (config.polyline) {
        objectConfig.polyline = config.polyline.map(pointMap)
      }
    }

    this.createObject(config.type, objectConfig)
  }

  createObject(type, config) {
    if (!config.id) {
      config.id = this.getAvailableObjectID()
    }

    switch (type) {
      case 'hero':
        let hero = new Hero(config, this)
        this.heroes.push(hero)
        this.characters.push(hero)
        break
      case 'npc':
        let npc = new Npc(config, this)
        this.npcs.push(npc)
        this.characters.push(npc)
        break
      case 'switch':
        this.switches.push(new Switch(config))
        break
      case 'bonfire':
        this.bonfires.push(new Bonfire(config))
        break
      case 'cauldron':
        this.cauldrons.push(new Cauldron(config))
        break
      case 'spikes':
        this.spikes.push(new Spikes(config))
        break
      case 'egg':
        this.eggs.push(new Egg(config))
        break
      case 'symbol':
        this.symbols.push(new Symbol(config))
        break
      case 'ai':
        this.configObjects.push(new AIConfig(config))
        break
      case 'path':
        this.configObjects.push(new PathConfig(config, this))
        break
      case 'marker':
        this.configObjects.push(new Marker(config))
        break
    }

    return config.id
  }

  getAvailableObjectID() {
    return this.getAllObjects().reduce((max, object) => object.id > max ? object.id : max, 0) + 1
  }

  getCharactersSortedByPriority() {
    let characters = this.heroes.concat(this.npcs)

    function priorityScore(a) {
      return a.character.getStepPriority() * characters.length + a.index
    }

    let sortedCharacters = characters
      .map((character, index) => ({
        character: character,
        index: index,
      }))
      .sort((a, b) => priorityScore(a) - priorityScore(b))
      .map(a => a.character)

    return sortedCharacters
  }

  step() {
    this.steps++
    try {
      this.speachChannels = []

      let characterActions = []
      let characters = this.getCharactersSortedByPriority()
      for (let character of characters) {
        let action = character.step(this.rng)

        characterActions.push({
          character: character,
          action: action
        })
      }

      this.resolveCharacterActions(characterActions)
      this.resolveActionConsequences(characterActions)
    } catch (e) {
      console.error(e)
      this.pause()
    }

    this.ruleset.step()
    if (!this.gameOver) {
      if (this.ruleset.hasLost()) {
        this.declareLoss()
      } else if (this.ruleset.hasWon()) {
        this.declareWin()
      }
    }
  }

  resolveCharacterActions(characterActions) {
    this.resolveEatActions(characterActions)
    this.resolveStepActions(characterActions)
    this.resolveTakeActions(characterActions)
    this.resolveDropActions(characterActions)
    this.resolveWriteActions(characterActions)
    this.resolveCloneActions(characterActions)
    this.resolveFireBallActions(characterActions)
  }

  resolveEatActions(characterActions) {
    for (let {
        character,
        action
      } of characterActions) {
      if (action && action.type === 'EatAction') {
        let x = character.x
        let y = character.y

        let eggToEat = this.eggs.find(egg => !egg.owner && !egg.removed && egg.x === x && egg.y === y)
        if (eggToEat) {
          eggToEat.removed = true
        }
      }
    }
  }

  resolveDropActions(characterActions) {
    for (let {
        character,
        action
      } of characterActions) {
      let item = character.item

      if (action && action.type === 'DropAction' && item !== null) {
        let x = character.x + action.direction.dx
        let y = character.y + action.direction.dy

        let worldObjects = this.getWorldObjectsAt(x, y)
        let blockingObjects = worldObjects.filter(o => o instanceof Item || o instanceof Bonfire || o instanceof Switch || o instanceof Spikes)
        if (blockingObjects.length === 0 && (this.map.isFloor(x, y) || this.map.isHole(x, y))) {
          character.dropItem(action.direction)
        }

        // Put inside cauldron if there is one on the drop square
        let cauldrons = worldObjects.filter(o => o instanceof Cauldron)
        if (cauldrons.length > 0) {
          cauldrons[0].putItem(item)
        }

        // Put inside a hole if it's on one => remove egg from game
        if (this.map.isHole(x, y)) {
          item.throwInHole()
        }
      }
    }
  }

  resolveTakeActions(characterActions) {
    for (let {
        character,
        action
      } of characterActions) {
      if (action && action.type === 'TakeAction' && character.item === null) {
        let x = character.x + action.direction.dx
        let y = character.y + action.direction.dy

        let items = this.getWorldObjectsAt(x, y).filter(o => o instanceof Item)
        if (items.length > 0) {
          character.takeItem(items[0])
        }
      }
    }
  }

  resolveWriteActions(characterActions) {
    for (let {
        character,
        action
      } of characterActions) {
      if (action && action.type === 'WriteAction' && character.item !== null && typeof character.item.write === 'function') {
        character.item.write(action.value)
      }
    }
  }

  resolveCloneActions(characterActions) {
    for (let {
        character,
        action
      } of characterActions) {
      if (action && action.type === 'CloneAction') {
        let clonedCharacter = character.clone(action.direction, action.config)

        let x = clonedCharacter.x
        let y = clonedCharacter.y
        let cloneOnFloor = this.map.isFloor(x, y)
        let notInfected = !this.map.isInfected(x, y)
        let cloneCollidesActiveHero = !!this.getCharactersAt(x, y).find(c => !c.dead && c instanceof Hero && c.ai.hasStepAvailable())
        let cloneCollidesNPC = !!this.getCharactersAt(x, y).find(c => !c.dead && c instanceof Npc)
        let cloneCollidesObject = !!this.bonfires.find(b => b.x === x && b.y === y) ||
          !!this.spikes.find(s => s.x === x && s.y === y && s.enabled) ||
          !!this.cauldrons.find(b => b.x === x && b.y === y)

        // Successful cloning
        if (cloneOnFloor && !cloneCollidesObject && !cloneCollidesNPC &&
          (
            character instanceof Npc ||
            (character instanceof Hero && !cloneCollidesActiveHero && notInfected)
          )
        ) {
          this.characters.push(clonedCharacter)
          if (clonedCharacter.getObjectType() === ObjectType.hero) {
            this.heroes.push(clonedCharacter)
            this.eventLog.attachHero(clonedCharacter)
          } else if (clonedCharacter.getObjectType() === ObjectType.npc) {
            this.npcs.push(clonedCharacter)
          }
        } else {
          // Failed cloning results in dying for the cloning character
          if (action.deadly) {
            character.setDead(true, CharacterDeathReason.failedCloning)
          }
          clonedCharacter = null
        }

        this.eventLog.logEvent('character-cloning', {
          characterID: character.id,
          cloneID: clonedCharacter ? clonedCharacter.id : null,
          cloneType: clonedCharacter ? clonedCharacter.getObjectType() : null,
          clonePosition: {
            x: character.x + action.direction.dx,
            y: character.y + action.direction.dy,
          },
        })
      }
    }
  }

  resolveFireBallActions(characterActions) {
    for (let {
        character,
        action
      } of characterActions) {
      if (action && action.type === 'FireBallAction') {
        let x = character.x + action.direction.dx
        let y = character.y + action.direction.dy

        // Light bonfires
        let bonfires = this.bonfires.filter(b => b.x === x && b.y === y)
        bonfires.forEach(bonfire => bonfire.enable())

        // Light cauldrons
        let cauldrons = this.cauldrons.filter(c => c.x === x && c.y === y)
        cauldrons.forEach(cauldron => cauldron.enable())

        // Kill characters
        let targetCharacters = this.characters.filter(c => c.x === x && c.y === y && !c.dead)
        targetCharacters.forEach(character => character.setDead(true, CharacterDeathReason.burnt))
      }
    }
  }

  resolveStepActions(characterActions) {
    let stepActions = characterActions.filter(action => action.action && action.action.type === 'StepAction' && !action.character.dead)

    // Wall collisions and simple hero collisions
    let changed = true
    while (changed) {
      changed = false
      for (let i = 0; i < stepActions.length; i++) {
        let {
          character,
          action
        } = stepActions[i]
        let x = character.x + action.direction.dx
        let y = character.y + action.direction.dy
        let collidesWall = this.map.isWall(x, y)
        let collidesBonfire = this.getWorldObjectsAt(x, y).filter(o => o instanceof Bonfire).length > 0
        let collidesCauldron = this.getWorldObjectsAt(x, y).filter(o => o instanceof Cauldron).length > 0
        let collidingHeroes = this.getCharactersAt(x, y).filter(c => c instanceof Hero && !c.dead && (c.ai.hasStepAvailable() || c.ai.lastActionCursor !== c.ai.cursor))
        let collidesHero = collidingHeroes.length > 0
        let collidingNPCs = this.getCharactersAt(x, y).filter(c => !c.dead && c instanceof Npc)
        let collidesNpc = collidingNPCs.length > 0
        let collidesComingNPC = collidingNPCs.some(npc => {
          let npcStepAction = stepActions.find(a => a.character === npc)
          return npcStepAction &&
            npcStepAction.action.direction.dx === -action.direction.dx &&
            npcStepAction.action.direction.dy === -action.direction.dy
        })

        if (collidesWall || collidesBonfire || collidesCauldron || (character instanceof Hero && collidesComingNPC)) {
          stepActions.splice(i, 1)
          i--
        } else if ((character instanceof Hero && !collidesHero) || (character instanceof Npc && !collidesNpc)) {
          character.move(action.direction)
          stepActions.splice(i, 1)
          i--
          changed = true
        }
      }
    }

    // double hero collisions: allow heroes to exchange places
    changed = true
    while (changed) {
      changed = false
      main_loop:
        for (let i = 0; i < stepActions.length - 1; i++) {
          let stepAction1 = stepActions[i]
          let x1 = stepAction1.character.x + stepAction1.action.direction.dx
          let y1 = stepAction1.character.y + stepAction1.action.direction.dy
          for (let j = i + 1; j < stepActions.length; j++) {
            let stepAction2 = stepActions[j]
            let x2 = stepAction2.character.x + stepAction2.action.direction.dx
            let y2 = stepAction2.character.y + stepAction2.action.direction.dy

            if ((
                (stepAction1.character instanceof Hero && stepAction2.character instanceof Hero) ||
                (stepAction1.character instanceof Npc && stepAction2.character instanceof Npc)
              ) &&
              x1 === stepAction2.character.x &&
              y1 === stepAction2.character.y &&
              x2 === stepAction1.character.x &&
              y2 === stepAction1.character.y) {
              stepAction1.character.move(stepAction1.action.direction)
              stepAction2.character.move(stepAction2.action.direction)
              stepActions.splice(stepActions.indexOf(stepAction1), 1)
              stepActions.splice(stepActions.indexOf(stepAction2), 1)
              changed = true
              break main_loop
            }
          }
        }
    }
  }

  addMessageOnChannel(message, channelKey) {
    if (channelKey) {
      let channel = this.speachChannels.find(ch => ch.key === channelKey)
      if (!channel) {
        channel = {
          key: channelKey,
          messages: []
        }
        this.speachChannels.push(channel)
      }

      channel.messages.push(message)
    }
  }

  moveEndedHeroesOut() {
    let endedHeroes = this.getCharacters().filter(c => c instanceof Hero && !c.ai.hasStepAvailable() && !c.lastAction && !c.dead)

    for (let hero of endedHeroes) {
      let x = hero.x
      let y = hero.y

      if (this.getCharactersAt(x, y).filter(c => c instanceof Hero && c !== hero && !c.dead).length > 0) {
        const collidesNoHero = (x, y) => {
          let terrainType = this.map.getTerrainTypeAt(x, y)
          let collidesTerrain = terrainType !== TerrainType.floor
          let collidingObjects = this.getWorldObjectsAt(x, y).filter(o => o instanceof Bonfire || o instanceof Cauldron || o instanceof Spikes || (o instanceof Character && o !== hero && !o.dead))

          return collidesTerrain || collidingObjects.length > 0
        }

        const collides = (x, y) => {
          let terrainType = this.map.getTerrainTypeAt(x, y)
          let collidesTerrain = terrainType !== TerrainType.floor
          let collidingObjects = this.getWorldObjectsAt(x, y).filter(o => o instanceof Bonfire || o instanceof Cauldron || o instanceof Spikes)

          return collidesTerrain || collidingObjects.length > 0
        }

        let pathFinder = new PathFinder(collides, this.map.width, this.map.height, {
          x: x - freeDirSearchRadius,
          y: y - freeDirSearchRadius,
          width: freeDirSearchRadius * 2 + 3,
          height: freeDirSearchRadius * 2 + 3
        })

        for (let dir of freeDirSearchTree) {
          let newX = x + dir.x
          let newY = y + dir.y

          if (!collidesNoHero(newX, newY)) {
            let path = pathFinder.findPath({
              x: x,
              y: y
            }, {
              x: newX,
              y: newY
            })

            if (path.length > 0) {
              let direction = new Direction(newX - x, newY - y)
              direction.setForced(newX - x, newY - y)
              let stepAction = new StepAction(direction)
              hero.move(direction)
              hero.lastAction = stepAction
              break
            }
          }
        }
      }
    }
  }

  resolveActionConsequences(characterActions) {
    this.moveEndedHeroesOut()

    for (let mySwitch of this.switches) {
      if (this.characters.some(character => character.overlaps(mySwitch) && !character.dead)) {
        mySwitch.enable()
      } else {
        mySwitch.disable()
      }
    }

    for (let spike of this.spikes) {
      spike.checkTriggers()
    }

    for (let character of this.characters.filter(c => !c.dead)) {
      let spikes = this.getWorldObjectsAt(character.x, character.y).filter(o => o instanceof Spikes)
      if (spikes.length > 0 && spikes[0].isEnabled()) {
        character.setDead(true, CharacterDeathReason.spikes)
      }
    }

    for (let character of this.characters.filter(c => !c.dead)) {
      if (this.map.isHole(character.x, character.y)) {
        character.setDead(true, CharacterDeathReason.fall)
      }
    }

    for (let hero of this.heroes.filter(h => !h.dead)) {
      if (this.map.isInfected(hero.x, hero.y)) {
        hero.setDead(true, CharacterDeathReason.infected)
      }
    }

    for (let hero of this.heroes) {
      if (this.npcs.some(npc => !npc.dead && npc.x === hero.x && npc.y === hero.y)) {
        hero.setDead(true, CharacterDeathReason.touchedEnemy)
      }
    }
  }

  getWorldObjects() {
    return [
      ...this.heroes,
      ...this.npcs,
      ...this.switches,
      ...this.bonfires,
      ...this.cauldrons,
      ...this.spikes,
      ...this.eggs
    ].filter(o => !o.removed)
  }

  getAllObjects() {
    return [
      ...this.heroes,
      ...this.npcs,
      ...this.switches,
      ...this.bonfires,
      ...this.cauldrons,
      ...this.spikes,
      ...this.eggs,
      ...this.symbols,
      ...this.configObjects,
    ]
  }

  findWorldObjectByID(id) {
    return this.getWorldObjects().find(o => o.id === id)
  }

  findConfigObjectByID(id) {
    return this.configObjects.find(o => o.id === id)
  }

  getWorldObjectsAt(x, y) {
    return this.getWorldObjects().filter(o => o.x === x && o.y === y && !(o instanceof Item && o.owner))
  }

  getConfigObjectsAt(x, y) {
    return this.configObjects.filter(o => o.x === x && o.y === y)
  }

  getCharactersAt(x, y) {
    return this.getCharacters().filter(c => c.x === x && c.y === y)
  }

  getCharacters() {
    return this.characters
  }

  declareWin() {
    this.hasWon = true
    this.declareGameOver()
  }

  declareLoss() {
    this.hasLost = true
    this.lossReason = this.ruleset.getLossReason()
    this.declareGameOver()
  }

  declareGameOver() {
    this.gameOver = true
  }

  getDebugContext() {
    let context = {
      heroes: this.heroes.map(hero => hero.getDebugContext()),
      searchEventLog: this.eventLog.search.bind(this.eventLog),
    }
    return context
  }

  getProxy() {
    if (!this.proxy || this.proxy.steps !== this.steps) {
      this.proxy = new WorldProxy(this)
    }
    return this.proxy
  }
}


class WorldProxy {
  constructor(world) {
    // World snapshot

    this.map = world.map.getProxy()
    this.steps = world.steps

    this.heroes = world.heroes.map(o => Object.freeze(o.shallowCopy()))
    // this.npcs = world.npcs.map(o => Object.freeze(o.shallowCopy()))
    this.switches = world.switches.map(o => Object.freeze(o.shallowCopy()))
    this.bonfires = world.bonfires.map(o => Object.freeze(o.shallowCopy()))
    this.cauldrons = world.cauldrons.map(o => Object.freeze(o.shallowCopy()))
    this.spikes = world.spikes.map(o => Object.freeze(o.shallowCopy()))
    this.eggs = world.eggs.map(o => Object.freeze(o.shallowCopy()))
    this.symbols = world.symbols.map(o => Object.freeze(o.shallowCopy()))
    this.configObjects = world.configObjects.map(o => Object.freeze(o.shallowCopy()))

    this.worldObjects = Object.freeze([
      ...this.heroes,
      // ...this.npcs,
      ...this.switches,
      ...this.bonfires,
      ...this.cauldrons,
      ...this.spikes,
      ...this.eggs,
      ...this.symbols
    ])

    this.objects = Object.freeze([
      ...this.worldObjects,
      ...this.configObjects
    ])

    // Functions

    this.rng = world.rng

    if (this.steps === undefined) {
      this.createObject = world.createObject.bind(world)
    }

    Object.freeze(this)
  }

  findObjectByID(id) {
    return this.objects.find(o => o.id === id)
  }

  findObjectsAt(x, y) {
    return this.worldObjects.filter(o => o.x === x && o.y === y && !(o.type === 'egg' && o.owner))
  }
}


const freeDirSearchTree = []
const freeDirSearchRadius = 2
for (let y = -freeDirSearchRadius; y <= freeDirSearchRadius; y++) {
  for (let x = -freeDirSearchRadius; x <= freeDirSearchRadius; x++) {
    if (y !== 0 || x !== 0) {
      let d = x ** 2 + y ** 2
      freeDirSearchTree.push({
        x: x,
        y: y,
      })
    }
  }
  const module = a => a.x ** 2 + a.y ** 2
  freeDirSearchTree.sort((a, b) => {
    let moduleDiff = module(a) - module(b)
    if (moduleDiff !== 0) {
      return moduleDiff
    } else {
      return 100000 * (a.y - b.y) + (a.x - b.x)
    }
  })
}