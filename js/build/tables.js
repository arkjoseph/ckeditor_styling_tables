(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["CKEditor5"] = factory();
	else
		root["CKEditor5"] = root["CKEditor5"] || {}, root["CKEditor5"]["tables"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "ckeditor5/src/core.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = (__webpack_require__("dll-reference CKEditor5.dll"))("./src/core.js");

/***/ }),

/***/ "ckeditor5/src/ui.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = (__webpack_require__("dll-reference CKEditor5.dll"))("./src/ui.js");

/***/ }),

/***/ "ckeditor5/src/utils.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = (__webpack_require__("dll-reference CKEditor5.dll"))("./src/utils.js");

/***/ }),

/***/ "dll-reference CKEditor5.dll":
/***/ ((module) => {

"use strict";
module.exports = CKEditor5.dll;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ src)
});

// EXTERNAL MODULE: delegated ./core.js from dll-reference CKEditor5.dll
var delegated_corefrom_dll_reference_CKEditor5 = __webpack_require__("ckeditor5/src/core.js");
;// ./node_modules/@ckeditor/ckeditor5-table/src/utils/common.js
/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * A common method to update the numeric value. If a value is the default one, it will be unset.
 *
 * @param key An attribute key.
 * @param value The new attribute value.
 * @param item A model item on which the attribute will be set.
 * @param defaultValue The default attribute value. If a value is lower or equal, it will be unset.
 */
function updateNumericAttribute(key, value, item, writer, defaultValue = 1) {
    if (value !== undefined && value !== null && defaultValue !== undefined && defaultValue !== null && value > defaultValue) {
        writer.setAttribute(key, value, item);
    }
    else {
        writer.removeAttribute(key, item);
    }
}
/**
 * A common method to create an empty table cell. It creates a proper model structure as a table cell must have at least one block inside.
 *
 * @param writer The model writer.
 * @param insertPosition The position at which the table cell should be inserted.
 * @param attributes The element attributes.
 * @returns Created table cell.
 */
function createEmptyTableCell(writer, insertPosition, attributes = {}) {
    const tableCell = writer.createElement('tableCell', attributes);
    writer.insertElement('paragraph', tableCell);
    writer.insert(tableCell, insertPosition);
    return tableCell;
}
/**
 * Checks if a table cell belongs to the heading column section.
 */
function isHeadingColumnCell(tableUtils, tableCell) {
    const table = tableCell.parent.parent;
    const headingColumns = parseInt(table.getAttribute('headingColumns') || '0');
    const { column } = tableUtils.getCellLocation(tableCell);
    return !!headingColumns && column < headingColumns;
}
/**
 * Enables conversion for an attribute for simple view-model mappings.
 *
 * @param options.defaultValue The default value for the specified `modelAttribute`.
 */
function enableProperty(schema, conversion, options) {
    const { modelAttribute } = options;
    schema.extend('tableCell', {
        allowAttributes: [modelAttribute]
    });
    upcastStyleToAttribute(conversion, { viewElement: /^(td|th)$/, ...options });
    downcastAttributeToStyle(conversion, { modelElement: 'tableCell', ...options });
}
/**
 * Depending on the position of the selection we either return the table under cursor or look for the table higher in the hierarchy.
 */
function getSelectionAffectedTable(selection) {
    const selectedElement = selection.getSelectedElement();
    // Is the command triggered from the `tableToolbar`?
    if (selectedElement && selectedElement.is('element', 'table')) {
        return selectedElement;
    }
    return selection.getFirstPosition().findAncestor('table');
}

;// ./js/ckeditor5_plugins/tables/src/commands/propertiesCommand.js



/**
 * Command responsible for handling table properties in the editor.
 * This includes both basic properties (style, headers, etc.) and advanced
 * properties (ID, dimensions, etc.)
 */
class PropertiesCommand extends delegated_corefrom_dll_reference_CKEditor5.Command {
  /**
   * Creates an instance of the PropertiesCommand.
   *
   * @param {module:core/editor/editor~Editor} editor - The editor instance.
   * @param {String} attributeName - The name of the attribute this command affects.
   */
  constructor(editor, attributeName) {
    super(editor);
    this.attributeName = attributeName;
  }

