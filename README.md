# Addy’s Pizzeria Kiosk

A static ordering prototype for a horizontal touchscreen kiosk. The welcome screen uses the supplied 3840 × 2160 brand image without cropping. **Order now** opens the menu, with large touch controls, scrolling categories, dish details, and a visible basket.

Designed for landscape displays, including 1280 × 720, 1920 × 1080, and 4K.

## Customer flow

1. Open `index.html` and tap **Order now**.
2. Browse or search the menu, choose quantities, and add special requests.
3. Review the estimated subtotal and save an order list if needed.
4. Call **(631) 923-1389** to confirm the order with Addy’s.

This is a frontend prototype. It does not send orders to the restaurant, process payments, or connect to a restaurant POS. Prices are starting prices; sizes, availability, final prices, taxes, and delivery details are confirmed by phone.

**Welcome screen** returns to the opening screen. If the basket contains items, the customer confirms before it is cleared. After three minutes without activity, a 30-second warning offers **Keep ordering**; otherwise the kiosk returns to welcome and clears the session. Each new order starts with an empty basket.

## Included assets

Fonts, menu data, scripts, styles, and images are stored locally. The downloaded kiosk can run locally without an internet connection; no external font or image service is needed.

- 251 menu entries, with 227 distinct product images used across 242 entries.
- Nine entries remain without a matching image.
- Four supplied images were refined: Chicken Marsala, Veal Marsala, Mussels Fra Diavolo, and Mussels Marinara. These replace four images within the 227-image set.
- Plain backgrounds and uncropped image fitting keep the complete dish visible.

Food images are presentation visuals, including edited reference images. They are not verified photographs of the restaurant’s servings; actual dishes and portions may differ.

## Run locally

Open `index.html` in a browser, or serve this folder with a local static server. For example, with Python installed:

```sh
python -m http.server 8000
```

Then open [the local kiosk](http://localhost:8000/).

### Optional fullscreen launcher

On Windows with Chrome installed, double-click `Start Kiosk.cmd` to open the kiosk in fullscreen. Press **Alt+F4** to close it. The launcher uses a separate local browser profile and does not change Windows settings. It is a local convenience, excluded from the public website.

## Deploy to Vercel

Deploy this repository as a static site, with the repository root as the project root. No package installation, framework, compilation, or server runtime is required. If configuring the project in Vercel, choose **Other** as the framework and serve the root directory without a build step.

The entry page is `index.html`; the ordering page is `menu.html`. Keep these HTML files and their relative asset paths together. `.vercelignore` excludes documentation, local launchers, previews, and refinement working files from the public site.

## Brand and menu attribution

Brand identity, restaurant information, menu names, descriptions, and starting prices were sourced from [Addy’s Pizzeria’s website](https://addys-pizza.vercel.app/) on **September 30, 2026**. The welcome artwork and replacement food imagery were supplied for this kiosk project.

**Addy’s Pizzeria**  
75 East Main Street, Huntington, NY 11743  
(631) 923-1389
