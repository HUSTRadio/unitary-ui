import { Menu, MenuButton, MenuContainer, MenuItem } from "@hustradio/unitary-ui";

export function MenuWithChevron2CC766B6Example() {
  return (
    <MenuContainer>
      <MenuButton showChevron variant="secondary">
        Actions
      </MenuButton>
      <Menu width={200}>
        <MenuItem onClick={() => undefined}>One</MenuItem>
        <MenuItem onClick={() => undefined}>Two</MenuItem>
        <MenuItem onClick={() => undefined}>Three</MenuItem>
        <MenuItem href="https://example.com">Test for Link</MenuItem>
        <MenuItem onClick={() => undefined} type="error">
          Delete
        </MenuItem>
      </Menu>
    </MenuContainer>
  );
}
