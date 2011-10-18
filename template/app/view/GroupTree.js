/**
 * A tree for guides/videos/examples.
 *
 * Each of these has similar dataset that consists of groups.
 * Only the actual items (that are grouped) differ.
 * This class applies a conversion function for each item.
 */
Ext.define('Docs.view.GroupTree', {
    extend: 'Docs.view.DocTree',
    alias: 'widget.grouptree',
	language: 'en',
	
    /**
     * @cfg {Object[]} data (required)
     * An array of guoups. Each group is object with properties:
     * @cfg {String} title
     * @cfg {Object[]} items
     */

    /**
     * @cfg {Function} convert (required)
     * A function that converts items to tree nodes
     * @cfg {Object} convert.item The item to convert
     * @cfg {Object} convert.return The treenode config
     */

    initComponent: function() {
        this.root = this.createTree();
        this.callParent();
    },
    
    setLanguage: function(lang) {
    	this.language = lang;
    	var root = this.createTree();
		this.setRootNode(root);
		this.initNodeLinks();

		// expand first child
		this.getRootNode().getChildAt(0).expand();
    },
    
    createTree: function() {
    	var root = {
    		children: [],
    		text: 'Root'
    	};
        Ext.Array.each(this.data, function(group) {
            root.children.push({
                text: group.title,
                children: Ext.Array.map(group.items, this.convert, this),
                iconCls: 'icon-pkg'
            });
        }, this);
        return root;
    }
});
