/**
 * Menu shown by {@link Docs.view.HoverMenuButton}.
 */
Ext.define('Docs.view.HoverMenu', {
    extend: 'Ext.view.View',

    alias: 'widget.hovermenu',
    componentCls: 'hover-menu',
    itemSelector: 'div.item',
    deferEmptyText: false,

    /**
     * @cfg {Number} colHeight  maximum number of items in one column.
     * When more than that, items are placed into multiple columns.
     * Defaults to 25 (current maximum length of history).
     */
    columnHeight: 25,
    /**
     * @cfg {Boolean} showCloseButtons  true to show "x" after each menu item.
     * Defaults to false.
     */
    showCloseButtons: false,

    initComponent: function() {
        this.renderTo = Ext.getBody();

        this.tpl = new Ext.XTemplate(
            '<table>',
            '<tr>',
                '<td>',
                '<tpl for=".">',
                    '<div class="item">',
                        '{[this.renderLink(values)]}',
                        '<tpl if="this.showCloseButtons">',
                            '<a class="close" href="#" rel="{cls}">x</a>',
                        '</tpl>',
                    '</div>',
                    // Start new column when columnHeight reached
                    '<tpl if="xindex % this.columnHeight === 0 && xcount &gt; xindex">',
                        '</td><td>',
                    '</tpl>',
                '</tpl>',
                '</td>',
            '</tr>',
            '</table>',
            {
                columnHeight: this.columnHeight,
                showCloseButtons: this.showCloseButtons,
                renderLink: function(values) {
                    var url = values.url || values.cls;
                    var label = values.label || values.cls;
                    var tags = Ext.Array.map(['static', 'protected', 'deprecated', 'template', 'required'], function(tag) {
                        return values[tag] ? '<span class="'+tag+'">'+tag+'</span>' : '';
                    }).join(' ');
                    return Ext.String.format('<a href="#!/api/{0}" rel="{0}" class="docClass">{1} {2}</a>', url, label, tags);
                }
            }
        );

        this.callParent();
    }
});
