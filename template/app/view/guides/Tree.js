/**
 * Tree for guides.
 */
Ext.define('Docs.view.guides.Tree', {
	extend: 'Docs.view.GroupTree',
	alias: 'widget.guidetree',
	
	initComponent: function() {
		this.dockedItems = [{
			xtype: 'container',
			dock: 'bottom',
			cls: 'cls-lang',
			html: [
				'<button class="lang-en x-button-icon selected"><img src="resources/images/en.png"/></button>',
				'<button class="lang-zh x-button-icon"><img src="resources/images/zh.png"/></button>'
			].join('')
		}];
		this.callParent();
	}	
});
