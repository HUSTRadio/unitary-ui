import {
  Menu,
  MenuButton,
  MenuContainer,
  MenuItem,
  MenuItemLocked,
} from "@hustradio/unitary-ui";
import { Tooltip } from "@hustradio/unitary-ui";

export function MenuLockedItemsE410D1DAExample() {
  return (
    <MenuContainer>
      <MenuButton>Actions</MenuButton>
      <Menu width={200}>
        <MenuItem onClick={() => undefined}>View Details</MenuItem>
        <MenuItem onClick={() => undefined}>Edit</MenuItem>
        <Tooltip className="w-full flex" text="You do not have the permissions to delete.">
          <MenuItemLocked onClick={() => undefined}>Delete</MenuItemLocked>
        </Tooltip>
      </Menu>
    </MenuContainer>
  );
}
