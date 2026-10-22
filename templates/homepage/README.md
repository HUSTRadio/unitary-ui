# homepage

[English](./README.en.md)

独立双语动态消费者模板。完整的复制方式、源码模式与包模式说明见[模板指南](../README.md)。

在仓库根目录启动：

```sh
pnpm --filter @hustradio/unitary-template-homepage dev:source
```

复制到仓库外后，将库依赖改为 `beta`，再执行：

```sh
pnpm install
pnpm dev
pnpm run typecheck
pnpm run build
pnpm preview
```

只复制本目录即可；源码模式配置可删除。业务操作使用本地示例数据。
