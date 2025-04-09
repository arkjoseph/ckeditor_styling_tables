import {
  View,
  LabeledFieldView,
  ButtonView,
  submitHandler,
  FocusCycler,
  FormHeaderView,
  ViewCollection,
  createLabeledDropdown, addListToDropdown, ViewModel, SwitchButtonView,
} from 'ckeditor5/src/ui';

import {
  Collection,
  FocusTracker,
  KeystrokeHandler,
} from 'ckeditor5/src/utils';

import FormRowView from './formrowview';
import { icons } from 'ckeditor5/src/core';

export default class TableFormView extends View {
  constructor(locale, options = {}) {
    super(locale);

    this.locale = locale;
    this.focusTracker = new FocusTracker();
    this.keystrokes = new KeystrokeHandler();
    this._focusables = new ViewCollection();
    this.childViews = this.createCollection();

    // Create form header with customizable label
    const headerLabel = options.headerLabel || 'Table properties';
    this.childViews.add(new FormHeaderView(locale, {
      label: headerLabel
    }));

    // Create action buttons that all forms need
    this.saveButtonView = this._createButton(
      'Save', icons.check, 'ck-button-save',
    );
    this.saveButtonView.type = 'submit';

    this.cancelButtonView = this._createButton(
      'Cancel', icons.cancel, 'ck-button-cancel',
    );
    this.cancelButtonView.delegate('execute').to(this, 'cancel');

    // Setup focus cycling (common to both forms)
    this._focusCycler = new FocusCycler({
      focusables: this._focusables,
      focusTracker: this.focusTracker,
      keystrokeHandler: this.keystrokes,
      actions: {
        focusPrevious: 'shift + tab',
        focusNext: 'tab',
      },
    });

    // Set common template structure
    this.setTemplate({
      tag: 'form',
      attributes: {
        class: ['ck', 'ck-table-form', options.extraClasses || ''],
        tabindex: '-1',
      },
      children: this.childViews,
    });
  }

  // Common render method
  render() {
    super.render();
    submitHandler({ view: this });

    // Register focusable views
    this._registerFocusableViews();

    // Start listening for keystrokes
    this.keystrokes.listenTo(this.element);
  }

  // Common cleanup method
  destroy() {
    super.destroy();
    this.focusTracker.destroy();
    this.keystrokes.destroy();
  }

  // Common focus method
  focus() {
    this._focusCycler.focusFirst();
  }

  // Add a row of form fields
  addRow(children, className = 'ck-table-form__field-row') {
    this.childViews.add(new FormRowView(this.locale, {
      children,
      class: className
    }));
  }

  // Add the action row with save/cancel buttons
  addActionRow() {
    this.addRow(
      [this.saveButtonView, this.cancelButtonView],
      'ck-table-form__action-row'
    );
  }

  // Register all focusable elements
  _registerFocusableViews() {
    // This will be implemented by derived classes
  }

  // Shared utility methods
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

  _createInput(label, creator, options = {}) {
    const labeledField = new LabeledFieldView(this.locale, creator);
    labeledField.label = label;

    if (options.placeholder) {
      labeledField.placeholder = options.placeholder;
    }

    if (options.infoText) {
      labeledField.infoText = options.infoText;
    }

    return labeledField;
  }

  _createSwitchButton(label, id) {
    const switchButton = new SwitchButtonView();

    switchButton.set({
      withText: true,
      label,
      isEnabled: true,
      isOn: false,
      id: id,
    });

    return switchButton;
  }

  _createDropdown(label, options, name) {
    const dropdown = new LabeledFieldView(this.locale, createLabeledDropdown);

    dropdown.set({
      label: label,
      class: 'ck-table-form__style-options'
    });

    dropdown.fieldView.buttonView.set({
      withText: true,
      class: name
    });

    const opts_collection = this._createDropdownItems(options);
    addListToDropdown(dropdown.fieldView, opts_collection, {
      role: 'menu',
      tooltip: 'Options'
    });

    return dropdown;
  }

  _createDropdownItems(options) {
    const items = new Collection();
    options.forEach(opt => {
      items.add({
        type: 'button',
        model: new ViewModel({
          withText: true,
          label: opt[1],
          id: opt[0],
          isOn: false
        }),
      });
    });
    return items;
  }
}
