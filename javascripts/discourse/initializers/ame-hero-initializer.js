import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "ame-hero-initializer",
  initialize() {
    withPluginApi("0.8.7", (api) => {
      api.renderInOutlet("above-main-container", "ame-hero");
    });
  },
};
