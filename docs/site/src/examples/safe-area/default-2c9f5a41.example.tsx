import { SafeArea } from "@hustradio/unitary-ui";

/**
 * SafeArea —— 安全区边距容器：内边距取「间距档」与设备安全区 env() 的较大值，
 * 内容因此不会被圆角、刘海或系统栏遮挡。
 */
export function SafeAreaDefault2C9F5A41Example() {
  return (
    <SafeArea
      edges={["top", "bottom"]}
      padding="md"
      className="w-full rounded-lg bg-gray-alpha-100"
    >
      <div className="rounded-md bg-background p-3 text-copy-13 text-gray-1000">
        Content stays clear of rounded corners, notches, and system bars.
      </div>
    </SafeArea>
  );
}
