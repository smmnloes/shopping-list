import { Plugin, ButtonView } from 'ckeditor5';
import save from '../../public/save.svg?raw'

export class SaveButton extends Plugin {
  init() {
    const editor = this.editor;

    // Register the button so it can be referenced by name in the toolbar config.
    editor.ui.componentFactory.add( 'saveButton', locale => {
      const button = new ButtonView( locale );
      const saveFunction = editor.config.get('saveButton') as () => Promise<void>
      button.set( {
        icon: save,
      } );

      // Custom functionality on click.
      button.on( 'execute', async () => {
        await saveFunction()
      } );

      return button;
    } );
  }
}
