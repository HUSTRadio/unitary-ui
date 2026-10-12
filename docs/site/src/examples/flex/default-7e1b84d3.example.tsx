import { Flex } from "@hustradio/unitary-ui";

/**
 * Flex —— 方向 + 间距堆叠：语义化的 flex 预设，统一间距档，避免随机 gap 值。
 */
export function FlexDefault7E1B84D3Example() {
  return (
    <Flex direction="column" gap="md" className="w-full">
      <Flex direction="row" gap="sm" align="center">
        <span aria-hidden="true" className="size-8 rounded-md bg-gray-alpha-400" />
        <span className="text-copy-13 text-gray-1000">Row group, centered</span>
      </Flex>
      <Flex direction="row" gap="sm" justify="between">
        <span className="text-copy-13 text-gray-1000">Left</span>
        <span className="text-copy-13 text-gray-900">Right</span>
      </Flex>
    </Flex>
  );
}
