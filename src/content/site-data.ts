/*
  CUE-PHORIA SITE DATA
  ---------------------------------------------------------------
  The one file to edit for prices, hours, specials, the food menu,
  FAQs and business details. Every page reads from it.

  Rules of thumb:
  - Prices are plain numbers (20, not "$20").
  - Times use 24-hour "HH:MM" ("17:00" is 5 PM, "02:00" is 2 AM).
  - Day numbers: 0 is Sunday, 6 is Saturday.
*/

export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Plan {
  id: "table" | "standard" | "premium";
  name: string;
  /** Short label used on the homepage list ("Table only", "Standard package"). */
  listName: string;
  /** One-line summary used on the homepage list. */
  summary: string;
  price: number;
  unit: string;
  /** Short unit shown under a price ("per table / hour"). */
  unitShort: string;
  perPerson: boolean;
  hasGratuity: boolean;
  soloPrice?: number;
  maxPlayers?: number;
  tag?: string;
  popular?: boolean;
  /** Shown on the homepage price list. Premium stays on the Table Rates page. */
  onHomepage: boolean;
  includes: string[];
  excludes: string[];
  weekendPrice: number;
}

export interface MenuItem {
  name: string;
  price?: number;
  priceLabel?: string;
  desc?: string;
}

export interface MenuSection {
  id: string;
  name: string;
  note?: string;
  items: MenuItem[];
  extras?: { name: string; price: number }[];
  listLabel?: string;
  list?: string[];
}

export interface GalleryImage {
  file: string;
  alt: string;
  w: number;
  h: number;
}

