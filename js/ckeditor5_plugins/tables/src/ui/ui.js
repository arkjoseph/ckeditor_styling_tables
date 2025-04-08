import { Plugin } from 'ckeditor5/src/core';

import {
  clickOutsideHandler,
  ContextualBalloon,
  buttonView,
  addListToDropdown,
  ViewModel,
  ButtonView,
  createDropdown,
} from 'ckeditor5/src/ui';
import { Collection } from 'ckeditor5/src/utils';
import icon from '../../../../../icons/table.svg';
import FormView from '../view/view';
import {
  getSelectionAffectedTable,
} from '@ckeditor/ckeditor5-table/src/utils/common';
import { getBalloonTablePositionData } from '../utils/positionContextualBalloon';

export default class TablesUi extends Plugin {
  static get requires() {
    return [ContextualBalloon];
  }

  /**
   * @inheritDoc
   */
  static get pluginName() {
    return 'Tables';
  }

  /**
   * @inheritDoc
   */
  init() {
    const editor = this.editor;

    this._balloon = editor.plugins.get(ContextualBalloon);
    this.formView = this._createFormView();

    editor.ui.componentFactory.add('Tables', (local) => {
      const buttonView = new ButtonView(local);
      buttonView.set({
        label: editor.t('Table properties'),
        withText: false,
        icon,
        tooltip: true,
      });
      buttonView.bind('isEnabled').to(editor, 'isReadOnly', isReadOnly => !isReadOnly);

      this.listenTo(buttonView, 'execute', (eventInfo) => {
        // Show the UI on button click.
        this._showUI();
      });

      return buttonView;
    });
  }

  _createFormView() {
    const editor = this.editor;
    const formView = new FormView(editor.locale);

    this.listenTo(formView, 'submit', () => {
      const value = {
        row: formView.rowsInputView.fieldView.element.value,
        col: formView.columnsInputView.fieldView.element.value,
        header: formView.headerRowsViewValue,
        headerLabel: formView.headerRowsView,
        summary: formView.summaryInputView.fieldView.element.value,
        style: formView.classOptionsViewValue,
        styleLabel: formView.classOptionsView,
        border: formView.borderOptionsView.isOn,
        stripes: formView.stripesOptionsView.isOn,
      };

      // Validation of value
      if (value.header === 'none' || !value.header) {
        window.alert('Please select header option');
        this.formView.headerRowsView.fieldView.focus();
      } else {
        editor.execute('PropertiesCommand', value);
        this._hideUI();
        this.formView.columnsInputView.fieldView.value = value.row;
        this.formView.rowsInputView.fieldView.value = value.col;
        this.formView.headerRowsView.fieldView.label = '';
        // this.formView.classOptionsView.fieldView.buttonView.label = '';
        // this.formView.classOptionsViewValue = '';
      }

    });
    this.listenTo(formView, 'cancel', () => {
      const value = {
        row: formView.rowsInputView.fieldView.element.value,
        col: formView.columnsInputView.fieldView.element.value,
      };
      this.formView.columnsInputView.fieldView.value = value.row;
      this.formView.rowsInputView.fieldView.value = value.col;
      this._hideUI();
    });
    // Hide the form view when clicking outside the balloon.
    clickOutsideHandler({
      emitter: formView,
      activator: () => this._balloon.visibleView === formView,
      contextElements: [this._balloon.view.element],
      callback: () => this._hideUI(),
    });

    // Close the panel on esc key press when the form has focus.
    formView.keystrokes.set('Esc', (data, cancel) => {
      this._hideUI();
      cancel();
    });
    return formView;
  }

  // Hide the Form
  _hideUI() {
    const selection = this.editor.model.document.selection;
    const table = getSelectionAffectedTable(selection);
    if (!!table) {
      // do nothing
    } else {
      const value = {
        row: this.formView.rowsInputView.fieldView.element.value,
        col: this.formView.columnsInputView.fieldView.element.value,
      };
      this.formView.columnsInputView.fieldView.value = value.row;
      this.formView.rowsInputView.fieldView.value = value.col;
    }
    this._balloon.remove(this.formView);

    // Focus the editing view after closing the form view.
    this.editor.editing.view.focus();
  }

