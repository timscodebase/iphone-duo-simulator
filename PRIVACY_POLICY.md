# Privacy Policy for iPhone Duo DevTools Simulator

**Last updated**: September 22, 2026

iPhone Duo DevTools Simulator ("we", "our", or "the extension") is a developer tool designed to assist web developers in previewing and testing responsive web applications for foldable and dual-screen device viewports. We are committed to protecting user privacy and ensuring full transparency regarding our data practices.

---

## 1. Information Collection and Use

**iPhone Duo DevTools Simulator does not collect, record, log, or transmit any personal information, browsing history, user credentials, or website data.**

- **No Personal Data**: The extension does not collect names, email addresses, IP addresses, location data, or identifiers.
- **No Browsing History**: The extension does not monitor, track, or save the URLs or websites you visit.
- **No Third-Party Analytics**: The extension does not contain tracking scripts, third-party analytics (such as Google Analytics or telemetry SDKs), or advertising networks.
- **No Remote Servers**: All code executes entirely on your local device within the Google Chrome browser context. No network requests are made by the extension to external endpoints.

---

## 2. Permissions and Device Access

The extension requests specific browser permissions solely to provide its developer emulation features:

- **`debugger`**: Used exclusively to issue Chrome DevTools Protocol commands (`Emulation.setDeviceMetricsOverride`, `Emulation.setUserAgentOverride`, and `Emulation.setDisplayFeatures`) to emulate screen resolution, @3x pixel ratio, and touch events on the tab you are actively inspecting in DevTools.
- **`tabs` and `activeTab`**: Used strictly to relay viewport dimension updates, crease guide overlay toggles, and WebMCP discovery signals to the currently inspected web page.
- **`scripting`**: Used to bridge WebMCP model context tools into the DOM execution context for local AI agent testing.
- **`storage`**: Used solely to persist your local user preferences (such as crease guide visibility and fold angle) within your browser's `chrome.storage.local`.
- **`<all_urls>` (Host Permissions)**: Allows developers to inspect and simulate foldable viewports across any local development environment (e.g. `http://localhost:*`), internal testing environments, or public websites.

At no point is any content from inspected tabs captured, stored, or sent outside your browser.

---

## 3. Data Storage

Any preferences you set (e.g., whether visual crease guides are toggled on or off) are saved locally on your device via Chrome's native `chrome.storage.local` API. This data remains on your machine and can be cleared at any time by resetting extension settings or uninstalling the extension.

---

## 4. Third-Party Sharing

We do not sell, rent, trade, or share any data with third parties.

---

## 5. Security

Because the extension processes all operations strictly on your local device and communicates only between DevTools and the inspected tab via Chrome's secure sandboxed extension APIs, your code and data remain entirely private to your local workstation.

---

## 6. Changes to This Privacy Policy

If we modify the features or permissions of iPhone Duo DevTools Simulator, we will update this Privacy Policy accordingly and update the "Last updated" date above.

---

## 7. Contact Us

If you have questions or concerns regarding this privacy policy or the extension, please open an issue on the official GitHub repository:
https://github.com/[YOUR-USERNAME]/iphone-duo-simulator/issues
