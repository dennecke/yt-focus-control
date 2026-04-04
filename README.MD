# YT Focus Control

A browser extension designed to reduce YouTube distractions. Right now it only disables Youtube Shorts

## Features
- Completely removes YouTube Shorts from the sidebar, home screen. Direct links to Shorts are automatically blocked.
- Set a bedtime (e.g., 22:00 to 08:00). If you try to open YouTube during these hours, you will be redirected to a Sleep Mode screen.
- Set a maximum daily allowance for YouTube (e.g., 1h 30m). The extension runs a background timer *only* when a YouTube tab is active. Once your time is up, all YouTube tabs are blocked until the next day.

## Installation

### Firefox
1. Open Firefox and type `about:debugging` in the address bar.
2. Click on **"This Firefox"** in the left sidebar.
3. Click **"Load Temporary Add-on..."**.
4. Select the `manifest.json` file from the project folder.

### Chrome / Edge
1. Open `chrome://extensions`.
2. Enable **"Developer mode"** (top right toggle).
3. Click **"Load unpacked"**.
4. Select the project folder.