  _getBalloonPositionData() {
    const view = this.editor.editing.view;
    const viewDocument = view.document;

    let target = null;

    // Set a target position by converting view selection range to DOM.
    target = () => view.domConverter.viewRangeToDom(
      viewDocument.selection.getFirstRange(),
    );

    return {
      target,
    };
  }
  _setDefaultValues() {
    this.formView.columnsInputView.fieldView.value = '2';
    this.formView.rowsInputView.fieldView.value = '3';
    this.formView.summaryInputView.fieldView.element.value = '';
  }
  _showUI() {
    const selection = this.editor.model.document.selection;
    const table = getSelectionAffectedTable(selection);

    this._setDefaultValues();
    const activeClass = 'ck-dropdown-selected';
    if (!!table) {
      // We ask for a different position for editing tables with helper function
      this._balloon.add({
        view: this.formView,
        position: getBalloonTablePositionData(this.editor),
      });

      // Disable fields here
      this.formView.rowsInputView.fieldView.element.disabled = true;
      this.formView.columnsInputView.fieldView.element.disabled = true;

      let tableScrollable = false, tableCompactScrollable = false;

      if(table.parent && table.parent.name == 'htmlDiv') {
        let tmp =  table.parent.getAttribute('htmlDivAttributes');
        if (tmp.classes.includes("usa-table-container--scrollable")) {
          if (table.getAttribute('tableCompactScrollable')) {
            tableCompactScrollable = true;
          } else {
            tableScrollable = true;
          }
        }
      }else{
        if (table.getAttribute('tableCompactScrollable')) {
          tableCompactScrollable = true;
        }
        if (table.getAttribute('tableScrollable')) {
          tableScrollable = true;
        }
      }


      // Populate fields for editing a table
      const defaultTable = table.getAttribute('defaultTable');
      //const tableScrollable = table.getAttribute('tableScrollable');
      const tableVerticalScrollable = table.getAttribute('tableVerticalScrollable');
      //const tableCompactScrollable = table.getAttribute('tableCompactScrollable');
      const tableSortable = table.getAttribute('tableSortable');
      const tableWithSearch = table.getAttribute('tableWithSearch');
      const tableStacked = table.getAttribute('tableStacked');
      const tableStriped = table.getAttribute('tableStriped');
      const tableBorderless = table.getAttribute('tableBorderless');
      const summary = table.getAttribute('tableSummary');

      const first_row = table.getAttribute('headingRows');
      const first_col = table.getAttribute('headingColumns');
      if(summary) {
        this.formView.summaryInputView.fieldView.element.value = summary;
      } else {
        this.formView.summaryInputView.fieldView.element.value = '';
      }
      this.formView.classOptionsView.fieldView.class = activeClass;
      this.formView.headerRowsView.fieldView.class = activeClass;

      if (first_row && first_col) {
        this.formView.headerRowsView.fieldView.buttonView.label = 'Both';
        this.formView.headerRowsViewValue = 'both';
      } else if (first_row) {
        this.formView.headerRowsView.fieldView.buttonView.label = 'First Row';
        this.formView.headerRowsViewValue = 'first_row';
      } else if (first_col) {
        this.formView.headerRowsView.fieldView.buttonView.label = 'First Column';
        this.formView.headerRowsViewValue = 'first_col';
      }
      if (tableScrollable) {
        this.formView.classOptionsView.fieldView.buttonView.label = 'Scrollable (horizontal)';
        this.formView.classOptionsViewValue = 'tableScrollable';
      } else if (tableVerticalScrollable) {
        this.formView.classOptionsView.fieldView.buttonView.label = 'Scrollable (vertical)';
        this.formView.classOptionsViewValue = 'tableVerticalScrollable';
      } else if (tableCompactScrollable) {
        this.formView.classOptionsView.fieldView.buttonView.label = 'Compact Scrollable (horizontal)';
        this.formView.classOptionsViewValue = 'tableCompactScrollable';
      } else if (tableSortable) {
        this.formView.classOptionsView.fieldView.buttonView.label = 'Sortable';
        this.formView.classOptionsViewValue = 'tableSortable';
      } else if (tableWithSearch) {
        this.formView.classOptionsView.fieldView.buttonView.label = 'Scrollable with search';
        this.formView.classOptionsViewValue = 'tableWithSearch';
      } else if (tableStacked) {
        this.formView.classOptionsView.fieldView.buttonView.label = 'Responsive stacked';
        this.formView.classOptionsViewValue = 'tableStacked';
      }else{
        this.formView.classOptionsView.fieldView.buttonView.label = 'Default';
        this.formView.classOptionsViewValue = 'defaultTable';
      }

      if(tableStriped){
        this.formView.stripesOptionsView.isOn = true
      }else{
        this.formView.stripesOptionsView.isOn = false
      }

      if(tableBorderless){
        this.formView.borderOptionsView.isOn = true
      }else{
        this.formView.borderOptionsView.isOn = false
      }

      const rows = Array.from(table.getChildren());
      const columns = Array.from(rows[0].getChildren());
      this.formView.columnsInputView.fieldView.value = columns.length;
      this.formView.rowsInputView.fieldView.value = rows.length;
    } else {
      // New Table inserted
      this._balloon.add({
        view: this.formView,
        position: this._getBalloonPositionData(),
      });

      this.formView.rowsInputView.fieldView.element.disabled = false;
      this.formView.columnsInputView.fieldView.element.disabled = false;
      this._setDefaultValues();
      this.formView.classOptionsView.fieldView.class = '';
      this.formView.headerRowsView.fieldView.class = '';

      this.formView.headerRowsView.fieldView.buttonView.label = 'Headers';
      this.formView.headerRowsViewValue = '';

      this.formView.stripesOptionsView.isOn = false;
      this.formView.borderOptionsView.isOn = false;
      this.formView.summaryInputView.fieldView.element.value = '';
    }

    this.formView.focus();
  }
}