export const site = {
  business: {
    name: "Cue-Phoria Billiards & Sports Bar",
    shortName: "Cue-Phoria",
    descriptor: "Billiards & Sports Bar",
    phoneDisplay: "(321) 972-1867",
    phoneTel: "+13219721867",
    street: "1810 SR 436, Unit 132",
    city: "Winter Park",
    state: "FL",
    zip: "32792",
    since: 2011,
    tables: 14,
    timezone: "America/New_York",
    siteUrl: "https://www.cue-phoria-billiards.com",
    facebook: "https://facebook.com/cuephoria",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=Cue-Phoria+Billiards+%26+Sports+Bar%2C+1810+SR+436+Unit+132%2C+Winter+Park%2C+FL+32792",
    mapEmbedUrl:
      "https://www.google.com/maps?q=Cue-Phoria+Billiards+%26+Sports+Bar%2C+1810+SR+436+Unit+132%2C+Winter+Park%2C+FL+32792&output=embed",
    reviewsUrl:
      "https://www.google.com/maps/search/?api=1&query=Cue-Phoria+Billiards+%26+Sports+Bar+Winter+Park+FL",
    nearby: [
      { place: "Full Sail University", time: "about 5 minutes" },
      { place: "Rollins College", time: "about 5 minutes" },
      { place: "UCF", time: "about 10 minutes" },
    ],
    areas: "Orlando, Maitland, Casselberry, Altamonte Springs and Oviedo",
    veteranOwned: true,
  },

  /* Index 0 is Sunday, 6 is Saturday. A close time earlier than the
     open time means "after midnight". */
  hours: [
    { day: "Sunday", short: "Sun", open: "12:00", close: "02:00" },
    { day: "Monday", short: "Mon", open: "17:00", close: "00:00" },
    { day: "Tuesday", short: "Tue", open: "17:00", close: "00:00" },
    { day: "Wednesday", short: "Wed", open: "17:00", close: "00:00" },
    { day: "Thursday", short: "Thu", open: "17:00", close: "00:00" },
    { day: "Friday", short: "Fri", open: "17:00", close: "02:00" },
    { day: "Saturday", short: "Sat", open: "12:00", close: "02:00" },
  ],
  kitchenNote: "Kitchen closes 30 minutes before the bar.",

  pricing: {
    minimumNote: "One-hour minimum",
    gratuityPercent: 18,
    gratuityNote: "18% gratuity added to drink packages",
    groupNote: "Drink packages are sold to the whole group at a table.",
    proRateNote: "After the first hour, time is billed by the minute.",
    plans: [
      {
        id: "table",
        name: "Table Only",
        listName: "Table only",
        summary: "Up to 4 players. Solo players $10/hr. Order drinks separately.",
        price: 20,
        unit: "per table, per hour",
        unitShort: "per table / hour",
        soloPrice: 10,
        maxPlayers: 4,
        perPerson: false,
        hasGratuity: false,
        onHomepage: true,
        includes: ["Table time for up to 4 players"],
        excludes: ["Drinks. Order at the bar as you go."],
        weekendPrice: 12,
      },
      {
        id: "standard",
        name: "Standard",
        listName: "Standard package",
        summary:
          "Table time, unlimited draft pints & pitchers and house liquors. Stella and Mango Cart are not included.",
        popular: true,
        price: 20,
        unit: "per person, per hour",
        unitShort: "per person / hour",
        perPerson: true,
        hasGratuity: true,
        onHomepage: true,
        includes: ["Table time", "Unlimited draft pints and pitchers", "Unlimited house liquor"],
        excludes: ["Stella and Mango Cart"],
        weekendPrice: 30,
      },
      {
        id: "premium",
        name: "Premium",
        listName: "Premium package",
        summary: "Table time, all draft beer, top-shelf spirits and mixed drinks.",
        tag: "Top shelf",
        price: 25,
        unit: "per person, per hour",
        unitShort: "per person / hour",
        perPerson: true,
        hasGratuity: true,
        onHomepage: false,
        includes: [
          "Table time",
          "All draft pints and pitchers",
          "Top-shelf spirits: Captain Morgan and Bacardi rum, 1800 and Jose Cuervo tequila, all Crown flavors, Four Roses bourbon, Tito's, and Three Olives flavors",
          "Mixed drinks: margaritas, old fashioneds, mules and anything else made with these spirits",
        ],
        excludes: ["Spirits that are not on the list above"],
        weekendPrice: 40,
      },
    ] satisfies Plan[],

    weekend: {
      name: "Weekend Unlimited",
      days: [6, 0] as DayIndex[],
      daysLabel: "Saturday & Sunday",
      start: "12:00",
      end: "18:00",
      windowLabel: "12–6 PM",
      headline: "Pay once per person. Not by the hour.",
      detail: "One price covers your play from noon to 6 PM.",
    },

    addons: {
      title: "Food add-ons",
      note: "Standard & Premium packages only",
      items: [
        { name: "Appetizer Sampler", price: 17 },
        { name: "Loaded Nachos", price: 15 },
        { name: "Burger or 10 Wings", price: 12 },
        { name: "Any Flatbread", price: 10 },
      ],
    },
  },

  specials: [
    {
      days: [2] as DayIndex[],
      when: "Tuesday",
      name: "Ladies Night",
      detail: "Ladies play free all night. 21+.",
    },
    {
      days: [5, 6] as DayIndex[],
      when: "Friday & Saturday",
      name: "Poker Tournament",
      detail: "Sign up 7 PM. Cards fly 8 PM. $100 cash prize each night. Presented by Orlando Hold ’Em.",
    },
    {
      days: [6, 0] as DayIndex[],
      when: "Saturday & Sunday",
      name: "Weekend Unlimited",
      /* Filled in from the pricing above so the prices never disagree. */
      detail: "",
      fromPricing: true,
    },
  ],

  stats: [
    { value: "14", suffix: "", text: "Diamond pool tables — the tournament brand, kept level and brushed." },
    { value: "$0", suffix: "", text: "Cover charge. You pay for table time, drinks and food. That's it.", highlight: true },
    { value: "100", suffix: "%", text: "Non-smoking. No smoking or vaping anywhere inside." },
    { value: "7", suffix: "days", text: "Weekdays from 5 PM. Weekends from noon until 2 AM." },
  ],

  /* PLACEHOLDER from the Figma file. Replace with a real Google review
     (exact wording, the reviewer's real name) before launch. */
  review: {
    quote: "The training feels personal, supportive, and focused on my goals. I feel more confident every week.",
    name: "Darlene Robertson",
    role: "Member, 2 years",
    stars: 5,
    photo: "friends-selfie",
  },

  menu: {
    kitchenNote: "The kitchen is open daily until 30 minutes before closing.",
    sections: [
      {
        id: "mains",
        name: "Main dishes",
        note: "All main dishes are served with fries.",
        items: [
          { name: "Classic Patty Melt", price: 13.95, desc: "Double American cheese, onions and special Cue Phoria sauce on Texas toast." },
          { name: "Cue Phoria Burger", price: 14.95, desc: "All-American cheeseburger." },
          { name: "Pulled Pork Sandwich", price: 14.95, desc: "Pulled pork tossed in BBQ sauce on Texas toast." },
          { name: "Black and Blue Burger", price: 15.95, desc: "Seasoned half-pound beef patty with blue cheese, lettuce and tomato." },
          { name: "BBQ Pulled Pork Bacon Burger", price: 15.95, desc: "Cheese, lettuce and tomato, topped with BBQ pulled pork." },
          { name: "Bacon Cheese Burger", price: 15.95, desc: "All-American cheeseburger with bacon." },
          { name: "Philly Cheese, Steak or Chicken", price: 15.95, desc: "Seasoned 6 oz of thinly sliced ribeye with melted cheese, green peppers and onion." },
        ],
      },
      {
        id: "wings",
        name: "Air fried wings",
        items: [
          { name: "6 wings", price: 10.95 },
          { name: "10 wings", price: 14.95 },
          { name: "15 wings", price: 22.95 },
          { name: "20 wings", price: 30.95 },
        ],
        extras: [
          { name: "Add fries", price: 4 },
          { name: "Extra sauce", price: 0.75 },
        ],
        listLabel: "Wing sauces",
        list: ["Hot", "Mild", "BBQ", "Mango Habanero", "Honey Mustard", "Garlic Hot", "Garlic Parmesan", "Lemon Pepper", "Teriyaki", "Plain", "Boom Boom", "Buffalo", "Ghost Pepper"],
      },
      {
        id: "starters",
        name: "Air fried starters",
        items: [
          { name: "Quesadillas", desc: "Cheese $11.95. Beef, chicken, buffalo chicken or pulled pork $13.95.", priceLabel: "from $11.95" },
          { name: "Potato Skins", price: 11.95, desc: "Bacon bits, cheese and a side of sour cream. Add pulled pork +$2." },
          { name: "Mozzarella Sticks", price: 11.95, desc: "Add 2 for $3 or 4 for $6." },
          { name: "Chicken Fingers & Fries", price: 13.95, desc: "2 extra fingers +$3, 4 extra fingers +$5." },
          { name: "Loaded Nachos", price: 15.95, desc: "Serves 2. Tortilla chips topped with melted cheese, lettuce, jalapeños, sour cream, bacon and salsa, with beef, pulled pork or chicken. Combo of 2 meats +$4." },
          { name: "Popcorn Chicken Bites", price: 12.95, desc: "Tossed in your choice of wing sauce." },
          { name: "Southwestern Egg Rolls", price: 12.95, desc: "Served with Boom Boom sauce." },
          { name: "Jumbo All Beef Hotdog", price: 10.95, desc: "Choice of onions, relish or ketchup. Served with fries. Add chili and cheese +$2." },
          { name: "Chicken Finger Mountain Melt", price: 13.95, desc: "A mountain of fries topped with 4 chicken fingers, a blend of cheeses and applewood-smoked bacon." },
          { name: "3 Beef, Pulled Pork or Chicken Tacos", price: 11.95 },
          { name: "Ultimate Sampler", price: 22.95, desc: "2 Southwestern egg rolls, 2 chicken strips, 4 mozzarella sticks and 2 pretzel sticks." },
          { name: "Loaded Fries", price: 11.95, desc: "Four cheese blend, jalapeños, bacon, pulled pork and sour cream, with a side of ranch." },
          { name: "Basket of Seasoned Fries", price: 7.95 },
          { name: "Pretzel Sticks & Cheese Sauce (2)", price: 11.95 },
        ],
      },
      {
        id: "flatbreads",
        name: "Flatbreads",
        items: [
          { name: "Pepperoni", price: 12.95 },
          { name: "Meat Lovers", price: 12.95 },
          { name: "4 Cheese Blend", price: 12.95 },
          { name: "Veggie", price: 12.95 },
          { name: "Supreme", price: 12.95 },
        ],
      },
      {
        id: "salads",
        name: "Salads",
        items: [
          { name: "Grilled Chicken Caesar", price: 12.95 },
          { name: "Grilled Chicken Salad", price: 12.95 },
          { name: "Caesar Salad", price: 7.95 },
          { name: "House Salad", price: 7.95 },
          { name: "Chicken Finger Salad", price: 13.95, desc: "Choice of sauce on the chicken fingers." },
        ],
        listLabel: "Dressings",
        list: ["Caesar", "Ranch", "Blue Cheese", "Balsamic Vinaigrette"],
      },
    ] satisfies MenuSection[],

    /* Shown on the homepage food preview */
    preview: [
      { name: "Air-fried wings", meta: "6 – 20 pc", from: true, price: 10.95 },
      { name: "Burgers", meta: "with fries", from: true, price: 13.95 },
      { name: "Flatbreads", meta: "5 styles", from: false, price: 12.95 },
      { name: "Ultimate sampler", meta: "serves 2+", from: false, price: 22.95 },
    ],
  },

  faqs: [
    { q: "Do I need a reservation?", a: "Walk-ins are always welcome — tables are first come, first served. For larger groups or events, call ahead at (321) 972-1867 and we'll hold space." },
    { q: "Can kids come in?", a: "Yes, during daytime and early evening hours. Guests under 18 are welcome with a parent or legal guardian. It is 21 and over after 9 PM on weekends, and a valid ID is required to buy alcohol." },
    { q: "Is there a cover charge?", a: "No cover charge. You pay for table time, drinks and food — that's it." },
    { q: "Is it non-smoking?", a: "Yes. The entire facility is 100% non-smoking. No smoking or vaping is permitted anywhere inside." },
    { q: "Is there a dress code?", a: "There is no strict dress code. We encourage neat, casual attire." },
    { q: "Do you take group bookings?", a: "Yes. We host birthdays, corporate outings, bachelor and bachelorette parties and other group events. Call (321) 972-1867 or send an event inquiry." },
  ],

  events: {
    tags: ["Birthdays", "Corporate & team building", "Bachelor & bachelorette", "Graduations", "Holiday parties", "Pool tournaments"],
    types: [
      { name: "Corporate events & team building", detail: "Get the team out of the office. Pool tournaments, food packages, drink packages and reserved seating for groups of all sizes." },
      { name: "Birthday parties", detail: "Pool, food, drinks and sports on the big screens with your friends." },
      { name: "Bachelor & bachelorette parties", detail: "A relaxed night out with great food, drinks and professional tables." },
      { name: "Graduation parties", detail: "Celebrate your graduate with family and friends." },
      { name: "Holiday parties", detail: "Company parties and family gatherings in a comfortable, non-smoking room." },
      { name: "Pool tournaments", detail: "Friendly brackets and rivalries on 14 Diamond tables, with food and drinks for the whole field." },
    ],
    formTypes: [
      "Birthday party",
      "Corporate event or team building",
      "Bachelor or bachelorette party",
      "Graduation party",
      "Holiday party",
      "Pool tournament",
      "Something else",
    ],
    offers: [
      "14 professional Diamond pool tables",
      "Full kitchen",
      "Full liquor bar",
      "Drink package options",
      "Reserved seating areas",
      "Large-screen TVs",
      "Non-smoking facility",
      "Custom event packages",
    ],
  },

  gallery: [
    { file: "room-lights", alt: "Diamond pool tables under the ceiling light frames", w: 1400, h: 933 },
    { file: "league-champions", alt: "Central Florida USA Pool League championship team with trophies", w: 367, h: 280 },
    { file: "group-at-bar", alt: "A group of friends at the bar", w: 1400, h: 1051 },
    { file: "friends-wings", alt: "Friends at a high-top with wings and fries", w: 1050, h: 1400 },
    { file: "friends-selfie", alt: "Three friends taking a selfie by the Cue-Phoria wall", w: 1400, h: 1051 },
    { file: "room-day", alt: "Rows of Diamond tables with high-top seating by the windows", w: 1400, h: 933 },
    { file: "bartender", alt: "Bartender behind the bar with the game on TV", w: 1080, h: 1350 },
    { file: "racking", alt: "A player racking the balls for a game", w: 1400, h: 933 },
    { file: "room-seating", alt: "Cue racks and high-top seating beside the tables", w: 1400, h: 933 },
    { file: "players-at-table", alt: "Two guests with a cue at a Diamond table", w: 1050, h: 1400 },
    { file: "two-players", alt: "Two players beside a table", w: 1080, h: 1350 },
    { file: "party-balloons", alt: "A party group in front of a balloon display", w: 1024, h: 768 },
    { file: "group-logo-wall", alt: "A large group gathered at the Cue-Phoria logo wall", w: 787, h: 1400 },
    { file: "group-by-table", alt: "A large group posing beside the tables", w: 787, h: 1400 },
    { file: "four-at-table", alt: "Four guests behind a pool table", w: 1050, h: 1400 },
    { file: "halloween-crowd", alt: "Halloween party crowd in costume", w: 1050, h: 1400 },
    { file: "halloween-four", alt: "Four guests in Halloween costumes at the logo wall", w: 1050, h: 1400 },
    { file: "halloween-three", alt: "Three guests in Halloween costumes", w: 1050, h: 1400 },
    { file: "halloween-two", alt: "Two guests in Halloween costumes", w: 1050, h: 1400 },
    { file: "halloween-group", alt: "A costume group at the Halloween party", w: 768, h: 1024 },
  ] satisfies GalleryImage[],

  /* The four photos in the homepage "Take a look around" strip, in order. */
  galleryStrip: ["league-champions", "group-at-bar", "friends-wings", "friends-selfie"],
};

export type Site = typeof site;
