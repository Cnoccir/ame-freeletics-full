import { withPluginApi } from 'discourse/lib/plugin-api';

export default {
    name: 'ame-brand-header',

    initialize() {
        withPluginApi('0.8.7', api => {
            api.decorateWidget('home-page:after', helper => {
                const showBrandHeader = helper.attrs.showBrandHeader;
                if (showBrandHeader) {
                    return helper.attach('ame-brand-header');
                }
            });
        });
    }
};