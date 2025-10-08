import Component from "@glimmer/component";
import { inject as service } from "@ember/service";

export default class AmeHero extends Component {
  @service router;

  get showBrandHeader() {
    return this.router.currentRouteName === "discovery.categories";
  }
}
