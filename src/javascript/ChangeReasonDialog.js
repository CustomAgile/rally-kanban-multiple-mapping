
/**
 * A dialog that displays a drop-down for choosing a value
 *
 *     @example
 *     Ext.create('Rally.ui.dialog.ChangeReasonDialog', {
 *         artifactTypes: ['userstory', 'portfolioitem/feature'],
 *         autoShow: true,
 *         model: 'User Story',
 *         dropdownField: 'c_myfield',
 *         height: 250,
 *         title: 'Pick me',
 *         listeners: {
 *             valuechosen: function(dialog, selectedValue){
 *                 Ext.Msg.alert('Chooser', selectedValue + ' was chosen');
 *             },
 *             scope: this
 *         }
 *      });
 */
Ext.define('Rally.ui.dialog.ChangeReasonDialog', {
    requires: [
        'Ext.data.Store',
        'Rally.data.ModelFactory',
        'Rally.data.wsapi.Filter',
        'Rally.ui.Button',
        'Rally.ui.EmptyTextFactory',
        'Rally.ui.grid.Grid',
        'Rally.ui.selection.CheckboxModel',
        'Rally.util.Ref'
    ],
    extend: 'Rally.ui.dialog.Dialog',
    alias: 'widget.tschangereasondialog',

    height: 150,
    width: 200,
    /*layout: 'fit',*/
    closable: false,
    draggable: true,

    config: {
        /**
         * @cfg {String}
         * Title to give to the dialog
         */
        title: '',

        model: 'User Story',
        dropdownField: 'ScheduleState',

        /**
         * @cfg {String}
         * Text to be displayed on the button when selection is complete
         */
        selectionButtonText: 'Choose'

    },

    constructor: function(config) {
        this.mergeConfig(config);

        this.callParent([this.config]);
    },

    selectionCache: [],

    initComponent: function() {
        this.callParent(arguments);

        this.addEvents(
            /**
             * @event valuechosen
             * Fires when user clicks done after choosing
             * @param {Rally.ui.dialog.ChangeReasonDialog} source the dialog
             * @param {String} selected value from dropdown
             */
            'valuechosen'
        );

        //this.addCls(['chooserDialog', 'chooser-dialog']);
    },

    destroy: function() {
        this.callParent(arguments);
    },

    beforeRender: function() {
        this.callParent(arguments);
        
        this.addDocked({
            xtype: 'toolbar',
            dock: 'bottom',
            padding: '0 0 10 0',
            layout: {
                type: 'hbox',
                pack: 'center'
            },
            ui: 'footer',
            items: [
                {
                    xtype: 'rallybutton',
                    itemId: 'doneButton',
                    text: this.selectionButtonText,
                    cls: 'primary rly-small',
                    scope: this,
                    disabled: true,
                    userAction: 'clicked done in dialog',
                    handler: function() {
                        this.fireEvent('valuechosen', this, this.getValue());
                        this.close();
                    }
                }/*,
                {
                    xtype: 'rallybutton',
                    text: 'Cancel',
                    cls: 'secondary rly-small',
                    handler: this.close,
                    scope: this,
                    ui: 'link'
                }*/
            ]
        });

        if (this.introText) {
            this.addDocked({
                xtype: 'component',
                componentCls: 'intro-panel',
                html: this.introText
            });
        }

        this.buildDropdown();
    },



    buildDropdown: function() {
        if (this.dropdown) {
            this.dropdown.destroy();
        }

        this.dropdown = Ext.create('Rally.ui.combobox.FieldValueComboBox',{
            fieldLabel: 'Reason for Column Change:',
            labelAlign: 'top',
            model: this.model,
            field: this.dropdownField ,
            padding: 10
        });
        
        this.add(this.dropdown);
        this._enableDoneButton();
    },

    getValue: function() {
        return this.dropdown.getValue();
    },
    
    _enableDoneButton: function() {
        this.down('#doneButton').setDisabled(false);
    }

});