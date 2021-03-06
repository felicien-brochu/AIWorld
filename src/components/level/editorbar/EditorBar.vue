<template>
<div class="editor-bar">

  <div :class="{
		'code-state-container': true,
		'hidden': !isCodeEditor
	}">
    <button :class="['code-state', codeState]"
      type="button"
      :title="codeStateToolTip"
      @click="handleCodeStateClick" />
  </div>

  <div class="center-container">

    <button :class="{
				'undo-button': true,
				'mdi': true,
				'mdi-light': true,
				'mdi-undo': true,
				'mdi-inactive': !codeHistory.canUndo()
			}"
      type="button"
      :disabled="!codeHistory.canUndo()"
      :title="$text('editor_bar_undo_button')"
      @click="handleUndoClick" />

    <button :class="{
				'redo-button': true,
				'mdi': true,
				'mdi-light': true,
				'mdi-redo': true,
				'mdi-inactive': !codeHistory.canRedo()
			}"
      type="button"
      :disabled="!codeHistory.canRedo()"
      :title="$text('editor_bar_redo_button')"
      @click="handleRedoClick" />

    <button :class=" {
				'delete-code-button': true,
				'mdi': true,
				'mdi-delete': true,
				'mdi-light': true,
				'mdi-inactive': code.length === 0
      }"
      type="button"
      :disabled="code.length === 0"
      :title="$text('editor_bar_delete_button')"
      @click="handleRemoveCodeClick" />
  </div>


  <toggle-button id="editor-switch"
    :value="isCodeEditor"
    :switchColor="{checked: '#252930', unchecked: '#252930', disabled: '#252930'}"
    :color="{checked: '#5d84c7', unchecked: '#FFFFFF', disabled: '#CCCCCC'}"
    :sync="true"
    :slave="true"
    :font-size="12"
    :width="30"
    :height="18"
    :labels="false"
    :title="$text(`editor_bar_switch_to_${editorType === 'code' ? 'graph' : 'code'}`)"
    @change="$emit('switch-editor', editorType === 'code' ? 'graph' : 'code')" />

</div>
</template>

<script>
import ToggleButton from '../../common/ToggleButton'

export default {
  components: {
    ToggleButton
  },
  props: {
    'code': {
      type: String,
      default: ''
    },
    'codeHistory': {
      type: Object
    },
    'worldState': {
      type: Object
    },
    'worldReady': {
      type: Boolean,
      default: false
    },
    'aiReady': {
      type: Boolean,
      default: false
    },
    'editorType': {
      type: String,
      validator: type => ['graph', 'code'].includes(type)
    },
    'codeState': {
      type: String
    }
  },

  computed: {
    codeStateToolTip: function() {
      let tip = ''

      if (this.codeState === 'code-ok') {
        tip = this.$text('code_state_ok_tooltip')
      }
      else if (this.codeState === 'code-not-runnable') {
        tip = this.$text('code_state_not_runnable_tooltip')
      }
      else if (this.codeState === 'code-not-compilable') {
        tip = this.$text('code_state_not_compilable_tooltip')
      }
      return tip
    },
    isCodeEditor: function() {
      return this.editorType === 'code'
    }
  },

  methods: {
    handleRemoveCodeClick(event) {
      this.$emit('remove-code')
      event.target.blur()
    },
    handleUndoClick(event) {
      this.$emit('undo')
      event.target.blur()
    },
    handleRedoClick(event) {
      this.$emit('redo')
      event.target.blur()
    },
    handleCodeStateClick() {
      this.$emit('code-state-click', this.codeState)
    }
  }
}
</script>

<style lang="scss">
.editor-bar {
    font-size: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    height: 42px;
    background-color: #252930;

    button {
        font-size: 32px;
        max-width: 48px;
        height: 40px;
        margin: 0 7px;
    }

    .vue-js-switch {
        font-size: 0;
    }

    .center-container {
        flex: 1;
        max-width: 400px;
        display: flex;
        justify-content: space-around;
        margin: 0 18px 0 6px;
    }

    .code-state-container {
        font-size: 0;
        width: 16px;
        height: 16px;
        line-height: 0;
        margin-right: 14px;

        &.hidden {
            visibility: hidden;
        }

        .code-state {
            font-size: 0;
            height: 16px;
            width: 16px;
            margin: 0;
            border: none;
            background: none;
            border-radius: 8px;
            $margin: 25px;
            cursor: pointer;

            transition-property: background-color, width, height, margin-right, border-radius;
            transition-duration: 150ms;

            &.code-ok {
                background-color: #779666;

                &:active,
                &:hover {
                    box-shadow: 0 0 10px #779666;
                }
            }
            &.code-not-runnable {
                background-color: #b46f37;
                &:active,
                &:hover {
                    box-shadow: 0 0 10px #b46f37;
                }
            }
            &.code-not-compilable {
                background-color: #af3636;
                &:active,
                &:hover {
                    box-shadow: 0 0 10px #af3636;
                }
            }
        }
    }
}
</style>
