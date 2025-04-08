import { Command } from 'ckeditor5/src/core';
import {
  getSelectionAffectedTable,
} from '@ckeditor/ckeditor5-table/src/utils/common';

export default class PropertiesCommand extends Command {
  constructor( editor, attributeName ) {
    super( editor );

    this.attributeName = attributeName;
  }

  /**
   * @inheritDoc
   */
  refresh() {
    const { model } = this.editor;
    const selection = model.document.selection;
    const table = getSelectionAffectedTable(selection);
    this.isEnabled = !!table;

    this.isEnabled = true;
  }
  execute({ row, col, summary, style, header, border, stripes, id, width, height,source }) {
    const editor = this.editor;
    const selection = editor.model.document.selection;
    const selectedElement = selection.getSelectedElement();

    var table = getSelectionAffectedTable(selection);
    this.isEnabled = !!table;

    editor.model.change(writer => {
      this.writer = writer;
      // New table added
      if (!table) {
        let options = { rows: row, columns: col };
        if (header && header == 'both') {
          options = { rows: row, columns: col, headingRows: 1, headingColumns: 1 }
        } else if (header && header == 'first_row') {
          options = { rows: row, columns: col, headingRows: 1 }
        } else if (header && header == 'first_column') {
          options = { rows: row, columns: col, headingColumns: 1 }
        }
        // No table exists so we insert a new table
        editor.execute('insertTable', options);
        table = getSelectionAffectedTable(selection);

        // ??
        writer.setAttribute('tableWidth', '100%', table);

      }

      // Only update advanced search values
      if (source == 'advanced') {
        if (id) {
          writer.setAttribute('tableId', id, table);
        }else{
          writer.setAttribute('tableId', null, table);
        }
        if (width) {
          editor.execute('tableWidth', { value: width });
        }else{
          editor.execute('tableWidth', { value: null });
        }
        if (height) {
          editor.execute('tableHeight', { value: height });
        }else{
          editor.execute('tableHeight', { value: null });
        }
      }
      else {


        //Non default styles.
        let styleOptions = [
          'tableScrollable',
          'tableVerticalScrollable',
          'tableCompactScrollable',
          'tableSortable',
          'tableWithSearch',
          'tableStacked'
        ];

        // Set default always
        writer.setAttribute('defaultTable', true, table);
        if (style ) {
          // Set attribute received
          // remove the style attribute if already set.
          styleOptions.forEach((option) => writer.removeAttribute(option, table));
          if(style != 'defaultTable') {
            writer.setAttribute(style, true, table);
          }
        }

        if (stripes) {
          // Set attribute received
          writer.setAttribute('tableStriped', true, table);
        } else {
          writer.removeAttribute('tableStriped', table)
        }

        if (border) {
          writer.setAttribute('tableBorderless', true, table);
        } else {
          writer.removeAttribute('tableBorderless', table)
        }

        if (summary) {
          writer.setAttribute('tableSummary', summary, table);
        }else{
          writer.removeAttribute('tableSummary', table)
        }

        let headingRows;
        if (table.getAttribute('headingRows')) {headingRows = table.getAttribute('headingRows');} else {headingRows = 0;}
        let headingColumns;
        if (table.getAttribute('headingColumns')) {headingColumns = table.getAttribute('headingColumns');} else {headingColumns = 0;}

        // Define cell selection for headers
        if (header == 'both') {
          if (!headingColumns) {
            writer.setAttribute('headingColumns', true, table);
          }
          if (!headingRows) {
            writer.setAttribute('headingRows', true, table);
          }
        } else if (headingRows && headingColumns && header != 'both') {
          if (header == 'first_row') {
            writer.setAttribute('headingColumns', 0, table);
            writer.setAttribute('headingRows', true, table);
          }
          if (header == 'first_column') {
            writer.setAttribute('headingRows', 0, table);
            writer.setAttribute('headingColumns', true, table);
          }
        } else if (!headingRows && header == 'first_row') {
            writer.setAttribute('headingRows', true, table);
          if (headingColumns) {
            writer.setAttribute('headingColumns', 0, table);
          }
        } else if (!headingColumns && header == 'first_column') {
            writer.setAttribute('headingColumns', true, table);
          if (headingRows) {
            writer.setAttribute('headingRows', 0, table);
          }
        }
      }



      // Scope logic.
      if (header == 'first_row') {
        this.setHeaderRowScope(table);
      } else if(header == 'first_column') {
        this.setHeaderColumnScope(table, header);
      } else if (header == 'both') {
        this.setHeaderRowScope(table);
        this.setHeaderColumnScope(table, header);
      }
    });
  }
  setHeaderRowScope (table) {
    const tableElement = table.getChild(0);
    // Iterate over the rows of the table.
    [...tableElement.getChildren()].forEach((cell) => {
      // Check if the cell is a <th> element
      if (cell.name === 'tableCell') {
        // Add or update attributes of the <th> element
        this.writer.setAttribute('scope', 'col', cell);
      }
    });
  }
  removeHeaderRowScope(table) {
    const tableElement = table.getChild(0);
    // Iterate over the rows of the table
    [...tableElement.getChildren()].forEach(cell => {
      // Check if the cell is a <th> element
      if (cell.name === 'tableCell') {
        // Add or update attributes of the <th> element
        this.writer.removeAttribute('scope', cell);
      }
    });
  }
  setHeaderColumnScope(table, header) {
    [...table.getChildren()].forEach((row, index) => {
      // Skip adding scope = row if header type both.
      // Get the first cell of each row
      if (header == 'both' && index == 0) {
        return;
      }
      const firstCell = row.getChild(0);

      // Check if the cell exists and is a table cell (not a table header cell)
      if (firstCell && firstCell.name === 'tableCell') {
        // Set attribute for the first cell
        this.writer.setAttribute('scope', 'row', firstCell);
      }
    });
  }
  removeHeaderColumnScope(table) {
    [...table.getChildren()].forEach(row => {
      // Get the first cell of each row
      const firstCell = row.getChild(0);

      // Check if the cell exists and is a table cell (not a table header cell)
      if (firstCell && firstCell.name === 'tableCell') {
        // Set attribute for the first cell
        this.writer.removeAttribute('scope', firstCell);
      }
    });
  }
}
function haveSameTableParent(cellA, cellB) {
  return cellA.parent.parent == cellB.parent.parent;
}
