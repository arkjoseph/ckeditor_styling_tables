import { Plugin } from 'ckeditor5/src/core';
import { ButtonView, createDropdown, addListToDropdown, ViewModel } from 'ckeditor5/src/ui';
import { Collection } from 'ckeditor5/src/utils';
import icon from '../../../../../icons/table-column.svg';

export default class UsaColumnui extends Plugin {
  init() {
    const editor = this.editor;
    editor.ui.componentFactory.add('UsaColumn', (local) => {
      const dropdownView = new createDropdown(local);

      dropdownView.buttonView.set({
          label: editor.t('Column Settings'),
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
      addItems('Insert Column Left', 'item-1');
      addItems('Insert Column Right', 'item-2');
      addItems('Delete Column', 'item-3');
      addItems('Select Column', 'item-4');

      addListToDropdown(dropdownView, items);

      this.listenTo(dropdownView, 'execute', (eventInfo) => {
        const { id, label } = eventInfo.source;
        switch (id) {
          case 'item-1':
            editor.execute('insertTableColumnLeft');
            break;
          case 'item-2':
            editor.execute('insertTableColumnRight');
            break;
          case 'item-3':
            editor.execute('removeTableColumn');
            break;
          case 'item-4':
            editor.execute('selectTableColumn');
            break;
        }
      });

      return dropdownView;
    });
  }
}
