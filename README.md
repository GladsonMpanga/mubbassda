# MUBAS SDA Club Website

A fully responsive, animated multi-page website for MUBAS SDA Club, built with plain HTML, CSS and JavaScript (no build tools required).

## How to view it
Just open `index.html` in a browser. For the Admin Panel to work best (some browsers restrict localStorage on the `file://` protocol), it's recommended to serve the folder with a simple local server, e.g.:

```
npx serve .
```
or
```
python3 -m http.server 8000
```
then visit `http://localhost:8000`.

## Pages
- `index.html` — Home
- `about.html` — About the club, weekly programme, room gallery
- `ministries.html` — Club Choir, Adventist Youth Society, Watchmans Trumpet, small groups
- `news.html` — News feed (managed via Admin Panel)
- `executive.html` — 15 executive committee members (managed via Admin Panel)
- `contact.html` — Contact channels, message form, FAQ
- `admin.html` — Admin Panel (default password: `mubas2026`, change it under Settings)

## Editing content without touching code
Open `admin.html`, log in, and use the **News**, **Executive** and **Settings** tabs to add/edit/delete news posts and executive members, and to update your WhatsApp, Facebook, YouTube, Play Store links, email, phone and address. Everything saves to the browser's local storage and appears instantly on the live pages.

> Note: this admin panel stores data in the visitor's own browser (no server/database). It's ideal for a single admin editing on one device/browser. If you'd like changes to sync across every visitor's browser and persist permanently online, the site will need a small backend/database — happy to help set that up next.

## Editing design
CSS is split by section/page so you can find and change things easily:
- `css/base.css` — colors, fonts, buttons, cards, shared layout (edit colors here)
- `css/navbar.css`, `css/hero.css`, `css/home.css`, `css/footer.css` — home page + shared nav/footer
- `css/about.css`, `css/ministries.css`, `css/news.css`, `css/executive.css`, `css/contact.css` — page-specific styles
- `css/admin.css` — admin dashboard styles
- `css/responsive.css` — shared responsive breakpoints

## Replacing images
All images currently use placeholder graphics in `/images/`. Replace any file in that folder with your real photo (keep the same filename) or update the `src` in the HTML / in the Admin Panel to point to your new image.

## Colors used
- Black `#000000`, White `#ffffff`, Gray `#777777`, Red `#f44336`, Navy `#12213c` (button borders)

## Fonts
Arial, Helvetica, sans-serif — used throughout.
