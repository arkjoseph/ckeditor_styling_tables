import {
  ViewModel,
  View,
  LabeledFieldView,
  createLabeledInputText,
  ButtonView,
  submitHandler,
  createDropdown,
  createLabeledTextarea,
  addListToDropdown,
  createLabeledDropdown,
  FocusCycler,
  ContextualBalloon,
  SwitchButtonView,
  FormHeaderView,
  buttonView,
  ViewCollection,
} from 'ckeditor5/src/ui';

import {
  Collection,
  FocusTracker,
  KeystrokeHandler,
} from 'ckeditor5/src/utils';

import FormRowView from './formrowview';

import { icons, Plugin } from 'ckeditor5/src/core';

export default class FormView extends View {
  constructor(locale) {
    super();
    this.locale = locale;
    this.focusTracker = new FocusTracker();
    this.keystrokes = new KeystrokeHandler();

    // Rows and Columns input
    this.tableIdView = this._createInput('Id');
    this.tableWidthView = this._createInput('Width', 'Enter a number for a value in pixels or a number with a valid CSS unit (px,%, in, cm, mm, em, ex, pt or pc).');
    this.tableHeightView = this._createInput('Height', 'Enter a number for a value in pixels or a number with a valid CSS unit (px,%, in, cm, mm, em, ex, pt or pc).');

    // Save button
    this.saveButtonView = this._createButton(
      'Save', icons.check, 'ck-button-save',
    );
    this.saveButtonView.type = 'submit';
    this.cancelButtonView = this._createButton(
      'Cancel', icons.cancel, 'ck-button-cancel',
    );
    this.cancelButtonView.delegate('execute').to(this, 'cancel');

    // Begin building form
    this._focusables = new ViewCollection();
    this.childViews = this.createCollection();

    // Form header
    this.childViews.add(new FormHeaderView(locale, {
      label: 'Advance'
    }));
    this.childViews.add(new FormRowView(locale, {
      children: [
        this.tableIdView,
      ],
      class: 'ck-table-form__field-row'
    }))
    this.childViews.add(new FormRowView(locale, {
      children: [
        this.tableWidthView,
      ],
      class: 'ck-table-form__field-row'
    }))
    this.childViews.add(new FormRowView(locale, {
      children: [
        this.tableHeightView,
      ],
      class: 'ck-table-form__field-row'
    }))
    this.childViews.add(new FormRowView(locale, {
      children: [
        this.saveButtonView,
        this.cancelButtonView,
      ],
      class: 'ck-table-form__action-row'
    }))

    this._focusCycler = new FocusCycler({
      focusables: this._focusables,
      focusTracker: this.focusTracker,
      keystrokeHandler: this.keystrokes,
      actions: {
        // Navigate form fields backwards using the Shift + Tab keystroke.
        focusPrevious: 'shift + tab',

        // Navigate form fields forwards using the Tab key.
        focusNext: 'tab',
      },
    });

    this.setTemplate({
      tag: 'form',
      attributes: {
        class: ['ck', 'ck-table-form', 'ck-table-advanced-form'],
        tabindex: '-1',
      },
      children: this.childViews,
    });
  }

  render() {
    super.render();
    submitHandler({
      view: this,
    });
    [
      this.tableIdView,
      this.tableWidthView,
      this.tableHeightView,
      this.saveButtonView,
      this.cancelButtonView,
    ].forEach(view => {
      // Register the view in the focus tracker.
      this._focusables.add(view);
      this.focusTracker.add(view.element);
    });

    // Start listening for the keystrokes coming from #element.
    this.keystrokes.listenTo(this.element);
  }

  destroy() {
    super.destroy();

    this.focusTracker.destroy();
    this.keystrokes.destroy();
  }

  focus() {
    this._focusCycler.focusFirst();
  }

  _createInput(label,infoText) {
    const labeledInput = new LabeledFieldView(this.locale, createLabeledInputText);
    labeledInput.label = label;
    labeledInput.infoText = infoText;
    return labeledInput;
  }

  _createButton(label, icon, className) {
    const button = new ButtonView();

    button.set({
      withText: true,
      label,
      icon,
      tooltip: true,
      class: className,
    });

    return button;
  }
}
