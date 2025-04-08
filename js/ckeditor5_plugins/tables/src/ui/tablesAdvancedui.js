import { Plugin } from 'ckeditor5/src/core';
import {
  clickOutsideHandler,
  ContextualBalloon,
  buttonView,
  addListToDropdown,
  ViewModel,
  ButtonView, createDropdown,
} from 'ckeditor5/src/ui';
import FormView from '../view/advancedView';
import {
  getSelectionAffectedTable,
} from '@ckeditor/ckeditor5-table/src/utils/common';
import { getBalloonTablePositionData } from '../utils/positionContextualBalloon';

export default class TablesAdvancedui extends Plugin {
  static get requires() {
    return [ContextualBalloon];
  }

  /**
   * @inheritDoc
   */
  static get pluginName() {
    return 'TablesAdvanced';
  }

  /**
   * @inheritDoc
   */
  init() {
    const editor = this.editor;

    this._balloon = editor.plugins.get(ContextualBalloon);
    this.formView = this._createFormView();

    editor.ui.componentFactory.add('TablesAdvanced', (local) => {
      const buttonView = new ButtonView(local);
      buttonView.set({
        label: editor.t('Advanced'),
        withText: true,
        tooltip: true,
      });

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
        id: formView.tableIdView.fieldView.element.value,
        width: formView.tableWidthView.fieldView.element.value,
        height: formView.tableHeightView.fieldView.element.value,
        source: 'advanced',
      };

      editor.execute('PropertiesCommand', value);

      this._hideUI();

    });
    this.listenTo(formView, 'cancel', () => {
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
      this.formView.element.reset();
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
  _showUI() {
    const selection = this.editor.model.document.selection;
    const table = getSelectionAffectedTable(selection);

    // Editing Tables or New Table
    if (!!table) {
      // We ask for a different position for editing tables with helper function
      this._balloon.add({
        view: this.formView,
        position: getBalloonTablePositionData(this.editor),
      });

      const tableId = table.getAttribute('tableId');
      const tableWidth = table.getAttribute('tableWidth');
      const tableHeight = table.getAttribute('tableHeight');

      if (tableId){
        this.formView.tableIdView.fieldView.value = tableId;
      } else {
        this.formView.tableIdView.fieldView.value = '';
      }
      if (tableHeight){
        this.formView.tableHeightView.fieldView.value = tableHeight;
      } else {
        this.formView.tableHeightView.fieldView.value = '';
      }
      if (tableWidth){
        this.formView.tableWidthView.fieldView.value = tableWidth;
      } else {
        this.formView.tableWidthView.fieldView.value = '100%';
      }

    } else {
      // New Table inserted
      this._balloon.add({
        view: this.formView,
        position: this._getBalloonPositionData(),
      });
    }

    this.formView.focus();
  }
}

