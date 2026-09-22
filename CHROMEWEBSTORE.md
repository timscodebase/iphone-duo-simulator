# Chrome Web Store Listing — iPhone Duo DevTools Simulator

> Last Updated: 2026-09-22

## Store Listing

**Extension Name** [REQUIRED]
iPhone Duo DevTools Simulator

**Short Description** [REQUIRED]
Simulate Apple iPhone Duo foldable postures, crease guides, 3D book pose, and WebMCP agent tools inside Chrome DevTools.

**Detailed Description** [REQUIRED]
iPhone Duo DevTools Simulator is a developer extension that enables web engineers and designers to test, debug, and preview websites for the upcoming Apple iPhone Duo foldable form factor directly within Chrome DevTools.

KEY FEATURES
- Authentic Dual-Screen Postures: Instantly toggle between Folded (5.4" Outer Display: 466 × 678 pt), Unfolded (7.6" Flat Display: 890 × 626 pt @3x), Partially Folded (Book/Laptop Pose), and Split View (50% multitasking).
- Real-Time Hardware Crease Guides: Visualizes the Human Interface Guidelines (HIG) 445pt center crease guide and 40px fold reservation zone to verify that interactive controls, text, and buttons remain clear of the physical hinge.
- 3D Book & Laptop Perspective: Interactive fold angle slider (60° to 160°) with dynamic 3D CSS perspective transform and simulated hardware spine shadow.
- WebMCP & AI Agent Readiness: Detects client-side navigator.modelContext registrations and exposes the `iphone_duo_set_posture` tool so automated autonomous agents can programmatically test postures.
- Native Chrome Emulation: Uses Chrome DevTools Protocol (CDP) for accurate viewport dimensions, DPR (@3x device scale factor), and touch emulation.

HOW TO USE
1. Open any web application or site (including localhost:5173 or staging URLs).
2. Open Chrome DevTools (Press F12 or right-click anywhere and select Inspect).
3. Select the "iPhone Duo" tab in the DevTools top navigation bar.
4. Click any posture button (Folded, Unfolded, Partially Folded, Split View) or adjust the fold angle slider to preview your responsive layout.
5. Toggle crease guides or test WebMCP agent tool invocation directly from the panel.

PRIVACY & PERMISSIONS
This extension runs 100% locally on your computer. It does not collect, track, or transmit any browsing history, cookies, personal data, or analytics to external servers. All emulation and visual overlays operate strictly inside your browser.

SUPPORT & ISSUES
For documentation, feedback, and issue reporting, visit our project repository on GitHub.

**Category** [REQUIRED]
Developer Tools

**Single Purpose** [REQUIRED]
Simulates dual-screen foldable postures, crease guides, and WebMCP model context tools for web testing in Chrome DevTools.

**Primary Language** [REQUIRED]
English

---

## Graphics & Assets

| Asset | Dimensions | Status | Filename |
|-------|-----------|--------|----------|
| Store Icon [REQUIRED] | 128×128 PNG | ✅ Ready | `icons/icon-128.png` / `store-assets/icon-128.png` |
| Extension Icon 48 | 48×48 PNG | ✅ Ready | `icons/icon-48.png` |
| Extension Icon 32 | 32×32 PNG | ✅ Ready | `icons/icon-32.png` |
| Extension Icon 16 | 16×16 PNG | ✅ Ready | `icons/icon-16.png` |
| Screenshot 1 [REQUIRED] | 1280×800 PNG | ✅ Ready | `store-assets/screenshot-1-1280x800.png` |
| Screenshot 2 [RECOMMENDED] | 1280×800 PNG | ✅ Ready | `store-assets/screenshot-2-1280x800.png` |
| Small Promo Tile [RECOMMENDED] | 440×280 PNG | ✅ Ready | `store-assets/promo-small-440x280.png` |
| Marquee Promo Tile | 1400×560 PNG | ✅ Ready | `store-assets/promo-marquee-1400x560.png` |

