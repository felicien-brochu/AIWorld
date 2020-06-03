import WorldObject from './WorldObject'
import IdleAI from '../ai/IdleAI'
import Direction from '../Direction'

export default class Character extends WorldObject {
  constructor(config, world) {
    config = Object.assign({
      initialDirection: 'e',
      item: null,
    }, config)

    super(config)

    this.world = world
    this.ai = new IdleAI(world, this)

    this.lastAction = null
    this.dead = false
    this.deathReason = null
  }

  getStepPriority() {
    return this.ai.getStepPriority()
  }

  step(rng) {
    let action = null

    action = this.ai.step(rng)

    this.lastAction = action
    return this.lastAction
  }

  move(direction) {
    this.x += direction.dx
    this.y += direction.dy

    if (this.item) {
      this.item.x = this.x
      this.item.y = this.y
    }
  }

  dropItem(direction) {
    if (this.item) {
      this.item.setOwner(null)
      this.item.x = this.x + direction.dx
      this.item.y = this.y + direction.dy
      this.item = null
    }
  }

  takeItem(item) {
    if (item) {
      this.item = item
      item.setOwner(this)
    } else {
      this.item = null
    }
  }

  clone(direction, config) {
    throw new Error("Needs subclass implementation")
  }

  tell(message, channel) {
    if (channel) {
      let channelKey = null
      if (channel instanceof Direction) {
        channelKey = {
          x: this.x + channel.dx,
          y: this.y + channel.dy,
        }
      } else {
        channelKey = channel
      }
      this.world.addMessageOnChannel(message, channelKey)
    }
  }

  setDead(isDead, deathReason) {
    this.dead = isDead
    this.deathReason = deathReason
    if (isDead) {
      this.removed = true
      if (this.item) {
        this.item.removed = true
      }
      this.events.emit('die', this)
    }
  }

  getDebugContext() {
    return this.ai.getDebugContext()
  }

  shallowCopy() {
    let copy = super.shallowCopy()

    let item = this.item
    if (item instanceof WorldObject) {
      item = this.item.shallowCopy()
    }

    return Object.assign(copy, {
      dead: this.dead,
      deathReason: this.deathReason,
      item: item,
      ended: !this.ai.hasStepAvailable()
    })
  }
}