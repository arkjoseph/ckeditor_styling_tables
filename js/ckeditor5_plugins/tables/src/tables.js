import { Plugin } from 'ckeditor5/src/core';
import EditingTable from './editing';
import TablesUi from './ui/ui';

export default class Tables extends Plugin {
  static get requires() {
    return [EditingTable, TablesUi];
  }
}
