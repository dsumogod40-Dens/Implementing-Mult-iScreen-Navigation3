# AgriRenta

AgriRenta is an Expo app for browsing and renting farm equipment. It uses Expo
Router and supports Android, iOS, and web.

## Run locally

```bash
npm install
npx expo start
```

Use the Expo CLI prompts to open the app on a device, emulator, or web browser.

## Project structure

- `src/app/` contains the Expo Router routes for Home, Explore, equipment details,
  bookings, notifications, and owner chat.
- `src/components/agri-renta.jsx` contains the shared screens and rental data.
- `src/components/agri-renta.styles.ts` contains the shared React Native styles.
- `assets/images/` contains the logo, banner, and equipment images.

React Native styles are kept in a `StyleSheet` file rather than a `.css` file so
the same layout works on iOS, Android, and web.

## Add or replace an image

Place the image in `assets/images/`, then reference it from
`src/components/agri-renta.jsx` with a static `require`, for example:

```js
image: require('@/assets/images/tractor.png')
```

Keep the filename and letter casing consistent with the `require` path.
