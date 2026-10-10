import { ButtonView, Plugin } from 'ckeditor5'
import save from '../../public/save.svg?raw'

export class SaveButton extends Plugin {
  init() {
    const editor = this.editor

    // Register the button so it can be referenced by name in the toolbar config.
    editor.ui.componentFactory.add('saveButton', locale => {
      const button = new ButtonView(locale)
      const saveFunction = (editor.config.get('saveButton') as any).saveNoteFunction as () => Promise<void>
      button.set({
        class: 'save-button-toolbar',
        icon: save,
      })

      // Custom functionality on click.
      button.on('execute', async () => {
        await saveFunction()
          .then(() => button.element?.classList.add('success'))
          .catch(_ => button.element?.classList.add('fail'))

        await new Promise((res, _) => setTimeout(res, 1500))

        button.element?.classList.remove('success', 'fail')
      })

      editor.model.document.on('change:data', (e) => {
        console.log('bla', e)

      })

      return button
    })
  }
}
