/**
 * Container for guides listing.
 */
Ext.define('Docs.view.guides.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.guideindex',
    requires: [
        'Docs.view.ThumbList'
    ],

    cls: 'all-demos iScroll',
    margin: '10 0 0 0',
    autoScroll: true,

    initComponent: function() {
        this.items = [
            { xtype: 'container', html: '<h1 class="eg">Guides</h1>' },
            Ext.create('Docs.view.ThumbList', {
                itemTpl: [
                    '<dd ext:url="#!/guide/en/{name}"><img src="guides/{name}/icon-lg.png"/>',
                        '<div><h4>{title.en}</h4><p>{description.en}</p></div>',
                    '</dd>'
                ],
                data: Docs.data.guides
            })
        ];

        this.callParent(arguments);
    },

    /**
     * Returns tab config for guides page.
     * @return {Object}
     */
    getTab: function() {
        return Docs.data.guides.length > 0 ? {cls: 'guides', href: '#!/guide', tooltip: 'Guides'} : false;
    }
});
