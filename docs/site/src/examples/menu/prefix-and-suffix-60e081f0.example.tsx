import { Menu, MenuButton, MenuContainer, MenuItem } from "@hustradio/unitary-ui";
import { Accessibility, MoreHorizontal } from "lucide-react";

export function MenuPrefixAndSuffix60E081F0Example() {
  return (
    <div className="flex flex-row items-stretch justify-start gap-6 flex-initial">
      <MenuContainer>
        <MenuButton aria-label="Menu" shape="square" size="small" svgOnly variant="secondary">
          <MoreHorizontal />
        </MenuButton>
        <Menu>
          <MenuItem prefix={<Accessibility />}>Left</MenuItem>
          <MenuItem prefix={<Accessibility />}>Center</MenuItem>
          <MenuItem prefix={<Accessibility />}>Right</MenuItem>
        </Menu>
      </MenuContainer>
      <MenuContainer>
        <MenuButton aria-label="Menu" shape="square" size="small" svgOnly variant="secondary">
          <MoreHorizontal />
        </MenuButton>
        <Menu>
          <MenuItem suffix={<Accessibility />}>Left</MenuItem>
          <MenuItem suffix={<Accessibility />}>Center</MenuItem>
          <MenuItem suffix={<Accessibility />}>Right</MenuItem>
        </Menu>
      </MenuContainer>
    </div>
  );
}