  /**
   * Refreshes the command state.
   * The command is enabled when a table is selected in the model.
   */
  refresh() {
    const { model } = this.editor;
    const selection = model.document.selection;
    const table = getSelectionAffectedTable(selection);

    // Command is enabled when a table is present or when we're creating a new table
    this.isEnabled = true;
  }

  /**
   * Executes the command to update or create a table with specified properties.
   *
   * @param {Object} options - Options for the table properties.
   * @param {Number} options.row - Number of rows for a new table.
   * @param {Number} options.col - Number of columns for a new table.
   * @param {String} options.summary - Summary text for the table.
   * @param {String} options.style - Style class to apply to the table.
   * @param {String} options.header - Header type ('first_row', 'first_column', 'both', or null).
   * @param {Boolean} options.border - Whether to add borderless style.
   * @param {Boolean} options.stripes - Whether to add striped style.
   * @param {String} options.id - ID attribute for the table.
   * @param {String} options.width - Width value for the table.
   * @param {String} options.height - Height value for the table.
   * @param {String} options.source - Source of the command ('advanced' or undefined).
   */
  execute({ row, col, summary, style, header, border, stripes, id, width, height, source }) {
    const editor = this.editor;
    const selection = editor.model.document.selection;

    // Get the selected table, if there is one
    const table = getSelectionAffectedTable(selection);
    this.isEnabled = !!table;

    editor.model.change(writer => {
      this.writer = writer;

      if (!table) {
        this._createNewTable({ row, col, header }, writer, editor);
      } else if (source === 'advanced') {
        this._updateAdvancedProperties(table, { id, width, height });
      } else {
        this._updateBasicProperties(table, { style, border, stripes, summary, header });
      }
    });
  }

  /**
   * Creates a new table with the specified properties.
   *
   * @param {Object} options - Options for creating a new table.
   * @param {Number} options.row - Number of rows.
   * @param {Number} options.col - Number of columns.
   * @param {String} options.header - Header type.
   * @param {module:engine/model/writer~Writer} writer - The model writer.
   * @param {module:core/editor/editor~Editor} editor - The editor instance.
   * @private
   */
  _createNewTable({ row, col, header }, writer, editor) {
    // Configure table options based on header selection
    let options = { rows: row, columns: col };
    if (header && header === 'both') {
      options = { rows: row, columns: col, headingRows: 1, headingColumns: 1 };
    } else if (header && header === 'first_row') {
      options = { rows: row, columns: col, headingRows: 1 };
    } else if (header && header === 'first_column') {
      options = { rows: row, columns: col, headingColumns: 1 };
    }

    // Insert the new table
    editor.execute('insertTable', options);

    // Get the newly inserted table
    const selection = editor.model.document.selection;
    const table = getSelectionAffectedTable(selection);

    // Set default width
    writer.setAttribute('tableWidth', '100%', table);

    return table;
  }

  /**
   * Updates advanced properties of an existing table.
   *
   * @param {module:engine/model/element~Element} table - The table element to update.
   * @param {Object} properties - Advanced properties to update.
   * @param {String} properties.id - Table ID.
   * @param {String} properties.width - Table width.
   * @param {String} properties.height - Table height.
   * @private
   */
  _updateAdvancedProperties(table, { id, width, height }) {
    // Set ID if provided, or remove if empty
    if (id) {
      this.writer.setAttribute('tableId', id, table);
    } else {
      this.writer.removeAttribute('tableId', table);
    }

    // Set width if provided, or remove if empty
    if (width) {
      this.editor.execute('tableWidth', { value: width });
    } else {
      this.editor.execute('tableWidth', { value: null });
    }

    // Set height if provided, or remove if empty
    if (height) {
      this.editor.execute('tableHeight', { value: height });
    } else {
      this.editor.execute('tableHeight', { value: null });
    }
  }

