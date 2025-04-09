import {
  createLabeledInputNumber,
  createLabeledTextarea,
  createLabeledDropdown,
  SwitchButtonView,
  ViewModel,
  addListToDropdown,
} from 'ckeditor5/src/ui';

import { Collection } from 'ckeditor5/src/utils';
import TableFormView from './baseFormView';

// Constants moved outside the class
const headerOptions = [
  ['none', 'None'],
  ['first_row', 'First Row'],
  ['first_column', 'First Column'],
  ['both', 'Both'],
];

const styleOptions = [
  ['defaultTable', 'Default'],
  ['tableScrollable', 'Scrollable (horizontal)'],
  ['tableVerticalScrollable', 'Scrollable (vertical)'],
  ['tableSortable', 'Sortable'],
  ['tableWithSearch', 'Scrollable with search'],
  ['tableStacked', 'Responsive stacked'],
];

const borderOption = 'tableBorderless';
const stripesOption = 'tableStriped';

export default class MainTableFormView extends TableFormView {
  constructor(locale) {
    super(locale, { headerLabel: 'Table properties' });

    // Create form fields
    this.rowsInputView = this._createInput('Rows', createLabeledInputNumber, { placeholder: '2' });
    this.columnsInputView = this._createInput('Columns', createLabeledInputNumber, { placeholder: '2' });

    this.headerRowsView = this._createDropdown('Headers', headerOptions, 'select_header');
    this.summaryInputView = this._createInput('Summary', createLabeledTextarea);

    this.classOptionsView = this._createDropdown('Stylesheet Class', styleOptions, 'select_style');

    this.borderOptionsView = this._createSwitchButton('Make Borderless', borderOption);
    this.stripesOptionsView = this._createSwitchButton('Add Stripes to table', stripesOption);

    // Build form structure
    this.addRow([this.rowsInputView, this.columnsInputView]);
    this.addRow([this.headerRowsView, this.summaryInputView]);
    this.addRow([this.classOptionsView, this.borderOptionsView, this.stripesOptionsView]);
    this.addActionRow();

    // Setup event handlers
    this._setupEventHandlers();
  }

  _registerFocusableViews() {
    [
      this.rowsInputView,
      this.columnsInputView,
      this.headerRowsView,
      this.summaryInputView,
      this.classOptionsView,
      this.borderOptionsView,
      this.stripesOptionsView,
      this.saveButtonView,
      this.cancelButtonView,
    ].forEach(view => {
      this._focusables.add(view);
      this.focusTracker.add(view.element);
    });
  }

  _setupEventHandlers() {
    this.classOptionsView.fieldView.on('execute', evt => {
      const { id, label } = evt.source;
      this.classOptionsViewValue = id;
      this.classOptionsView.fieldView.buttonView.label = label;
      this.classOptionsView.fieldView.class = 'ck-dropdown-selected';
    });

    this.headerRowsView.fieldView.on('execute', evt => {
      const { id, label } = evt.source;
      this.headerRowsViewValue = id;
      this.headerRowsView.fieldView.buttonView.label = label;
      this.headerRowsView.fieldView.class = 'ck-dropdown-selected';
    });

    this.borderOptionsView.on('execute', () => {
      this.borderOptionsView.isOn = !this.borderOptionsView.isOn;
      this.borderOptionsViewValue = this.borderOptionsView.isOn;
    });

    this.stripesOptionsView.on('execute', () => {
      this.stripesOptionsView.isOn = !this.stripesOptionsView.isOn;
      this.stripesOptionsViewValue = this.stripesOptionsView.isOn;
    });
  }

  // Any additional specific methods for this form
}
