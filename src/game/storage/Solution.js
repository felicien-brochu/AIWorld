import StorageWrapper from './StorageWrapper'
import CodeHistory from './CodeHistory'

export default class Solution extends StorageWrapper {
  constructor(key) {
    super(key)

    this.id = NaN
    this.name = ''
    this.editorType = ''
    this.codeHistory = null
    this.score = null
    this.hasOpen = false
  }

  // Do not call directly this method. Call set() instead with the same arguments as this one
  init(id, name, code = '', editorType = 'graph') {
    this.id = id
    this.name = name
    if (!this.name) {
      this.name = `solution${id + 1}`
    }
    this.editorType = editorType
    this.codeHistory = new CodeHistory(code)
    this.score = new SolutionScore()
    this.hasOpen = false
  }

  addScore(averageStep, codeLength) {
    this.score.add(averageStep, codeLength)
    this.save(false)
  }

  load(data) {
    this.id = data.id
    this.name = data.name
    this.editorType = data.editorType
    this.codeHistory = CodeHistory.buildFromJSON(data.codeHistory)
    this.score = SolutionScore.buildFromJSON(data.score)
    this.hasOpen = data.hasOpen

    return true
  }

  toJSON() {
    let o = super.toJSON()
    Object.assign(o, {
      id: this.id,
      name: this.name,
      editorType: this.editorType,
      codeHistory: this.codeHistory,
      score: this.score,
      hasOpen: this.hasOpen
    })

    return o
  }
}

class SolutionScore {
  constructor(won = false, minStep = -1, minLength = -1) {
    this.won = won
    this.minStep = minStep
    this.minLength = minLength
  }

  static buildFromJSON(jsonObject) {
    return new SolutionScore(jsonObject.won, jsonObject.minStep, jsonObject.minLength)
  }

  hasWon() {
    return this.won
  }

  add(averageStep, codeLength) {
    this.won = true
    if (this.minStep < 0 || this.minStep > averageStep) {
      this.minStep = averageStep
    }
    if (this.minLength < 0 || this.minLength > codeLength) {
      this.minLength = codeLength
    }
  }
}