import Ruleset from './Ruleset'
import AllSwitchesEnabledCondition from './conditions/AllSwitchesEnabledCondition'
import DefaultLossCondition from './conditions/DefaultLossCondition'

export default class DefaultRuleset extends Ruleset {
  constructor(world) {
    super(world)

    this.winCondition = new AllSwitchesEnabledCondition(world)
    this.lossCondition = new DefaultLossCondition(world)
    this.conditions = [
      this.winCondition,
      this.lossCondition
    ]
  }

  step() {
    this.conditions.forEach(condition => condition.step())
  }

  hasWon() {
    return this.winCondition.check()
  }

  getLossReason() {
    return this.lossCondition.getReason()
  }
}