  /**
   * Updates basic properties of an existing table.
   *
   * @param {module:engine/model/element~Element} table - The table element to update.
   * @param {Object} properties - Basic properties to update.
   * @param {String} properties.style - Table style class.
   * @param {Boolean} properties.border - Whether to add borderless style.
   * @param {Boolean} properties.stripes - Whether to add striped style.
   * @param {String} properties.summary - Table summary text.
   * @param {String} properties.header - Header type.
   * @private
   */
  _updateBasicProperties(table, { style, border, stripes, summary, header }) {
    // Define all possible style options
    const styleOptions = [
      'tableScrollable',
      'tableVerticalScrollable',
      'tableCompactScrollable',
      'tableSortable',
      'tableWithSearch',
      'tableStacked'
    ];

    // Always set the default table attribute
    this.writer.setAttribute('defaultTable', true, table);

    // Handle style attribute
    if (style) {
      // Remove any existing styles first
      styleOptions.forEach(option => this.writer.removeAttribute(option, table));

      // Set the new style (if it's not the default)
      if (style !== 'defaultTable') {
        this.writer.setAttribute(style, true, table);
      }
    }

    // Handle striped rows style
    if (stripes) {
      this.writer.setAttribute('tableStriped', true, table);
    } else {
      this.writer.removeAttribute('tableStriped', table);
    }

    // Handle borderless style
    if (border) {
      this.writer.setAttribute('tableBorderless', true, table);
    } else {
      this.writer.removeAttribute('tableBorderless', table);
    }

    // Handle summary attribute
    if (summary) {
      this.writer.setAttribute('tableSummary', summary, table);
    } else {
      this.writer.removeAttribute('tableSummary', table);
    }

    // Update table headers based on selection
    this._updateTableHeaders(table, header);
  }

  /**
   * Updates table headers based on the selected header type.
   *
   * @param {module:engine/model/element~Element} table - The table element to update.
   * @param {String} header - The header type ('first_row', 'first_column', 'both', or null).
   * @private
   */
  _updateTableHeaders(table, header) {
    // Get current heading configuration
    let headingRows = table.getAttribute('headingRows') || 0;
    let headingColumns = table.getAttribute('headingColumns') || 0;

    if (header === 'both') {
      // Set both row and column headers
      this.writer.setAttribute('headingRows', true, table);
      this.writer.setAttribute('headingColumns', true, table);
      this._setHeaderRowScope(table);
      this._setHeaderColumnScope(table, header);
    } else if (header === 'first_row') {
      // Set only row headers
      this.writer.setAttribute('headingRows', true, table);

      if (headingColumns) {
        this.writer.setAttribute('headingColumns', 0, table);
      }

      this._setHeaderRowScope(table);

      if (headingColumns) {
        this._removeHeaderColumnScope(table);
      }
    } else if (header === 'first_column') {
      // Set only column headers
      this.writer.setAttribute('headingColumns', true, table);

      if (headingRows) {
        this.writer.setAttribute('headingRows', 0, table);
      }

      this._setHeaderColumnScope(table, header);

      if (headingRows) {
        this._removeHeaderRowScope(table);
      }
    }
  }

  /**
   * Sets the scope attribute to 'col' for header cells in the first row.
   * This improves accessibility for screen readers.
   *
   * @param {module:engine/model/element~Element} table - The table element to update.
   * @private
   */
  _setHeaderRowScope(table) {
    const tableElement = table.getChild(0);

    // Iterate over the cells in the first row
    [...tableElement.getChildren()].forEach((cell) => {
      if (cell.name === 'tableCell') {
        this.writer.setAttribute('scope', 'col', cell);
      }
    });
  }

  /**
   * Removes the scope attribute from header cells in the first row.
   *
   * @param {module:engine/model/element~Element} table - The table element to update.
   * @private
   */
  _removeHeaderRowScope(table) {
    const tableElement = table.getChild(0);

    // Iterate over the cells in the first row
    [...tableElement.getChildren()].forEach(cell => {
      if (cell.name === 'tableCell') {
        this.writer.removeAttribute('scope', cell);
      }
    });
  }

  /**
   * Sets the scope attribute to 'row' for header cells in the first column.
   * This improves accessibility for screen readers.
   *
   * @param {module:engine/model/element~Element} table - The table element to update.
   * @param {String} header - The header type.
   * @private
   */
  _setHeaderColumnScope(table, header) {
    [...table.getChildren()].forEach((row, index) => {
      // Skip first row if header type is 'both'
      if (header === 'both' && index === 0) {
        return;
      }

      // Get the first cell of the row
      const firstCell = row.getChild(0);

      // Set scope="row" for the first cell if it exists
      if (firstCell && firstCell.name === 'tableCell') {
        this.writer.setAttribute('scope', 'row', firstCell);
      }
    });
  }

