# Materials

Presets for radii, fills, strokes, and shadows.

### Surface

On the page.

| Example                                             | Class name      | Usage                        |
| --------------------------------------------------- | --------------- | ---------------------------- |
| Material Base Transparent max W [240px] h [100px]   | material-base   | Everyday use. Radius 6px.    |
| Material Small Transparent max W [240px] h [100px]  | material-small  | Slightly raised. Radius 6px. |
| Material Medium Transparent max W [240px] h [100px] | material-medium | Further raised. Radius 12px. |
| Material Large Transparent max W [240px] h [100px]  | material-large  | Further raised. Radius 12px. |

### Floating

Above the page.

| Example                                                 | Class name          | Usage                                                                                           |
| ------------------------------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------- |
| Material Tooltip Transparent max W [240px] h [100px]    | material-tooltip    | Lightest shadow. Corner 6px. Tooltips will be the only floating element with a triangular stem. |
| Material Menu Transparent max W [240px] h [100px]       | material-menu       | Lift from page. Radius 12px.                                                                    |
| Material Modal Transparent max W [240px] h [100px]      | material-modal      | Further lift. Radius 12px.                                                                      |
| Material Fullscreen Transparent max W [240px] h [100px] | material-fullscreen | Biggest lift. Radius 16px.                                                                      |

### Best Practices

#### When to use

- Use Material instead of hand-rolling radii, fills, strokes, and shadows on a surface; the type encodes the elevation role.

- Pick the type from where the element sits in the layered hierarchy: base for resting cards, small–large for raised content, tooltip and menu for floating popovers, modal for dialogs, fullscreen for takeovers.

- Don’t stack two Materials on the same element; if a child needs more elevation, lift it into its own Material with a higher type.

#### Behavior

- Align the elevation choice with the element’s z-index band so a tooltip-typed surface doesn’t sit visually below a base card.

- Favor the lowest elevation that still reads as elevated against its background; over-elevating is a common source of visual noise.

- Let the type drive chrome and use layout spacing for layout instead of overriding shadows on the same element.

#### Accessibility

- Material is decorative chrome; semantics live on the role-bearing wrapper (role="dialog" on a modal, role="tooltip" on a tooltip, etc.).

- Don’t rely on shadow alone to communicate elevation; pair with the matching focus-visible ring on focusable children inside.

- Test materials in both themes: shadow contrast on dark backgrounds is weaker than on light, so confirm separation still reads.

Was this helpful?