### Screenshot Notes
- **Screenshot 1 (`screenshot-1-1280x800.png`)**: Demonstrates the Unfolded 7.6" Flat dual-screen posture (890 × 626 pt) alongside the active DevTools panel with posture buttons, crease guides (445pt dotted line), HIG 40px reserved region, and WebMCP tool registration.
- **Screenshot 2 (`screenshot-2-1280x800.png`)**: Demonstrates Partially Folded 3D Book/Laptop pose with the dynamic angle slider set to 110°, real-time spine shadow, and angled perspective view.

---

## Permissions Justification

| Permission | Type | Justification |
|------------|------|---------------|
| `debugger` | permissions | Required to send Chrome DevTools Protocol commands (`Emulation.setDeviceMetricsOverride`, `Emulation.setUserAgentOverride`, and `Emulation.setDisplayFeatures`) to accurately emulate physical foldable dimensions, @3x pixel ratio, and touch events on the inspected tab. |
| `tabs` | permissions | Required to send runtime messages (`SET_VIEW_OVERLAY`, `TOGGLE_CREASE_OVERLAY`, `QUERY_WEBMCP_STATE`) between the DevTools controller panel and the content script of the inspected page. |
| `activeTab` | permissions | Required to obtain the active tab context when the developer initiates emulation from the DevTools panel or toolbar action. |
| `scripting` | permissions | Required to inject and evaluate the WebMCP model context tool bridge script into the inspected page context. |
| `storage` | permissions | Required to save developer preferences locally (preferred default posture, fold angle, and crease guide toggles). |
| `<all_urls>` | host_permissions | Required to enable developers to test and inspect foldable postures on any website, including local development servers (`http://localhost:*`, `http://127.0.0.1:*`), staging environments, and live web apps. |

---

## Privacy & Data Use

### Data Collection

**Does the extension collect user data?** No

| Data Type | Collected? | Transmitted Off-Device? | Purpose | Shared with Third Parties? |
|-----------|-----------|------------------------|---------|---------------------------|
| Personally identifiable info | No | No | None | No |
| Health info | No | No | None | No |
| Financial info | No | No | None | No |
| Authentication info | No | No | None | No |
| Personal communications | No | No | None | No |
| Location | No | No | None | No |
| Web history | No | No | None | No |
| User activity | No | No | None | No |
| Website content | No | No | None | No |

### Data Use Certification
- [x] Data is NOT sold to third parties
- [x] Data is NOT used for purposes unrelated to the extension's core functionality
- [x] Data is NOT used for creditworthiness or lending purposes

---

## Privacy Policy

**Privacy Policy URL** [REQUIRED for `<all_urls>`]
https://timscodebase.github.io/iphone-duo-simulator/privacy.html

*(Source file in [`docs/privacy.html`](file:///Users/tithos/Dev/Local%20Web/iphone-duo-simulator/docs/privacy.html) / [`PRIVACY_POLICY.md`](file:///Users/tithos/Dev/Local%20Web/iphone-duo-simulator/PRIVACY_POLICY.md))*

---

## Distribution

**Visibility**: Public  
**Regions**: All regions  
**Pricing**: Free  

---

## Developer Info

**Publisher Name** [REQUIRED]: Partners In Code  
**Contact Email** [REQUIRED]: [Your Developer Contact Email]  
**Support URL** [RECOMMENDED]: https://github.com/timscodebase/iphone-duo-simulator/issues  
**Homepage URL** [RECOMMENDED]: https://timscodebase.github.io/iphone-duo-simulator/  

---

## Version History

| Version | Date | Changes | Status |
|---------|------|---------|--------|
| 1.0.0 | 2026-09-22 | Initial release: DevTools panel with 4 postures, crease guides, 3D book pose, and WebMCP agent tools | Ready for Submission |

---

## Pre-Submission Verification

- [x] `manifest_version: 3`
- [x] Store icon (128x128) and extension icons (16, 32, 48, 128) present and valid PNGs
- [x] Store screenshots (1280x800) generated showing extension in action
- [x] Small (440x280) and Marquee (1400x560) promo tiles ready
- [x] Every permission in `manifest.json` justified
- [x] Privacy policy drafted in `PRIVACY_POLICY.md`
- [x] Clean packaging script `package-extension.sh` created
