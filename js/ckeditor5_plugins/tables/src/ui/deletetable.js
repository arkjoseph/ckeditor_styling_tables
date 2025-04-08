import { Plugin } from 'ckeditor5/src/core';
import { ButtonView, createDropdown, addListToDropdown, ViewModel } from 'ckeditor5/src/ui';
import { Collection } from 'ckeditor5/src/utils';
import icon from '../../../../../icons/delete-table.svg';
import {
  getSelectionAffectedTable
} from '@ckeditor/ckeditor5-table/src/utils/common';

export default class Deletetable extends Plugin {
  init() {
    const editor = this.editor;
    editor.ui.componentFactory.add('Deletetable', (local) => {
      const dropdownView = new createDropdown(local);

      dropdownView.buttonView.set({
          label: editor.t('Delete Table'),
          icon,
          tooltip: true,
          withText: false,
      });
      const items = new Collection();
      items.add({
        type: 'button',
        model: new ViewModel({
          withText: true,
          label: 'Delete Table',
          id: 'delete-table',
        }),
      });

      addListToDropdown(dropdownView, items);
      this.listenTo(dropdownView, 'execute', (eventInfo) => {
        editor.model.change(writer => {
          const selection = editor.model.document.selection,
                table = getSelectionAffectedTable(selection);
          writer.remove(table);
        });
      });

      return dropdownView;
    });
  }
}
