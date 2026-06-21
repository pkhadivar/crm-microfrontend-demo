# CRM Microfrontend Project

## Stack

- React 19
- TypeScript
- Vite
- Module Federation
- TanStack Table
- react-window
- TailwindCSS
- pnpm workspace

## Architecture

- host-app
- mfe-users
- shared-types
- shared-ui

## Current Features

- Virtualized table
- Sorting
- Global filtering
- Row selection
- Dynamic grid layout

## Current Goals

- Backend with Django
- Learn AI-assisted development
- Portfolio-quality architecture

## Important Notes

- Using build + preview for federation
- react-window virtualization
- enterprise architecture focus

## Known Technical Decisions

### Virtualization

Current:
- react-window FixedSizeList

Reason:
- stable
- already implemented
- sufficient for current requirements

Future:
- consider @tanstack/react-virtual
- migrate during table architecture refactor

Known issue:
- React 19 peer dependency warning
