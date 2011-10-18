/**
 * Container for all trees.
 */
Ext.define('Docs.view.TreeContainer', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.treecontainer',
    requires: [
        'Docs.view.cls.Tree',
        'Docs.view.guides.Tree',
        'Docs.view.GroupTree'
    ],

    cls: 'iScroll',
    layout: 'card',
    resizable: true,
    resizeHandles: 'e',
    collapsible: true,
    hideCollapseTool: true,
    animCollapse: true,

    initComponent: function() {
        this.items = [
            {
                // An empty item that's initially activated.
                // We don't want to activate any of the trees when
                // they are hidden, as that will cause the scrollbar
                // to render improperly (or rather, not render at all)
            },
            {
                xtype: 'classtree',
                id: 'classtree',
                data: Docs.data.classes
            },
            {
                xtype: 'grouptree',
                id: 'exampletree',
                data: Docs.data.examples,
                convert: function(example) {
                    return {
                        leaf: true,
                        text: example.text,
                        url: '#!/example/' + example.url,
                        iconCls: 'icon-example'
                    };
                }
            },
            {
                xtype: 'guidetree',
                id: 'guidetree',
                data: Docs.data.guides,
                convert: function(guide) {
                    return {
                        leaf: true,
                        text: guide.title[this.language],
                        url: '#!/guide/' + this.language + "/" + guide.name,
                        iconCls: 'icon-guide'
                    };
                }
            },
            {
                xtype: 'grouptree',
                id: 'videotree',
                data: Docs.data.videos,
                convert: function(video) {
                    return {
                        leaf: true,
                        text: video.title,
                        url: '#!/video/' + video.id,
                        iconCls: 'icon-video'
                    };
                }
            }
        ];

        this.callParent();
    },

    /**
     * Shows the particular tree.
     *
     * @param {String} id  The id of the tree.
     */
    showTree: function(id) {
        this.show();
        this.layout.setActiveItem(id);
    }

});
