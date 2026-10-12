import { Menu, MenuButton, MenuContainer, MenuLink } from "@hustradio/unitary-ui";

export function MenuLinkItems24C68D22Example() {
  return (
    <MenuContainer>
      <MenuButton>Links</MenuButton>
      <Menu width={200}>
        <MenuLink href="/design/menu#custom-trigger">One</MenuLink>
        <MenuLink href="#">Two</MenuLink>
        <MenuLink href="#">Three</MenuLink>
      </Menu>
    </MenuContainer>
  );
}