  /**
   * Removes the scope attribute from header cells in the first column.
   *
   * @param {module:engine/model/element~Element} table - The table element to update.
   * @private
   */
  _removeHeaderColumnScope(table) {
    [...table.getChildren()].forEach(row => {
      // Get the first cell of the row
      const firstCell = row.getChild(0);

      // Remove scope attribute if it exists
      if (firstCell && firstCell.name === 'tableCell') {
        this.writer.removeAttribute('scope', firstCell);
      }
    });
  }
}

/**
 * Checks if two cells have the same table as their parent.
 *
 * @param {module:engine/model/element~Element} cellA - First cell to compare.
 * @param {module:engine/model/element~Element} cellB - Second cell to compare.
 * @returns {Boolean} Whether both cells have the same table parent.
 * @private
 */
function haveSameTableParent(cellA, cellB) {
  return cellA.parent.parent === cellB.parent.parent;
}

;// ./js/ckeditor5_plugins/tables/src/editing.js



class EditingTable extends delegated_corefrom_dll_reference_CKEditor5.Plugin {
  /**
   * @inheritDoc
   */
  static get pluginName() {
    return 'EditingTable';
  }

  /**
   * @inheritDoc
   */
  init() {

    const editor = this.editor;
    const model = this.editor.model;

    this._defineSchema();
    this._defineConverters();

  }

  _defineSchema() {
    const editor = this.editor;
    const model = editor.model;

    const advanced_classes = [
      { id: 'defaultTable', classes: 'usa-table' },
      { id: 'tableScrollable', classes: ['default-scrollable'] }, // this may be throwing off the upcast
      { id: 'tableVerticalScrollable', classes: ['scrollTable'] },
      { id: 'tableCompactScrollable', classes: ['usa-table--compact'] },
      { id: 'tableSortable', classes: ['sortTable'] },
      { id: 'tableWithSearch', classes: ['scrollTable_search'] },
      { id: 'tableStacked', classes: ['usa-table--stacked'] },
      { id: 'tableBorderless', classes: ['usa-table--borderless']},
      { id: 'tableStriped', classes: ['usa-table--striped']}
    ];
    this.editor.model.schema.extend('table', {
      allowAttributes: ['summary','class'],
    });

    this.editor.commands.add('PropertiesCommand',new PropertiesCommand(this.editor));


    advanced_classes.forEach((tableClass) => {
      editor.model.schema.extend('table', {allowAttributes: tableClass.id});

      editor.conversion.for('upcast').attributeToAttribute({
        model: {
          name: 'table',
          key: tableClass.id,
          value: viewElement => {
            const elem = viewElement;
            return true;
          },
        },
        view: {
          key: 'class',
          value: tableClass.classes,
        },
      });
      const val = `attribute:${tableClass.id}:table`;

      // Apply attribute to table element no matter if it's needed or not.
      editor.conversion.for('downcast').add(dispatcher => {
        dispatcher.on(val, (evt, data, conversionApi) => {
          const viewElement = conversionApi.mapper.toViewElement(data.item);

          if ( data.attributeNewValue !== null ) {
            conversionApi.writer.addClass(tableClass.classes, viewElement);
          } else {
            conversionApi.writer.removeClass(tableClass.classes, viewElement);
          }
        });
      });
    });
  };

