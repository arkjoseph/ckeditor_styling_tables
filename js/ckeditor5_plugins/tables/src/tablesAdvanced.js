import { Plugin } from 'ckeditor5/src/core';
import EditingTable from './editing';
import TablesAdvancedui from './ui/tablesAdvancedui';

export default class TablesAdvanced extends Plugin {
  static get requires() {
    return [EditingTable, TablesAdvancedui];
  }
}
