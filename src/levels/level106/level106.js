/* length: 6
a:
take(w)
drop(e)
if nw < sw :
	take(sw)
endif
take(nw)
jump a
*/

/* speed: 23
a:
take(w)
drop(e)
if sw > nw :
	take(sw)
else
	take(nw)
endif
drop(e)
take(w)
drop(e)
jump a
*/

const winCondition = {
  step() {
    if (this.world.steps === 1) {
      this.maxEggValue = this.world.eggs.reduce((accumulator, egg) => Math.max(egg.value, accumulator), 0)
    }
  },

  check() {
    const cauldronID = 30
    let cauldron = this.world.findWorldObjectByID(cauldronID)
    return cauldron.items.length === 1 && cauldron.items[0].value === this.maxEggValue
  },

  getReason() {
    return 'reason_custom'
  }
}
const notMaximumEggLossCondition = {
  step() {
    if (this.world.steps === 1) {
      this.maxEggValue = this.world.eggs.reduce((accumulator, egg) => Math.max(egg.value, accumulator), 0)
    }
  },

  check() {
    const cauldronID = 30
    let cauldron = this.world.findWorldObjectByID(cauldronID)
    return cauldron.items.length > 0 && cauldron.items[0].value < this.maxEggValue
  },

  getReason() {
    return 'not_maximum_egg_loss_condition'
  }
}

const level = {
  name: {
    en: "Human chain 2",
    fr: "Chaîne humaine 2",
  },
  objective: {
    en: "Put the %%icon icon-egg$%% egg of maximum value\nin the %%icon icon-cauldron$%% cauldron\n\n%%icon mdi mdi-information-outline$%% In case of a tie, choose one of the two",
    fr: "Mets l'%%icon icon-egg$%% œuf de valeur maximum\ndans le %%icon icon-cauldron$%% chaudron\n\n%%icon mdi mdi-information-outline$%% En cas d'égalité, choisis l'un des deux",
  },
  messages: {
    not_maximum_egg_loss_condition: {
      en: "You put an %%icon icon-egg$%% egg which is not the maximum in the %%icon icon-cauldron$%% cauldron",
      fr: "Tu as mis un %%icon icon-egg$%% œuf qui n'est pas le maximum dans le %%icon icon-cauldron$%% chaudron",
    }
  },
  startingCode: "",
  startingEditorType: "graph",
  maxStep: 100,
  speedTarget: 23,
  lengthTarget: 6,

  compilerConfig: {
    excludePrimary: ['assign'],
    variables: 0,
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['egg'],
    valueFunctions: [],
    actionFunctions: ['take', 'drop'],
    leftComparisonExpressions: ['direction', 'myitem'],
    rightComparisonExpressions: ['terrain_type', 'object_type', 'integer', 'direction']
  },

  ruleset: {
    win: [winCondition],
    lose: [notMaximumEggLossCondition, 'default_loss']
  }
}

export default level