  _defineConverters() {
    this.editor.conversion.for('downcast').attributeToAttribute({
      view: 'id',
      model: {
        name: 'table',
        key: 'tableId',
      },
    });
    this.editor.conversion.for('upcast').attributeToAttribute({
      view: {
        key: 'id',
        name: 'table',
      },
      model: {
        key: 'tableId',
      },
    });

    this.editor.conversion.for('downcast')
      .attributeToAttribute({
        model: {
          name: 'table',
          key: 'tableSummary',
        },
        view: 'summary',
      });

    this.editor.conversion.for('upcast')
      .attributeToAttribute({
        view: {
          key: 'summary',
          name: 'table',
        },
        model: {
          key: 'tableSummary',
        },
      });
    this.editor.conversion
        .for('upcast')
        .elementToElement({
          view: 'thead',
          model: 'thead'
        });

    this.editor.conversion
        .for('downcast')
        .elementToElement({
          model: 'thead',
          view: 'thead'
        });

    this.editor.conversion
        .for('upcast')
        .elementToElement({
          view: 'th',
          model: 'th'
        });

    this.editor.conversion
        .for('downcast')
        .elementToElement({
          model: 'th',
          view: 'th'
        });

    this.editor.conversion
        .for('upcast')
        .attributeToAttribute({
          view: 'scope',
          model: 'scope'
        });
    this.editor.conversion
        .for('downcast')
        .attributeToAttribute({
          view: 'scope',
          model: 'scope'
        });
  }
}

// EXTERNAL MODULE: delegated ./ui.js from dll-reference CKEditor5.dll
var delegated_uifrom_dll_reference_CKEditor5 = __webpack_require__("ckeditor5/src/ui.js");
// EXTERNAL MODULE: delegated ./utils.js from dll-reference CKEditor5.dll
var delegated_utilsfrom_dll_reference_CKEditor5 = __webpack_require__("ckeditor5/src/utils.js");
;// ./icons/table.svg
/* harmony default export */ const table = ("<svg viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M3 6v3h4V6H3zm0 4v3h4v-3H3zm0 4v3h4v-3H3zm5 3h4v-3H8v3zm5 0h4v-3h-4v3zm4-4v-3h-4v3h4zm0-4V6h-4v3h4zm1.5 8a1.5 1.5 0 0 1-1.5 1.5H3A1.5 1.5 0 0 1 1.5 17V4c.222-.863 1.068-1.5 2-1.5h13c.932 0 1.778.637 2 1.5v13zM12 13v-3H8v3h4zm0-4V6H8v3h4z\"/></svg>");
;// ./js/ckeditor5_plugins/tables/src/view/formrowview.js
/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * @module table/ui/formrowview
 */


/**
 * The class representing a single row in a complex form,
 * used by {@link module:table/tablecellproperties/ui/tablecellpropertiesview~TableCellPropertiesView}.
 *
 * **Note**: For now this class is private. When more use cases arrive (beyond ckeditor5-table),
 * it will become a component in ckeditor5-ui.
 *
 * @internal
 */
class FormRowView extends delegated_uifrom_dll_reference_CKEditor5.View {
  /**
   * Creates an instance of the form row class.
   *
   * @param locale The locale instance.
   * @param options.labelView When passed, the row gets the `group` and `aria-labelledby`
   * DOM attributes and gets described by the label.
   */
  constructor(locale, options = {}) {
    super(locale);
    const bind = this.bindTemplate;
    this.set('class', options.class || null);
    this.children = this.createCollection();
    if (options.children) {
      options.children.forEach(child => this.children.add(child));
    }
    this.set('_role', null);
    this.set('_ariaLabelledBy', null);
    if (options.labelView) {
      this.set({
        _role: 'group',
        _ariaLabelledBy: options.labelView.id
      });
    }
    this.setTemplate({
      tag: 'div',
      attributes: {
        class: [
          'ck',
          'ck-form__row',
          bind.to('class')
        ],
        role: bind.to('_role'),
        'aria-labelledby': bind.to('_ariaLabelledBy')
      },
      children: this.children
    });
  }
}

;// ./js/ckeditor5_plugins/tables/src/view/baseFormView.js







