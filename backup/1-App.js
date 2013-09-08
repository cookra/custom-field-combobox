 Ext.define('CustomApp', {
                extend: 'Rally.app.App',
                componentCls: 'app',
            
                items: [
                    {
                        xtype: 'container',
                        itemId: 'priorityFilter'
                    },
                    {
                        xtype: 'container',
                        itemId: 'grid',
                        width: 800
                    }
                ],
            
                launch: function() {
                    this.down('#priorityFilter').add({
                        xtype: 'checkbox',
                        cls: 'filter',
                        boxLabel: 'Filter table by priority',
                        id: 'priorityCheckbox',
                        scope: this,
                        handler: this._onSettingsChange
                    });
            
                    this.down('#priorityFilter').add({
                        xtype: 'rallyattributecombobox',
                        cls: 'filter',
                        model: 'Defect',
                        field: 'Priority',
                        listeners: {
                            ready: this._onPriorityComboBoxLoad,
                            select: this._onPriorityComboBoxSelect,
                            scope: this
                        }
                    });
                },
            
             /*  _onPriorityComboBoxLoad: function(comboBox) {
                    this.priorityComboBox = comboBox;
            
                    this.down('#severityFilter').add({
                        xtype: 'checkbox',
                        cls: 'filter',
                        boxLabel: 'Filter table by severity',
                        id: 'severityCheckbox',
                        scope: this,
                        handler: this._onSettingsChange
                    });
            
                    this.down('#severityFilter').add({
                        xtype: 'rallyattributecombobox',
                        cls: 'filter',
                        model: 'Defect',
                        field: 'Severity',
                        listeners: {
                            ready: this._onSeverityComboBoxLoad,
                            select: this._onSeverityComboBoxSelect,
                            scope: this
                        }
                    });
                },*/
            
                _onPriorityComboBoxLoad: function(comboBox) {
                    this.priorityComboBox = comboBox;
            
                    Rally.data.ModelFactory.getModel({
                        type: 'Defect',
                        success: this._onModelRetrieved,
                        scope: this
                    });
                },
            
                _getFilter: function() {
                    var filter = [];
            
                    if (Ext.getCmp('priorityCheckbox').getValue()) {
                        filter.push({
                            property: 'Priority',
                            operator: '=',
                            value: this.priorityComboBox.getValue()
                        });
                    }
            /*
                    if (Ext.getCmp('severityCheckbox').getValue()) {
                        filter.push({
                            property: 'Severity',
                            operator: '=',
                            value: this.severityComboBox.getValue()
                        });
                    }*/
            
                    return filter;
                },
            
                _onPriorityComboBoxSelect: function() {
                    if (Ext.getCmp('priorityCheckbox').getValue()) {
                        this._onSettingsChange();
                    }
                },
            /*
                _onSeverityComboBoxSelect: function() {
                    if (Ext.getCmp('severityCheckbox').getValue()) {
                        this._onSettingsChange();
                    }
                },
            */
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
                            'Priority',
                            'Severity'
                        ],
                        storeConfig: {
                            context: this.context.getDataContext(),
                            filters: this._getFilter()
                        },
                        showPagingToolbar: false
                    });
                }
            });