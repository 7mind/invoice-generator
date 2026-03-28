# Invoice Generator

A single-page web application for generating PDF invoices. Runs entirely in the browser — no server required. The built application is a single HTML file you can open locally or host anywhere.

> **Totally Claude'd** ✨

## Features

- Generate professional PDF invoices with customizable fields
- Custom logo support — upload any image, stored as part of the template
- Editable line items: description, quantity, tax, unit price
- Configurable VAT/tax rates
- Invoice and due date defaults with smart date selection
- Save and load templates via localStorage for quick reuse
- Import/export templates as JSON files for sharing and backup
- Builds to a single self-contained HTML file

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 22+
- Or [Nix](https://nixos.org/) with flakes enabled (provides Node.js automatically)

### Install and Build

```sh
npm install
npm run build
```

The output is a single file at `dist/index.html`. Open it in any browser — no server needed.

### Build and Open

```sh
npm run open
```

Builds the project and opens `dist/index.html` in your default browser.

## Development

```sh
npm run dev
```

Starts a local development server with hot reload.

### Nix Users

The project includes a `flake.nix`. With [direnv](https://direnv.net/):

```sh
direnv allow
```

This will automatically set up Node.js 22.

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build single-file `dist/index.html` |
| `npm run open` | Build and open in default browser |
| `npm run preview` | Preview production build locally |
| `npm run clean` | Remove `dist/` directory |

## Templates

### Default Template

The app ships with a built-in default template pre-filled in the form. Modify any fields before generating your PDF.

### localStorage

Save frequently used templates by name directly in the browser. These persist between sessions.

### JSON Import/Export

Export your current form as a JSON template file for backup or sharing. Import previously saved JSON files to restore a template.

## License

[MIT](LICENSE)
