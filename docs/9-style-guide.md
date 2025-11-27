# GitHub Interface Style Guide

## Introduction

This style guide serves as a comprehensive reference for maintaining consistency and usability across GitHub's interface. It covers design principles, visual elements, interaction patterns, and accessibility guidelines that contribute to the cohesive GitHub experience.

## Design Principles

### 1. Clarity First
- Prioritize information hierarchy to guide users efficiently
- Use clear, concise language that developers understand
- Minimize cognitive load by following familiar patterns
- Avoid unnecessary decorative elements that don't add functional value

### 2. Developer Focus
- Optimize for developer workflows and efficiency
- Support keyboard navigation as primary interaction method
- Provide powerful shortcuts for experienced users
- Respect developer preferences for customization

### 3. Consistency
- Maintain consistent patterns across all GitHub products
- Follow established component behaviors throughout the platform
- Use standardized spacing, typography, and color palettes
- Apply uniform interaction patterns for similar functions

### 4. Accessibility
- Ensure all interface elements meet WCAG 2.1 AA standards
- Support screen readers and assistive technologies
- Provide adequate color contrast ratios (minimum 4.5:1)
- Include keyboard navigation for all interactive elements

## Color Palette

### Primary Colors
- **GitHub Purple**: #6e40aa (for primary actions and highlights)
- **Text Colors**:
  - Primary: #24292f (dark text on light backgrounds)
  - Secondary: #57606a (subtle text)
  - Disabled: #8c959f (inactive elements)
- **Background Colors**:
  - Page background: #ffffff
  - Container background: #f6f8fa
  - Hover states: #f3f4f6

### Status Colors
- **Positive**: #2da44e (success, positive actions)
- **Negative**: #cf222e (errors, destructive actions)
- **Warning**: #d29922 (warnings, cautionary information)
- **Informational**: #0969da (info, neutral notifications)

### Syntax Highlighting
- **Keywords**: #cf222e
- **Functions**: #8250df
- **Strings**: #0a3069
- **Comments**: #6e7781
- **Variables**: #0550ae

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
```

### Font Sizes
- **Heading 1**: 32px (2rem), bold
- **Heading 2**: 24px (1.5rem), bold
- **Heading 3**: 20px (1.25rem), bold
- **Heading 4**: 16px (1rem), bold
- **Body Large**: 16px (1rem), regular
- **Body**: 14px (0.875rem), regular
- **Small**: 12px (0.75rem), regular

### Line Height
- Standard: 1.5
- Dense: 1.25 for compact interfaces

## Spacing System
- Based on 8px grid system
- **Micro**: 4px (0.25rem)
- **Small**: 8px (0.5rem)
- **Regular**: 16px (1rem)
- **Medium**: 24px (1.5rem)
- **Large**: 32px (2rem)
- **X-Large**: 40px (2.5rem)

## Components

### Buttons

#### Primary Button
- Background: GitHub Purple (#6e40aa)
- Text: White (#ffffff)
- Border: None
- Padding: 5px 16px
- Border-radius: 6px
- Font-weight: 500

#### Secondary Button
- Background: transparent
- Text: GitHub Purple (#6e40aa)
- Border: 1px solid #d0d7de
- Padding: 4px 15px
- Border-radius: 6px

#### Destructive Button
- Background: #cf222e
- Text: White (#ffffff)
- Hover: #a4151e

#### Button Sizes
- **Small**: 28px height, 12px horizontal padding
- **Regular**: 32px height, 16px horizontal padding
- **Large**: 40px height, 24px horizontal padding

### Forms

#### Text Inputs
- Height: 32px
- Border: 1px solid #d0d7de
- Border-radius: 6px
- Padding: 5px 12px
- Focus: 3px solid #a4cbff (outline-offset: -3px)

#### Text Area
- Min-height: 32px
- Vertical resize only
- Same border and focus styles as text input

#### Labels
- Font-weight: 500
- Margin-bottom: 4px
- Use for accessibility

### Navigation

#### Top Navigation
- Height: 60px
- Background: #ffffff
- Border-bottom: 1px solid #d0d7de
- Logo/branding left-aligned
- User navigation right-aligned

#### Side Navigation
- Width: 256px
- Background: #f6f8fa
- Border-right: 1px solid #d0d7de
- Items: 32px height with 8px left border when active

### Cards
- Background: #ffffff
- Border: 1px solid #d0d7de
- Border-radius: 12px
- Box-shadow: 0 1px 0 rgba(31, 35, 40, 0.04)
- Padding: 16px

## Iconography

### Icon Sizes
- **16x16px**: Inline with text, small UI elements
- **24x24px**: Default interface icons
- **32x32px**: Larger action icons

### Icon Colors
- Primary content: #24292f
- Secondary content: #57606a
- Interactive: GitHub Purple (#6e40aa) on hover/focus
- Disabled: #8c959f

## Responsive Design

### Breakpoints
- **Mobile**: 0 - 767px
- **Tablet**: 768px - 1011px
- **Desktop**: 1012px+

### Mobile Considerations
- Minimum touch target size: 44px x 44px
- Reduce horizontal scrolling where possible
- Prioritize important actions in mobile view

## Accessibility

### Keyboard Navigation
- Ensure all interactive elements are focusable via Tab key
- Provide visible focus indicators (minimum 2px outline)
- Follow logical tab order (header → navigation → main → footer)

### Screen Reader Support
- Provide alternative text for all meaningful images
- Use semantic HTML elements appropriately
- Ensure ARIA attributes are used properly when needed

### Color Accessibility
- Don't rely on color alone to convey information
- Test with colorblindness simulators
- Maintain 4.5:1 contrast ratio for normal text, 3:1 for large text

## Patterns

### Loading States
- Use consistent loading indicators throughout the interface
- Preserve layout space during loading to prevent content shift
- Provide meaningful loading text when appropriate

### Empty States
- Use illustrations and encouraging language
- Include clear call-to-action when relevant
- Provide helpful instructions or next steps

### Error Handling
- Use consistent error messaging format
- Place error messages near the relevant form field
- Provide specific instructions on how to resolve the error

## Motion and Animation

### Duration
- Quick actions: 100ms
- Modals/transitions: 200ms
- Complex animations: 300ms

### Easing
- Standard: cubic-bezier(0.25, 0.1, 0.25, 1.0)
- Acceleration: cubic-bezier(0.42, 0, 1, 1)
- Deceleration: cubic-bezier(0, 0, 0.58, 1)

## Voice and Tone

### Language Guidelines
- Use clear, action-oriented language
- Avoid jargon that might not translate across cultures
- Be concise while remaining descriptive
- Use active voice as much as possible

### Common Terminology
- "Repository" instead of "repo" (in UI text)
- "Commit" instead of "push" when referring to saving changes
- "Branch" for code branches (not "fork" - that's for repository copies)

This style guide should be applied consistently across all GitHub interfaces to ensure a seamless and familiar experience for developers. Always consider the context and user goals when implementing these guidelines, making adjustments only when necessary for usability.