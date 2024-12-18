/// <reference types="@dcloudio/types" />

declare module '@dcloudio/uni-app' {
  type PageURIString = string;

  interface NavigateToOptions {
    url: string | PageURIString;
  }

  interface SwitchTabOptions {
    url: string | PageURIString;
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    uni: typeof uni;
  }
}
