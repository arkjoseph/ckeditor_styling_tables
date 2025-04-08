import { Plugin } from 'ckeditor5/src/core';
import { ButtonView, createDropdown, addListToDropdown, ViewModel } from 'ckeditor5/src/ui';
import { Collection } from 'ckeditor5/src/utils';
import icon from '../../../../../icons/table-row.svg';

export default class UsaRowui extends Plugin {
  init() {
    const editor = this.editor;
    editor.ui.componentFactory.add('UsaRow', (local) => {
      const dropdownView = new createDropdown(local);

      dropdownView.buttonView.set({
          label: editor.t('Row Settings'),
          icon,
          tooltip: true,
          withText: false,
      });
      const items = new Collection();
      const addItems = ( label, id, src ) => {
        items.add({
          type: 'button',
          model: new ViewModel({
            withText: true,
            label: label,
            id: id,
          }),
        });
      }
      addItems('Insert Row Above', 'item-1');
      addItems('Insert Row Below', 'item-2');
      addItems('Delete Row', 'item-3');
      addItems('Select Row', 'item-4');

      addListToDropdown(dropdownView, items);

      this.listenTo(dropdownView, 'execute', (eventInfo) => {
        const { id, label } = eventInfo.source;
        switch (id) {
          case 'item-1':
            editor.execute('insertTableRowAbove');
            break;
          case 'item-2':
            editor.execute('insertTableRowBelow');
            break;
          case 'item-3':
            editor.execute('removeTableRow');
            break;
          case 'item-4':
            editor.execute('selectTableRow');
            break;
        }
      });

      return dropdownView;
    });
  }
}
