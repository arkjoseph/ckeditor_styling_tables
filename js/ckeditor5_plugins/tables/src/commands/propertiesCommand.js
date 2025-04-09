import { Command } from 'ckeditor5/src/core';
import {
  getSelectionAffectedTable,
} from '@ckeditor/ckeditor5-table/src/utils/common';

/**
 * Command responsible for handling table properties in the editor.
 * This includes both basic properties (style, headers, etc.) and advanced
 * properties (ID, dimensions, etc.)
 */
export default class PropertiesCommand extends Command {
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
