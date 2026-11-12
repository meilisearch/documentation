import { mount } from "./mount";

declare global {
  interface Window {
    MeiliChat?: { mount: typeof mount };
  }
}

window.MeiliChat = { mount };

export { mount };
