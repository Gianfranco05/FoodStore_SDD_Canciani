## ADDED Requirements

### Requirement: Design tokens with @theme
The system SHALL define semantic color tokens using OKLCH in `@theme`, covering primary, secondary, accent, muted, destructive, border, ring, card, and background/foreground pairs for both light and dark modes.

#### Scenario: Light mode colors render correctly
- **WHEN** the page loads without `dark` class on `<html>`
- **THEN** background uses `--color-background`, text uses `--color-foreground`, and interactive elements use `--color-primary`

#### Scenario: Dark mode colors render correctly
- **WHEN** the `<html>` element has class `dark`
- **THEN** background uses dark variant of `--color-background`, text uses dark variant of `--color-foreground`

#### Scenario: Border radius tokens are available
- **WHEN** a component uses `rounded-lg` or `rounded-xl`
- **THEN** the radius values come from `--radius-*` tokens defined in `@theme`

#### Scenario: Animation tokens exist for fade-in and slide-in
- **WHEN** a component references `animate-fade-in` or `animate-slide-in`
- **THEN** the corresponding `@keyframes` are defined in `@theme`

### Requirement: Dark mode via class strategy
The system SHALL support dark mode toggling via a `dark` CSS class on `<html>`, using `@custom-variant dark` and persisting user preference in `localStorage`.

#### Scenario: Toggle persists across page reload
- **WHEN** the user toggles dark mode and refreshes the page
- **THEN** the `dark` class is restored from `localStorage` preference

#### Scenario: System preference detected on first visit
- **WHEN** a user visits for the first time with `prefers-color-scheme: dark`
- **THEN** the `dark` class is applied automatically

### Requirement: cn() utility function
The system SHALL provide a `cn()` utility function in `src/lib/utils.ts` that combines `clsx` (for conditional classes) and `tailwind-merge` (for conflict resolution), along with `focusRing` and `disabled` preset utilities.

#### Scenario: cn() merges Tailwind classes handling conflicts
- **WHEN** `cn("px-4 py-2", "px-6")` is called
- **THEN** the result is `"py-2 px-6"` (last `px-*` wins)

#### Scenario: cn() handles conditional classes
- **WHEN** `cn("text-base", isActive && "text-primary")` is called with `isActive = true`
- **THEN** the result includes both `text-base` and `text-primary`

#### Scenario: cn() returns empty string for no arguments
- **WHEN** `cn()` is called with no arguments
- **THEN** the result is an empty string `""`

#### Scenario: focusRing utility applies correct focus classes
- **WHEN** `focusRing` is used in a component's className
- **THEN** it includes `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`

### Requirement: CVA-based component variants
The system SHALL use `class-variance-authority` (CVA) to define typed variants for all shared UI components (Button, Card, Input, Toast), with type-safe variant props.

#### Scenario: Button renders default variant without props
- **WHEN** `<Button>Click</Button>` is rendered
- **THEN** it uses `default` variant and `default` size styles

#### Scenario: Button renders specified variant
- **WHEN** `<Button variant="destructive">Delete</Button>` is rendered
- **THEN** the button applies `bg-destructive text-destructive-foreground` styles

#### Scenario: Button passes additional className
- **WHEN** `<Button className="mt-4">Save</Button>` is rendered
- **THEN** the `mt-4` class is merged with variant styles

#### Scenario: Input shows error state
- **WHEN** `<Input error="Required" />` is rendered
- **THEN** the input shows `border-destructive` and an error message below

### Requirement: Focus-visible rings on interactive elements
All interactive components (Button, Input, links) SHALL have visible focus indicators using `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.

#### Scenario: Button shows focus ring on keyboard navigation
- **WHEN** the user tabs to a Button using keyboard
- **THEN** a visible ring appears around the button

#### Scenario: No focus ring on mouse click
- **WHEN** the user clicks a Button with a mouse
- **THEN** no focus ring is shown (uses `focus-visible` not `focus`)
