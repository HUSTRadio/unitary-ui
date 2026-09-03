import {
  Menu,
  MenuButton,
  MenuContainer,
  MenuDivider,
  MenuItem,
  MenuItemLocked,
  MenuSection,
} from "@/components/ui/menu";

export function MenuWithSection5563D2A4Example() {
  return (
    <MenuContainer>
      <MenuButton>Actions</MenuButton>
      <Menu width={200}>
        <MenuSection title="Section">
          <MenuItem onClick={() => undefined}>One</MenuItem>
          <MenuItem onClick={() => undefined}>Two</MenuItem>
        </MenuSection>
        <MenuItem onClick={() => undefined}>Three</MenuItem>
        <MenuItemLocked onClick={() => undefined}>Locked</MenuItemLocked>
        <MenuDivider />
        <MenuItem onClick={() => undefined} type="error">
          Delete
        </MenuItem>
      </Menu>
    </MenuContainer>
  );
}
