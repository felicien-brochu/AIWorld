<template>
<div>
  <p v-bbcode>{{
		$text('level_help_tab_tell_function_1')
	}}</p>

  <h5>{{$text('level_help_tab_statement_graph_code_example')}}</h5>
  <p>
    <simple-graph-code :code="'tell(\'ok\' e)'"
      :compilerConfig="defaultCompilerConfig" />

    <span v-bbcode>{{
		$text('level_help_tab_tell_function_2')
	}}</span>
  </p>

  <br />
  <h5>{{$text('level_help_tab_statement_code_example')}}</h5>
  <p class="code"
    v-bbcode>{{$text('level_help_tab_tell_function_3')}}</p>

  <br />
  <p v-bbcode>{{
		$text('level_help_tab_tell_function_4')
	}}</p>

  <h5>{{$text('level_help_tab_statement_graph_code_example')}}</h5>
  <p>
    <simple-graph-code :code="'tell(\'hey\' everyone)'"
      :compilerConfig="defaultCompilerConfig" />

    <span v-bbcode>{{
		$text('level_help_tab_tell_function_5')
	}}</span>
  </p>

  <br />
  <h5>{{$text('level_help_tab_statement_code_example')}}</h5>
  <p class="code"
    v-bbcode>{{$text('level_help_tab_tell_function_6')}}</p>
</div>
</template>

<script>
import SimpleGraphCode from './SimpleGraphCode'
import CompilerConfig from '../../../world/ai/compile/CompilerConfig'

export default {
  components: {
    SimpleGraphCode
  },
  props: {
    compilerConfig: Object
  },
  computed: {
    defaultCompilerConfig: function() {
      return CompilerConfig.getDefault()
    }
  }
}
</script>

<style lang="scss">
</style>
