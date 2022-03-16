/*
 * overrides to allow for editing empty fields on the card
 * 
 */
 Ext.override(Rally.ui.renderer.template.LabeledFieldTemplate, {
    apply: function(values) {
        var valueStr = this.valueTemplate.apply(values);
        if (valueStr.length < 1) {
            valueStr = "--";
            //return valueStr;
        }

        var renderedValue = [
            '<div class="rui-field-value">',
            valueStr,
            '</div>'
        ];

        if (this.fieldLabel) {
            renderedValue = [
                '<span class="rui-field-label">',
                Ext.htmlEncode(this.fieldLabel),
                ':</span>'
            ].concat(renderedValue);
        }

        return renderedValue.join('');
    }
});

Ext.override(Rally.ui.cardboard.plugin.CardContentLeft,{

    _getRenderTpl: function(fieldDefinition) {
        var card = this.card,
            modelField = card.getRecord().getField(fieldDefinition.name),
            hasData = true /*(Ext.isFunction(fieldDefinition.hasValue) && fieldDefinition.hasValue()) || card.getRecord().hasValue(modelField)*/,
            isRenderable = hasData || (modelField && modelField.isCollection());

            
        if (modelField && modelField.isHidden) {
            return null;
        }

        if (!isRenderable) {
            return null;
        }

        if (!fieldDefinition.renderTpl && modelField) {
            return Rally.ui.cardboard.CardRendererFactory.getRenderTemplate(modelField);
        }

        return fieldDefinition.renderTpl;
    },

    _hasData: function(card,fieldDefinition) {
        var record = card.getRecord();
        var modelField = card.getRecord().getField(fieldDefinition.name);

        return (Ext.isFunction(fieldDefinition.hasValue) && fieldDefinition.hasValue()) 
            || record.hasValue(modelField)
            || ( record.get("Summary")[fieldDefinition.name] && record.get("Summary")[fieldDefinition.name].Count > 0 ) // collections;
    },
    
    _getFieldHtml: function(fieldDefinition) {
        var html = '',
            cls = '',
            typeCls = '',
            tpl = this._getRenderTpl(fieldDefinition);

        if (tpl) {
            var card = this.card;
            html = tpl.apply(card.getRecord().data);
            // 
            
            
            // don't show collections unless there's a value
            var modelField = card.getRecord().getField(fieldDefinition.name);
            var hasData = this._hasData(card,fieldDefinition);
            
            if ( modelField && modelField.isCollection() && !hasData ) {
                return '';
            }
            
            if (html) {
                cls = this._isStatusField(fieldDefinition) ? 'status-field ' : '';

                var field = this.card.getRecord().self.getField(fieldDefinition.name);
                if (field && field.attributeDefinition) {
                    typeCls = ' type-' + field.attributeDefinition.AttributeType.toLowerCase();
                }
                html = '<div class="field-content ' + cls + fieldDefinition.name + typeCls + '">' + html + '</div>';
            }
        }

        return html;
    }

});