class TableFormView extends delegated_uifrom_dll_reference_CKEditor5.View {
  constructor(locale, options = {}) {
    super(locale);

    this.locale = locale;
    this.focusTracker = new delegated_utilsfrom_dll_reference_CKEditor5.FocusTracker();
    this.keystrokes = new delegated_utilsfrom_dll_reference_CKEditor5.KeystrokeHandler();
    this._focusables = new delegated_uifrom_dll_reference_CKEditor5.ViewCollection();
    this.childViews = this.createCollection();

    // Create form header with customizable label
    const headerLabel = options.headerLabel || 'Table properties';
    this.childViews.add(new delegated_uifrom_dll_reference_CKEditor5.FormHeaderView(locale, {
      label: headerLabel
    }));

    // Create action buttons that all forms need
    this.saveButtonView = this._createButton(
      'Save', delegated_corefrom_dll_reference_CKEditor5.icons.check, 'ck-button-save',
    );
    this.saveButtonView.type = 'submit';

    this.cancelButtonView = this._createButton(
      'Cancel', delegated_corefrom_dll_reference_CKEditor5.icons.cancel, 'ck-button-cancel',
    );
    this.cancelButtonView.delegate('execute').to(this, 'cancel');

    // Setup focus cycling (common to both forms)
    this._focusCycler = new delegated_uifrom_dll_reference_CKEditor5.FocusCycler({
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
    (0,delegated_uifrom_dll_reference_CKEditor5.submitHandler)({ view: this });

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
    const button = new delegated_uifrom_dll_reference_CKEditor5.ButtonView();

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
    const labeledField = new delegated_uifrom_dll_reference_CKEditor5.LabeledFieldView(this.locale, creator);
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
    const switchButton = new delegated_uifrom_dll_reference_CKEditor5.SwitchButtonView();

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
    const dropdown = new delegated_uifrom_dll_reference_CKEditor5.LabeledFieldView(this.locale, delegated_uifrom_dll_reference_CKEditor5.createLabeledDropdown);

    dropdown.set({
      label: label,
      class: 'ck-table-form__style-options'
    });

    dropdown.fieldView.buttonView.set({
      withText: true,
      class: name
    });

    const opts_collection = this._createDropdownItems(options);
    (0,delegated_uifrom_dll_reference_CKEditor5.addListToDropdown)(dropdown.fieldView, opts_collection, {
      role: 'menu',
      tooltip: 'Options'
    });

    return dropdown;
  }

  _createDropdownItems(options) {
    const items = new delegated_utilsfrom_dll_reference_CKEditor5.Collection();
    options.forEach(opt => {
      items.add({
        type: 'button',
        model: new delegated_uifrom_dll_reference_CKEditor5.ViewModel({
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

;// ./js/ckeditor5_plugins/tables/src/view/view.js





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

class MainTableFormView extends TableFormView {
  constructor(locale) {
    super(locale, { headerLabel: 'Table properties' });

    // Create form fields
    this.rowsInputView = this._createInput('Rows', delegated_uifrom_dll_reference_CKEditor5.createLabeledInputNumber, { placeholder: '2' });
    this.columnsInputView = this._createInput('Columns', delegated_uifrom_dll_reference_CKEditor5.createLabeledInputNumber, { placeholder: '2' });

    this.headerRowsView = this._createDropdown('Headers', headerOptions, 'select_header');
    this.summaryInputView = this._createInput('Summary', delegated_uifrom_dll_reference_CKEditor5.createLabeledTextarea);

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

;// ./js/ckeditor5_plugins/tables/src/view/advancedView.js



class AdvancedTableFormView extends TableFormView {
  constructor(locale) {
    super(locale, {
      headerLabel: 'Advanced',
      extraClasses: 'ck-table-advanced-form'
    });

    // Create form fields
    this.tableIdView = this._createInput('Id', delegated_uifrom_dll_reference_CKEditor5.createLabeledInputText);
    this.tableWidthView = this._createInput('Width', delegated_uifrom_dll_reference_CKEditor5.createLabeledInputText, {
      infoText: 'Enter a number for a value in pixels or a number with a valid CSS unit (px,%, in, cm, mm, em, ex, pt or pc).'
    });
    this.tableHeightView = this._createInput('Height', delegated_uifrom_dll_reference_CKEditor5.createLabeledInputText, {
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

;// ./js/ckeditor5_plugins/tables/src/utils/positionContextualBalloon.js


const DEFAULT_BALLOON_POSITIONS = delegated_uifrom_dll_reference_CKEditor5.BalloonPanelView.defaultPositions;
const BALLOON_POSITIONS = [
  DEFAULT_BALLOON_POSITIONS.northArrowSouth,
  DEFAULT_BALLOON_POSITIONS.northArrowSouthWest,
  DEFAULT_BALLOON_POSITIONS.northArrowSouthEast,
  DEFAULT_BALLOON_POSITIONS.southArrowNorth,
  DEFAULT_BALLOON_POSITIONS.southArrowNorthWest,
  DEFAULT_BALLOON_POSITIONS.southArrowNorthEast,
  DEFAULT_BALLOON_POSITIONS.viewportStickyNorth
];
/**
 * A helper utility that positions the
 * {@link module:ui/panel/balloon/contextualballoon~ContextualBalloon contextual balloon} instance
 * with respect to the table in the editor content, if one is selected.
 *
 * @param editor The editor instance.
 * @param target Either "cell" or "table". Determines the target the balloon will be attached to.
 */
function repositionContextualBalloon(editor, target) {
  const balloon = editor.plugins.get('ContextualBalloon');
  const selection = editor.editing.view.document.selection;
  let position;
  //if (getSelectionAffectedTableWidget(selection)) {
    position = getBalloonTablePositionData(editor);
  //}
  if (position) {
    balloon.updatePosition(position);
  }
}

/**
 * Returns the positioning options that control the geometry of the
 * {@link module:ui/panel/balloon/contextualballoon~ContextualBalloon contextual balloon} with respect
 * to the selected table in the editor content.
 *
 * @param editor The editor instance.
 */
function getBalloonTablePositionData(editor) {
  const selection = editor.model.document.selection;
  const modelTable = getSelectionAffectedTable(selection);
  const viewTable = editor.editing.mapper.toViewElement(modelTable);
  return {
    target: editor.editing.view.domConverter.mapViewToDom(viewTable),
    positions: BALLOON_POSITIONS
  };
}

;// ./js/ckeditor5_plugins/tables/src/ui/ui.js






// Refactored to share common code






class TablesUi extends delegated_corefrom_dll_reference_CKEditor5.Plugin {
  static get requires() {
    return [delegated_uifrom_dll_reference_CKEditor5.ContextualBalloon];
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

    this._balloon = editor.plugins.get(delegated_uifrom_dll_reference_CKEditor5.ContextualBalloon);
    this.formView = this._createFormView();

    editor.ui.componentFactory.add('Tables', (local) => {
      const buttonView = new delegated_uifrom_dll_reference_CKEditor5.ButtonView(local);
      buttonView.set({
        label: editor.t('Table properties'),
        withText: false,
        icon: table,
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
    const formView = new MainTableFormView(editor.locale);

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
    (0,delegated_uifrom_dll_reference_CKEditor5.clickOutsideHandler)({
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


;// ./js/ckeditor5_plugins/tables/src/tables.js




class Tables extends delegated_corefrom_dll_reference_CKEditor5.Plugin {
  static get requires() {
    return [EditingTable, TablesUi];
  }
}

;// ./icons/table-row.svg
/* harmony default export */ const table_row = ("<svg viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M2.5 1h15A1.5 1.5 0 0 1 19 2.5v15a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 1 17.5v-15A1.5 1.5 0 0 1 2.5 1zM2 2v16h16V2H2z\" opacity=\".6\"/><path d=\"M7 2h1v16H7V2zm5 0h1v16h-1V2z\" opacity=\".6\"/><path d=\"M1 6h18a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm1 2v4h4V8H2zm6 0v4h4V8H8zm6 0v4h4V8h-4z\"/></svg>");
;// ./js/ckeditor5_plugins/tables/src/ui/rowui.js





class UsaRowui extends delegated_corefrom_dll_reference_CKEditor5.Plugin {
  init() {
    const editor = this.editor;
    editor.ui.componentFactory.add('UsaRow', (local) => {
      const dropdownView = new delegated_uifrom_dll_reference_CKEditor5.createDropdown(local);

      dropdownView.buttonView.set({
          label: editor.t('Row Settings'),
          icon: table_row,
          tooltip: true,
          withText: false,
      });
      const items = new delegated_utilsfrom_dll_reference_CKEditor5.Collection();
      const addItems = ( label, id, src ) => {
        items.add({
          type: 'button',
          model: new delegated_uifrom_dll_reference_CKEditor5.ViewModel({
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

      (0,delegated_uifrom_dll_reference_CKEditor5.addListToDropdown)(dropdownView, items);

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

;// ./icons/table-column.svg
/* harmony default export */ const table_column = ("<svg viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M2.5 1h15A1.5 1.5 0 0 1 19 2.5v15a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 1 17.5v-15A1.5 1.5 0 0 1 2.5 1zM2 2v16h16V2H2z\" opacity=\".6\"/><path d=\"M18 7v1H2V7h16zm0 5v1H2v-1h16z\" opacity=\".6\"/><path d=\"M14 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1zm-2 1H8v4h4V2zm0 6H8v4h4V8zm0 6H8v4h4v-4z\"/></svg>");
;// ./js/ckeditor5_plugins/tables/src/ui/columnui.js





class UsaColumnui extends delegated_corefrom_dll_reference_CKEditor5.Plugin {
  init() {
    const editor = this.editor;
    editor.ui.componentFactory.add('UsaColumn', (local) => {
      const dropdownView = new delegated_uifrom_dll_reference_CKEditor5.createDropdown(local);

      dropdownView.buttonView.set({
          label: editor.t('Column Settings'),
          icon: table_column,
          tooltip: true,
          withText: false,
      });
      const items = new delegated_utilsfrom_dll_reference_CKEditor5.Collection();
      const addItems = ( label, id, src ) => {
        items.add({
          type: 'button',
          model: new delegated_uifrom_dll_reference_CKEditor5.ViewModel({
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

      (0,delegated_uifrom_dll_reference_CKEditor5.addListToDropdown)(dropdownView, items);

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

;// ./js/ckeditor5_plugins/tables/src/ui/tablesAdvancedui.js







class TablesAdvancedui extends delegated_corefrom_dll_reference_CKEditor5.Plugin {
  static get requires() {
    return [delegated_uifrom_dll_reference_CKEditor5.ContextualBalloon];
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

    this._balloon = editor.plugins.get(delegated_uifrom_dll_reference_CKEditor5.ContextualBalloon);
    this.formView = this._createFormView();

    editor.ui.componentFactory.add('TablesAdvanced', (local) => {
      const buttonView = new delegated_uifrom_dll_reference_CKEditor5.ButtonView(local);
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
    const formView = new AdvancedTableFormView(editor.locale);

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
    (0,delegated_uifrom_dll_reference_CKEditor5.clickOutsideHandler)({
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


;// ./js/ckeditor5_plugins/tables/src/tablesAdvanced.js




class TablesAdvanced extends delegated_corefrom_dll_reference_CKEditor5.Plugin {
  static get requires() {
    return [EditingTable, TablesAdvancedui];
  }
}

;// ./icons/delete-table.svg
/* harmony default export */ const delete_table = ("<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24px\" viewBox=\"0 -960 960 960\" width=\"24px\" fill=\"#000000\"><path d=\"M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z\"/></svg>");
;// ./js/ckeditor5_plugins/tables/src/ui/deletetable.js






class Deletetable extends delegated_corefrom_dll_reference_CKEditor5.Plugin {
  init() {
    const editor = this.editor;
    editor.ui.componentFactory.add('Deletetable', (local) => {
      const dropdownView = new delegated_uifrom_dll_reference_CKEditor5.createDropdown(local);

      dropdownView.buttonView.set({
          label: editor.t('Delete Table'),
          icon: delete_table,
          tooltip: true,
          withText: false,
      });
      const items = new delegated_utilsfrom_dll_reference_CKEditor5.Collection();
      items.add({
        type: 'button',
        model: new delegated_uifrom_dll_reference_CKEditor5.ViewModel({
          withText: true,
          label: 'Delete Table',
          id: 'delete-table',
        }),
      });

      (0,delegated_uifrom_dll_reference_CKEditor5.addListToDropdown)(dropdownView, items);
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

;// ./js/ckeditor5_plugins/tables/src/index.js






/* harmony default export */ const src = ({
  Tables: Tables,
  UsaRow: UsaRowui,
  UsaColumn: UsaColumnui,
  TablesAdvanced: TablesAdvanced,
  Deletetable: Deletetable,
});

})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});