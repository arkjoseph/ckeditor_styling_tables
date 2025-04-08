import {
  ViewModel,
  View,
  LabeledFieldView,
  createLabeledInputNumber,
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

const headerOptions = [
  ['none', 'None'],
  ['first_row', 'First Row'],
  ['first_column', 'First Column'],
  ['both', 'Both'],
];
const styleOptions = [
  ['defaultTable', 'Default'],
  ['tableScrollable', 'Scrollable (horizontal)'],//
  ['tableVerticalScrollable', 'Scrollable (vertical)'],
  ['tableSortable', 'Sortable'],
  ['tableWithSearch', 'Scrollable with search'],
  ['tableStacked', 'Responsive stacked'],
];
const borderOption = 'tableBorderless';
const stripesOption = 'tableStriped';
export default class FormView extends View {
  constructor(locale) {
    super();
    this.locale = locale;
    this.focusTracker = new FocusTracker();
    this.keystrokes = new KeystrokeHandler();

    // Rows and Columns input
    this.rowsInputView = this._createInput('Rows');
    this.columnsInputView = this._createInput('Columns');
    this.rowsInputView.disable = true;

    // Header Options dropdown
    this.headerRowsView = this._createDropdown('Headers', headerOptions, 'select_header');
    this.headerRowsView.items = headerOptions;

    // Summary Input
    this.summaryInputView = this._createTextArea('Summary');

    //Stylesheet dropdown
    this.classOptionsView = this._createDropdown('Stylesheet Class', styleOptions, 'select_style');
    this.classOptionsView.items = styleOptions;

    // Border Toggle buttons
    this.borderOptionsView = this._createSwitchButton('Make Borderless', borderOption);
    this.borderOptionsView.items = borderOption;

    this.stripesOptionsView = this._createSwitchButton('Add Stripes to table', stripesOption);
    this.borderOptionsView.items = stripesOption;

    // Save button
    this.saveButtonView = this._createButton(
      'Save', icons.check, 'ck-button-save',
    );
    this.saveButtonView.type = 'submit';
    this.cancelButtonView = this._createButton(
      'Cancel', icons.cancel, 'ck-button-cancel',
    );
    this.cancelButtonView.delegate('execute').to(this, 'cancel');

    this.classOptionsView.fieldView.on('execute', evt => {
      // const { id, label } = evt.source;
      // this.classOptionsViewValue = id;
      // this.classOptionsView.fieldView.buttonView.label = label;
      // this.classOptionsView.fieldView.class = 'ck-dropdown-selected';

      // Attempting to pass isOn bool rather than value ... defaultTable = true
      const { id, label, isOn} = evt.source;
      this.classOptionsView.fieldView.buttonView.isOn = !this.classOptionsView.fieldView.buttonView.isOn;
      this.classOptionsViewValue = this.classOptionsView.fieldView.buttonView.isOn;

      if (this.classOptionsViewValue){
        this.classOptionsViewValue = id
      } else {
        this.classOptionsViewValue = false
      }
      //this.classOptionsView = id;


      this.classOptionsView.fieldView.buttonView.label = label;
      this.classOptionsView.fieldView.class = 'ck-dropdown-selected';
    });
    this.headerRowsView.fieldView.on('execute', evt => {
      const { id, label } = evt.source;
      this.headerRowsViewValue = id;
      this.headerRowsView.fieldView.buttonView.label = label;
      this.headerRowsView.fieldView.class = 'ck-dropdown-selected';
    });

    this.borderOptionsView.on('execute', (evt) => {
      const { id, label } = evt.source;
      this.borderOptionsView.isOn = !this.borderOptionsView.isOn;
      this.borderOptionsViewValue = this.borderOptionsView.isOn;
      // Pass ID to template instead of boolean
      if (this.borderOptionsViewValue) {
        this.borderOptionsViewValue = id;
      }
     });
    this.stripesOptionsView.on('execute', (evt) => {
      const { id, label } = evt.source;
      this.stripesOptionsView.isOn = !this.stripesOptionsView.isOn;
      this.stripesOptionsViewValue = this.stripesOptionsView.isOn;
      // Pass ID to template instead of boolean
      if (this.stripesOptionsViewValue) {
        this.stripesOptionsViewValue = id;
      }
    });

    // Begin building form
    this._focusables = new ViewCollection();
    this.childViews = this.createCollection();
    // Form header.
    this.childViews.add(new FormHeaderView(locale, {
      label: 'Table properties'
    }));
    this.childViews.add(new FormRowView(locale, {
      children: [
        this.rowsInputView,
        this.columnsInputView,
      ],
      class: 'ck-table-form__field-row'
    }))
    this.childViews.add(new FormRowView(locale, {
      children: [
        this.headerRowsView,
        this.summaryInputView,
      ],
      class: 'ck-table-form__field-row'
    }));
    this.childViews.add(new FormRowView(locale, {
      children: [
        this.classOptionsView,
        this.borderOptionsView,
        this.stripesOptionsView,
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
        class: ['ck', 'ck-table-form'],
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

  _createInput(label) {
    const labeledInput = new LabeledFieldView(this.locale, createLabeledInputNumber);
    labeledInput.label = label;
    labeledInput.placeholder = '2';
    return labeledInput;
  }

  _createTextArea(label) {
     const labeledTextArea = new LabeledFieldView(this.locale, createLabeledTextarea);
     labeledTextArea.label = label;
     return labeledTextArea;
  }

  _createDropdown(label, options, name) {
    const dropdown = new LabeledFieldView(this.locale, createLabeledDropdown);
    const bind = this.bindTemplate;
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
