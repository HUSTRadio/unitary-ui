import { Menu, MenuButton, MenuContainer, MenuItem } from "@hustradio/unitary-ui";
import { Avatar } from "@hustradio/unitary-ui";

export function MenuCustomTrigger74C52681Example() {
  return (
    <MenuContainer>
      <MenuButton variant="unstyled">
        <Avatar size={30} username="evilrabbit" />
      </MenuButton>
      <Menu width={200}>
        <MenuItem>One</MenuItem>
        <MenuItem>Two</MenuItem>
        <MenuItem>Three</MenuItem>
      </Menu>
    </MenuContainer>
  );
}
