import * as React from "react";

import { type DeviceColor } from "@/lib/device-models";
import { Device, type DeviceProps, type DeviceScreenProps, DeviceScreen } from "./device";
import type { PhoneSafariOptions, PhoneStatusBarOptions } from "./device";

/**
 * Phone — 已废弃别名（item 19）。
 *
 * @deprecated 使用通用 `<Device model="iphone-17">` 替代。Phone 为
 *   `model="iphone-17"` 的便捷别名，双轨过渡期内保留（下一 major 移除）。
 *   新设备（Android/iPad/笔记本）请直接使用 `<Device model="…">`。
 */

/** @deprecated 使用 DeviceColor<"iphone-17"> 或直接写字面量联合 */
export type IPhone17Color = DeviceColor<"iphone-17">;

/** @deprecated 使用 DeviceProps<"iphone-17">（或省略 model 的别名形式） */
export interface PhoneProps extends Omit<DeviceProps<"iphone-17">, "model"> {}

/** @deprecated 使用 DeviceScreenProps */
export type PhoneScreenProps = DeviceScreenProps;

const Phone = React.forwardRef<HTMLDivElement, PhoneProps>((props, ref) => (
  <Device {...props} model="iphone-17" ref={ref} />
));
Phone.displayName = "Phone";

export {
  Phone,
  DeviceScreen as PhoneScreen,
  type PhoneStatusBarOptions,
  type PhoneSafariOptions,
};
