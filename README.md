# AirPixel-Website

## Prerequisites

1. Install [**git-lfs**](https://git-lfs.com) globally:

   ```sh
   brew install git-lfs
   ```

2. Install [**sass/sass/sass**](https://sass-lang.com) globally:

   ```sh
   arch -arm64 brew install sass/sass/sass
   ```

### CSS Styling

Generate `theme.css` file after updating SCSS files:

   ```sh
   sass --watch assets/scss/theme.scss assets/css/theme.css
   ```
