# QuickSearch 4.0

QuickSearch is a web application designed to enhance development speed through efficient and quick searches.

Its secondary goal is to apply and practice acquired skills, meaning further optimization may be needed.

During the development of this web application, the following features and skills were practiced and learned:

- Bootstrap
- JavaScript arrow functions
- Chrome Extension development knowledge

## Contents

1. Images
2. What is QuickSearch?
3. Differences from QuickSearch 3.0
4. Detailed Features
5. APIs, Frameworks, and Shortcut Links Used

## 1. Images
![init](./README/images/initSettings.png)
![wpSet](./README/images/wpSet.png)
![use](./README/images/use.png)
![selectPopup](./README/images/selectPopup.png)
[☝️](#contents)

## 2. What is QuickSearch?

Web browsing is essential when developing.

However, even simple tasks during web browsing can feel cumbersome and require speeding up (especially when you want to leave work early!).

With a "quick" mindset, I thought, "I want to make this faster too," and decided to implement the features I envisioned in this web application.

1. Quick access links on the start page:
   - Chrome's default shortcuts allow only up to 10 links (e.g., work email, development servers, ChatGPT, StackOverflow, etc.). Ten is often insufficient.

2. Minimized pasting actions:
   - To use another search engine, you need to open its site and input your search term. If the internet connection is slow, entering the site can take time.
   - Based on my usage, I can set my most-used search engines as default (custom user-defined search engines will be added in the future).

3. Annoying source links when copying:
   - When copying commands or text from blogs like Naver Blog or Tistory, a source link is appended at the end. This can lead to unwanted commands being executed when pasted into a terminal.
   - By dragging and selecting text, a popup appears, and using the 📎 button allows copying without including the source link.

4. Blogs that restrict text selection:
   - Some blogs restrict text selection. A feature was added to bypass this restriction, but it works only on certain sites.

Even though I am not proficient in web development, my development speed has somewhat improved since using `QuickSearch 3.0`.

[☝️](#contents)

## 3. Differences from QuickSearch 3.0

|  | QS3.0 | QS4.0 |
|--|--|--|
|Method|WebPage|Chrome Extension (Web)|
|Widget Support|Fixed clock|Clock and stickers can be toggled on/off|
|Additional Convenience Features| - |Quick copy, search, and translation of selected text on web pages|
|User-Defined Options|Dark mode, wallpaper, Dock URL|Dark mode, wallpaper, Dock URL, default translation (Google, Naver Papago), widgets, etc.|

[☝️](#contents)

## 4. Detailed Features

### Floating Menu
![selectPopup](./README/images/selectPopup.png)

When selecting text, 📎🔁🔍 icons appear.

> The option 'Enable Floating Menu for Text Selection' must be turned on in settings.

> On some sites where dragging is restricted, enabling the 'Force Text Selection' option allows dragging (this does not work on all sites).

|Icon|Function|
|--|--|
|📎|- Copies to clipboard<br>- Prevents source links from being appended on some sites when copying text (avoids terminal issues caused by unwanted commands).|
|🔁|- Translates the selected text.<br>- If the 'Use Papago as Default Translator' option is enabled, it redirects to `Naver Papago`.|
|🔍|- Searches the selected text using the chosen search engine.<br>- Supports Google, Naver, YouTube, StackOverflow, and translation services.|

[☝️](#contents)

### Multi-language Support

This extension supports Korean, English, and Japanese.

However, the README does not currently include Japanese.

Translation was done using `ChatGPT`.

[☝️](#contents)

### Quick Search

Since Chrome extension new tab pages default to focusing on the address bar, the 'Quick Search on Empty Paste' feature has been removed from `QuickSearch 3.0`.

On a 'New Tab,' pasting and pressing Enter will search using Chrome's default search engine.

To search with another engine, click the search box, paste, and press Enter.

[☝️](#contents)

### Widgets

You can toggle clocks and stickers on the new tab page.

#### Sticker

Stickers allow you to write simple memos in the `StickerBox`.

Clicking the red `X` button deletes the `StickerBox`.

[☝️](#contents)

## 5. APIs, Frameworks, and Shortcut Links Used

### APIs

- suggestqueries.google.com
- Chrome Extension API

### Frameworks/Libraries

- jQuery v3.7.1
- Bootstrap v5.3.3

### Shortcut Links Used

- Google: `https://www.google.com/search?q={USER_TEXT}`
- Naver: `https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query={USER_TEXT}`
- YouTube: `https://www.youtube.com/results?search_query={USER_TEXT}`
- StackOverflow: `https://stackoverflow.com/search?q={USER_TEXT}`
- GoogleTranslate: `https://translate.google.co.kr/?sl=auto&tl=${UILanguage}&text=${USER_TEXT}&op=translate`
- NaverPapago: `https://papago.naver.com/?sk=auto&tk=${UILanguage}&hn=0&st=${USER_TEXT}`

[☝️](#contents)