import {Plugin} from 'ckeditor5/src/core';
import PropertiesCommand from './commands/propertiesCommand';

export default class EditingTable extends Plugin {
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
