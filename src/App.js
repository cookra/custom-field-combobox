 Ext.define('CustomApp', {
                extend: 'Rally.app.App',
                componentCls: 'app',
            
                items: [
                    {
                        xtype: 'container',
                        itemId: 'kbFilter'
                    },
                    {
                        xtype: 'container',
                        itemId: 'grid',
                        width: 800
                    }
                ],
            
                launch: function() {
                    this.down('#kbFilter').add({
                        xtype: 'checkbox',
                        cls: 'filter',
                        boxLabel: 'Filter table by custom field',
                        id: 'kbCheckbox',
                        scope: this,
                        handler: this._onSettingsChange
                    });
            
                    this.down('#kbFilter').add({
                        xtype: 'rallyattributecombobox',
                        cls: 'filter',
                        model: 'Defect',
                        field: 'MyKB',                                    //c_myKB does not work
                        listeners: {
                            ready: this._onKBComboBoxLoad,
                            select: this._onKBComboBoxSelect,
                            scope: this
                        }
                    });
                },
            
            
                _onKBComboBoxLoad: function(comboBox) {
                    this.kbComboBox = comboBox;
            
                    Rally.data.ModelFactory.getModel({
                        type: 'Defect',
                        success: this._onModelRetrieved,
                        scope: this
                    });
                },
            
                _getFilter: function() {
                    var filter = [];
            
                    if (Ext.getCmp('kbCheckbox').getValue()) {
                        filter.push({
                            property: 'MyKB',                                 //my_KB does not work
                            operator: '=',
                            value: this.kbComboBox.getValue()
                        });
                    }
                    return filter;
                },
            
                _onKBComboBoxSelect: function() {
                    if (Ext.getCmp('kbCheckbox').getValue()) {
                        this._onSettingsChange();
                    }
                },
                _onSettingsChange: function() {
                    this.grid.filter(this._getFilter(), true, true);
                },
            
                _onModelRetrieved: function(model) {
                    this.grid = this.down('#grid').add({
                        xtype: 'rallygrid',
                        model: model,
                        columnCfgs: [
                            'FormattedID',
                            'Name',
                            'MyKB'                 // c_myKB does not work
                        ],
                        storeConfig: {
                            context: this.context.getDataContext(),
                            filters: this._getFilter()
                        },
                        showPagingToolbar: false
                    });
                }
            });