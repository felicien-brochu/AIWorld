import FunctionExpression from './FunctionExpression'
import IntegerLiteral from '../literals/IntegerLiteral'
import VariableIdentifier from '../VariableIdentifier'
import WriteAction from '../../../../actions/WriteAction'
import {
  InvalidNumberOfParamsException,
  InvalidFunctionParamsException
} from '../../CompilerException'

export default class WriteFunction extends FunctionExpression {
  constructor(parent, line, column) {
    super('WriteFunction', parent, line, column)
  }

  getRawParamTypes() {
    return [
      [{
        type: IntegerLiteral
      }, {
        type: VariableIdentifier
      }]
    ]
  }

  computeValue(context) {
    return {
      step: true,
      complete: true,
      goto: null,
      action: new WriteAction(this.params[0].computeValue(context))
    }
  }

  onInvalidNumberOfParams(config) {
    if (config.variables > 0) {
      throw new InvalidNumberOfParamsException(`'${this.constructor.keyword}' function requires exactly 1 integer literal or variable identifier parameter`, this, {
        template: 'exception_invalid_params_one_integer_or_variable_template',
        values: {
          keyword: {
            template: `function_${this.constructor.keyword}`
          },
          allowedVariables: config.getAllowedVariableIdentifiers(),
        }
      })
    } else {
      throw new InvalidNumberOfParamsException(`'${this.constructor.keyword}' function requires exactly 1 integer literal parameter`, this, {
        template: 'exception_invalid_params_one_integer_template',
        values: {
          keyword: {
            template: `function_${this.constructor.keyword}`
          },
        }
      })
    }
  }

  onInvalidParam(index, param, config) {
    if (config.variables > 0) {
      throw new InvalidFunctionParamsException(`'${param.code.join(' ').trim()}' is not a valid integer literal or variable identifier`, param, {
        template: 'exception_invalid_integer_or_variable_param_template',
        values: {
          keyword: {
            template: `function_${this.constructor.keyword}`
          },
          param: param.code.join(' ').trim()
        }
      })
    } else {
      throw new InvalidFunctionParamsException(`'${param.code.join(' ').trim()}' is not a valid integer literal`, param, {
        template: 'exception_invalid_integer_param_template',
        values: {
          keyword: {
            template: `function_${this.constructor.keyword}`
          },
          param: param.code.join(' ').trim()
        }
      })
    }
  }
}

WriteFunction.keyword = 'write'