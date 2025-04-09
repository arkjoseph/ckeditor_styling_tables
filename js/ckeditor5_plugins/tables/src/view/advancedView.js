import { createLabeledInputText } from 'ckeditor5/src/ui';
import TableFormView from './baseFormView';

export default class AdvancedTableFormView extends TableFormView {
  constructor(locale) {
    super(locale, {
      headerLabel: 'Advanced',
      extraClasses: 'ck-table-advanced-form'
    });

    // Create form fields
    this.tableIdView = this._createInput('Id', createLabeledInputText);
    this.tableWidthView = this._createInput('Width', createLabeledInputText, {
      infoText: 'Enter a number for a value in pixels or a number with a valid CSS unit (px,%, in, cm, mm, em, ex, pt or pc).'
    });
    this.tableHeightView = this._createInput('Height', createLabeledInputText, {
      infoText: 'Enter a number for a value in pixels or a number with a valid CSS unit (px,%, in, cm, mm, em, ex, pt or pc).'
    });

    // Build form structure
    this.addRow([this.tableIdView]);
    this.addRow([this.tableWidthView]);
    this.addRow([this.tableHeightView]);
    this.addActionRow();
  }

  _registerFocusableViews() {
    [
      this.tableIdView,
      this.tableWidthView,
      this.tableHeightView,
      this.saveButtonView,
      this.cancelButtonView,
    ].forEach(view => {
      this._focusables.add(view);
      this.focusTracker.add(view.element);
    });
  }

  // Any additional specific methods for this form
}
