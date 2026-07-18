#!/usr/bin/env python3
"""
Koers — PWA-icoon-generator (Pillow).

Tekent een afgerond vierkant in eucalyptus (#5E8577) met een rustig wit
pannetje (pot + deksel + stoomlijntjes) — verwijzing naar het pannetjesmodel.

Gebruik:  python scripts/generate_icons.py
Output:   public/icons/icon-192.png, icon-512.png, icon-maskable-512.png,
          apple-touch-icon.png
"""

from pathlib import Path

from PIL import Image, ImageDraw

EUCA = (94, 133, 119, 255)   # #5E8577
EUCA_DEEP = (73, 107, 95, 255)
WHITE = (255, 255, 255, 255)

OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "icons"
MASTER = 1024


def draw_pan(draw: ImageDraw.ImageDraw, cx: float, cy: float, s: float, color=WHITE) -> None:
    """Teken het pan-glyph. s = schaaleenheid; pan is ~11s breed en ~10s hoog."""
    # Stoomlijntjes (drie, zacht golvend)
    steam_w = max(int(0.42 * s), 1)
    for dx in (-2.6 * s, 0.0, 2.6 * s):
        x = cx + dx
        y_top = cy - 4.6 * s
        draw.line(
            [(x, y_top + 1.6 * s), (x + 0.45 * s, y_top)],
            fill=color,
            width=steam_w,
        )
    # Knobbel op deksel
    r = 0.75 * s
    draw.ellipse([cx - r, cy - 3.1 * s, cx + r, cy - 3.1 * s + 2 * r], fill=color)
    # Deksel (brede, dunne afgeronde balk)
    lid_w, lid_h = 11.4 * s, 1.5 * s
    draw.rounded_rectangle(
        [cx - lid_w / 2, cy - 2.4 * s, cx + lid_w / 2, cy - 2.4 * s + lid_h],
        radius=lid_h / 2,
        fill=color,
    )
    # Pan-lichaam
    body_w, body_h = 10.0 * s, 5.4 * s
    draw.rounded_rectangle(
        [cx - body_w / 2, cy - 0.9 * s, cx + body_w / 2, cy - 0.9 * s + body_h],
        radius=1.8 * s,
        fill=color,
    )


def rounded_square(size: int, radius: int) -> Image.Image:
    """Afgerond vierkant met transparante hoeken (voor 'any'-iconen)."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=EUCA)
    return img


def full_square(size: int) -> Image.Image:
    """Vol vierkant zonder transparantie (maskable / apple-touch)."""
    return Image.new("RGBA", (size, size), EUCA)


def make_icons() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # --- Standaard iconen ('any'): afgerond vierkant, transparante hoeken ---
    for target in (192, 512):
        img = rounded_square(MASTER, int(MASTER * 0.225))
        d = ImageDraw.Draw(img)
        draw_pan(d, MASTER / 2, MASTER / 2 + MASTER * 0.01, MASTER * 0.052)
        img = img.resize((target, target), Image.LANCZOS)
        img.save(OUT_DIR / f"icon-{target}.png")
        print(f"icon-{target}.png")

    # --- Maskable: volle achtergrond, glyph binnen de veilige zone (~80%) ---
    img = full_square(MASTER)
    d = ImageDraw.Draw(img)
    draw_pan(d, MASTER / 2, MASTER / 2 + MASTER * 0.005, MASTER * 0.040)
    img = img.resize((512, 512), Image.LANCZOS)
    img.save(OUT_DIR / "icon-maskable-512.png")
    print("icon-maskable-512.png")

    # --- Apple touch icon 180 (iOS rondt zelf af; volle achtergrond) ---
    img = full_square(MASTER)
    d = ImageDraw.Draw(img)
    draw_pan(d, MASTER / 2, MASTER / 2 + MASTER * 0.01, MASTER * 0.050)
    img = img.resize((180, 180), Image.LANCZOS)
    img.save(OUT_DIR / "apple-touch-icon.png")
    print("apple-touch-icon.png")


if __name__ == "__main__":
    make_icons()
    print(f"Klaar — iconen staan in {OUT_DIR}")
