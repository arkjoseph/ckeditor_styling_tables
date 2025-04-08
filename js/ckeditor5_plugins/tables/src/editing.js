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

      /*
      // Some tables need more html so check for that

        editor.conversion.for('downcast').add(dispatcher => {
          dispatcher.on(val, (evt, data, conversionApi) => {
            if (data.item.name === 'table') {

              if(data.item.parent && data.item.parent.name == 'htmlDiv') {
                let tmp = data.item.parent.getAttribute('htmlDivAttributes');
                if (tableClass.id === 'tableScrollable' || tableClass.id === 'tableCompactScrollable') {
                 // if (!tmp.classes.includes("usa-table-container--scrollable")) {
                    // Add class
                    tmp.classes = ['usa-table-container--scrollable'];
                    data.item.parent._setAttribute('htmlDivAttributes', tmp);
                //  }
                  evt.stop();
                }else{
                  // Remove class.
                  tmp.classes = [];
                 // data.item.parent._setAttribute('htmlDivAttributes', tmp);
                  evt.stop();
                }

              }
              else{
                const viewElement = conversionApi.mapper.toViewElement(data.item);
                const { writer, mapper } = conversionApi;

                // Translate the position in the model to a position in the view.
                const viewPosition = mapper.toViewPosition(data.range.start);

                // Create a <div> element that will be inserted into the view at
                // the `viewPosition`.
                let div;
                if (tableClass.id === 'tableScrollable' || tableClass.id === 'tableCompactScrollable') {
                   div = writer.createContainerElement('div', { class: 'usa-table-container--scrollable' });
                }else{
                   div = writer.createContainerElement('div', {  });
                }

                // Create the <div> element that will be inserted into the div
                writer.insert(writer.createPositionAt(div, 0), viewElement);

                // Add the newly created view element to the view.
                writer.insert(viewPosition, div);
                evt.stop();
              }
            }
          });
        });

        */
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
