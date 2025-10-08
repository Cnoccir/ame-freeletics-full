import { h } from 'virtual-dom';
import { withPluginApi } from 'discourse/lib/plugin-api';

export default {
    name: 'ame-hero-initializer',
    initialize() {
        withPluginApi('0.8.7', api => {
            api.reopenWidget('home-page', {
                pluginOutlet() {
                    return h('div.ame-hero-outlet', h('AmeHero', { showBrandHeader: this.attrs.showBrandHeader }));
                }
            });
        });
    }
};