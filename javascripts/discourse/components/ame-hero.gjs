import Component from '@glimmer/component';

export default class AmeHero extends Component {
    get showBrandHeader() {
        return this.args.showBrandHeader;
    }
}