import Expression from '../Expression'
import ExpressionValue from '../ExpressionValue'
import {
  MismatchStatementException,
  ForbiddenExpressionTypeException,
} from '../../CompilerException'
import {
  NotDecompilableStatementException
} from '../../DecompilerException'
import Direction from '../../../../Direction'
import ObjectType from '../../../../objects/ObjectType'
import TerrainType from '../../../../map/TerrainType'

export default class DirectionLiteral extends Expression {
  constructor(parent, line, column) {
    super('DirectionLiteral', parent, line, column)
    this.name = null
    this.value = null
  }

  compile(config, context) {
    let joinedCode = this.code.join(' ')
    let res = joinedCode.match(DirectionLiteral.codeRegExp)
    if (!res) {
      throw new MismatchStatementException('you try to compile as a direction literal a statement which is not one', this)
    }

    this.name = joinedCode.trim()
    this.value = Direction[this.name]

    if (!config.isExpressionTypeAvailable(this.constructor)) {
      throw new ForbiddenExpressionTypeException(`'${this.code.join(' ').trim()}' DirectionLiteral are not available.`, this, {
        template: 'exception_forbidden_direction_literal_type_template',
      })
    }
  }

  decompile(indent, line, column) {
    super.decompile(indent, line, column)

    if (!this.name) {
      throw new NotDecompilableStatementException('this direction literal has no name', this)
    }
    this.code = [this.name]

    return true
  }

  static isValid(code) {
    let name = code.trim()
    return !!name.match(DirectionLiteral.codeRegExp) && !!Direction[name]
  }

  computeValue(context) {
    let res = []
    let direction = this.value
    context.observations.push(direction)
    let x = context.character.x + direction.dx
    let y = context.character.y + direction.dy

    let worldObjects = context.world.getWorldObjectsAt(x, y)
      .map(obj => ExpressionValue.object(obj.shallowCopy()))
      .sort((a, b) => {
        if (a.value.type === ObjectType.hero) {
          if (b.value.type === ObjectType.hero) {
            return 0
          } else {
            return -1
          }
        } else {
          if (b.value.type === ObjectType.hero) {
            return 1
          } else {
            return 0
          }
        }
      })

    // Remove hero self from results (they are selfless after all!)
    if (direction.equals(Direction.here)) {
      worldObjects = worldObjects.filter(o => o.value.type !== ObjectType.hero)
    }

    // Insert nothing object type if no object
    if (worldObjects.length === 0) {
      res.push(ExpressionValue.objectType(ObjectType.nothing))
    } else {
      res = res.concat(worldObjects)
    }

    let terrainType = context.world.map.getTerrainTypeAt(x, y)
    res.push(ExpressionValue.terrainType(terrainType))
    if (terrainType === TerrainType.infected) {
      res.push(ExpressionValue.terrainType(TerrainType.floor))
    }

    return ExpressionValue.composite(res)
  }

  static notHereValidator(direction) {
    return !Direction.here.equals(direction)
  }
}

DirectionLiteral.codeRegExp = /^\s*(\w+)\s*$/