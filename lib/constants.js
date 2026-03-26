// lib/constants.js
export const IMGS = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&q=80",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
];

export const RISK_SCORES = [82, 74, 68, 55, 61, 70, 58, 65, 72, 48];
export const PROP_AGES   = [15,  1,  8,  0,  3,  0,  5,  4, 10, 12];

export const getRisk = (id) => RISK_SCORES[(id - 1) % RISK_SCORES.length] || 60;
export const getAge  = (id) => PROP_AGES[(id - 1)   % PROP_AGES.length]   || 5;
export const getImg  = (id) => IMGS[(id - 1) % IMGS.length];

export const fmtPrice = (n) =>
  n >= 10000000 ? `₹${(n / 10000000).toFixed(1)} Cr` :
  n >= 100000   ? `₹${(n / 100000).toFixed(0)} L`    :
  `₹${n?.toLocaleString() || 0}`;

// Design tokens
export const C = {
  primary:   "#E03A3C",
  primaryDk: "#C0302F",
  green:     "#00897B",
  bg:        "#F5F5F5",
  white:     "#FFFFFF",
  text:      "#1A1A1A",
  text2:     "#717171",
  border:    "#E0E0E0",
  greenBg:   "#E0F2F1",
};
