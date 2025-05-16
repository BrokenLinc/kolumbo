# Coding Standards

This document outlines the coding standards and patterns used throughout the project.

## TypeScript & React Standards

### Component Structure

- Components are written in TypeScript using React's functional component pattern
- Props are explicitly typed using TypeScript interfaces or type definitions
- Components are exported as named exports
- Each component file is marked with `"use client"` directive for Next.js client components

### File Organization

- Components are organized in the `src/app/components` directory
- UI components are separated into `src/app/ui` directory
- Utility functions are placed in `src/app/utils` directory
- Each component is in its own file with a matching name
- Index files are used for clean exports (e.g., `components/index.ts`)

### Naming Conventions

- React components use PascalCase (e.g., `GraphView`, `ChatInput`)
- Type definitions use PascalCase (e.g., `Project`, `RawGraph`)
- Utility functions use camelCase
- Constants use UPPER_SNAKE_CASE (e.g., `TESTING`)

### Component Props

- Props are destructured in the function parameters
- Optional props are marked with `?`
- Props interfaces are defined either inline or as separate types
- Props are documented with JSDoc comments when necessary

### State Management

- React hooks are used for state management (`useState`, `useEffect`, `useLayoutEffect`)
- Custom hooks are used for reusable logic (e.g., `useProjects`)
- State variables are named descriptively
- State updates are handled through setter functions

## UI Standards

### Component Library

- Uses Chakra UI as the base component library
- Custom UI components are wrapped in a Provider component
- UI components are imported as a namespace (`* as UI`)
- Consistent use of Chakra UI's styling props

### Layout

- Uses Chakra UI's layout components (`HStack`, `VStack`, `Stack`, `Flex`)
- Consistent spacing using Chakra UI's spacing scale
- Responsive design patterns using Chakra UI's responsive props

### Styling

- Uses Chakra UI's theme system for consistent colors and styling
- Inline styles are used sparingly and only when necessary
- SVG elements are styled using Chakra UI's `as` prop
- Consistent use of color schemes and semantic color names

## Code Quality

### Documentation

- JSDoc comments are used for component and function documentation
- Complex logic is documented with inline comments
- Type definitions are self-documenting
- TODO comments are used for future improvements

### Error Handling

- Try-catch blocks are used for error-prone operations
- Console errors are logged for debugging
- Error states are handled gracefully in the UI

### Performance

- React keys are used consistently for list rendering
- Memoization is used where appropriate
- Layout effects are used for DOM measurements
- SVG optimizations are implemented for graph rendering

### Testing

- Testing mode is implemented with example data
- Console logging is used for debugging
- Error boundaries are implemented for graceful failure

## Best Practices

### Code Organization

- Related functionality is grouped together
- Utility functions are separated from component logic
- Constants are defined at the top of files
- Imports are organized by type (React, UI, utils)

### Type Safety

- Strict TypeScript typing is used throughout
- Type assertions are used sparingly and documented
- Generic types are used where appropriate
- Union types are used for variant props

### Accessibility

- Semantic HTML elements are used where possible
- ARIA attributes are implemented for custom components
- Keyboard navigation is supported
- Color contrast meets accessibility standards

### Security

- Client-side only code is properly marked
- User input is validated
- Local storage is used appropriately
- API calls are handled securely
