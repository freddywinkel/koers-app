#!/usr/bin/env python3
"""
Koers - PWA icon generator (Pillow).

Draws the selected "Essential Crossing" mark: a calm sailboat crossing two
waves toward a warm north star. The artwork uses the fixed Noordzeemist
palette and stays inside the safe zone for maskable app icons.

Usage:   python scripts/generate_icons.py
Output:  public/icons/icon-192.png, icon-512.png, icon-maskable-512.png,
         apple-touch-icon.png, apple-touch-icon-v2.png, notification-badge.png
"""

import math
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw

EUCA_DEEP = (73, 107, 95)     # #496B5F - icon field
EUCA_LIGHT = (143, 180, 163)  # #8FB4A3 - calm main wave
CREAM = (252, 252, 250)       # #FCFCFA - boat and wake
APRICOT = (217, 168, 139)     # #D9A88B - north star
BADGE_WHITE = (255, 255, 255, 255)

OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "icons"
MASTER = 1024
UNIT = MASTER / 64
Point = tuple[float, float]


def cubic(
    start: Point,
    control_1: Point,
    control_2: Point,
    end: Point,
    steps: int = 40,
) -> list[Point]:
    """Sample a cubic Bezier curve as points for Pillow."""
    points: list[Point] = []
    for index in range(steps + 1):
        t = index / steps
        mt = 1 - t
        points.append(
            (
                mt**3 * start[0]
                + 3 * mt * mt * t * control_1[0]
                + 3 * mt * t * t * control_2[0]
                + t**3 * end[0],
                mt**3 * start[1]
                + 3 * mt * mt * t * control_1[1]
                + 3 * mt * t * t * control_2[1]
                + t**3 * end[1],
            )
        )
    return points


def transformed(points: Iterable[Point], scale: float) -> list[Point]:
    """Map 64-unit design coordinates to the master and scale around center."""
    center = MASTER / 2
    return [
        (
            center + (x * UNIT - center) * scale,
            center + (y * UNIT - center) * scale,
        )
        for x, y in points
    ]


def draw_north_star_crossing(
    draw: ImageDraw.ImageDraw,
    scale: float,
    *,
    star_color=APRICOT,
    boat_color=CREAM,
    wave_color=EUCA_LIGHT,
    wake_color=CREAM,
) -> None:
    """Draw the production Essential Crossing mark."""
    # A soft four-point north star (astroid), bold enough at 16-48 px.
    star = []
    for index in range(128):
        angle = 2 * math.pi * index / 128
        star.append(
            (
                32 + 6.8 * math.cos(angle) ** 3,
                12.35 + 6.85 * math.sin(angle) ** 3,
            )
        )
    draw.polygon(transformed(star, scale), fill=star_color)

    # Two broad sails with a durable strip of negative space for the mast.
    left_sail = (
        [(30.7, 28.5), (30.7, 43.7)]
        + cubic((30.7, 43.7), (28.0, 43.5), (25.5, 43.0), (23.4, 42.2))[1:]
    )
    right_sail = (
        [(32.3, 23.3), (42.7, 41.9)]
        + cubic((42.7, 41.9), (39.5, 43.2), (35.9, 43.7), (32.3, 43.8))[1:]
    )
    draw.polygon(transformed(left_sail, scale), fill=boat_color)
    draw.polygon(transformed(right_sail, scale), fill=boat_color)

    # Symmetrical rounded hull for a clear iPhone home-screen silhouette.
    hull = (
        cubic((19.4, 41.9), (25.8, 45.2), (38.2, 45.2), (44.6, 41.9))
        + cubic((44.6, 41.9), (43.6, 46.6), (40.8, 49.6), (36.6, 51.3))[1:]
        + cubic((36.6, 51.3), (33.6, 52.6), (30.4, 52.6), (27.4, 51.3))[1:]
        + cubic((27.4, 51.3), (23.2, 49.6), (20.4, 46.6), (19.4, 41.9))[1:]
    )
    draw.polygon(transformed(hull, scale), fill=boat_color)

    # The calm main wave and small cream wake retain the motion from option A.
    main_wave = (
        cubic((17.3, 54.1), (22.5, 47.9), (28.6, 47.4), (35.2, 50.8))
        + cubic((35.2, 50.8), (41.2, 53.9), (45.4, 54.7), (49.2, 51.2))[1:]
        + cubic((49.2, 51.2), (45.6, 56.3), (40.8, 56.5), (34.2, 53.1))[1:]
        + cubic((34.2, 53.1), (27.5, 49.7), (22.2, 50.1), (17.3, 54.1))[1:]
    )
    light_wake = (
        cubic((22.6, 54.3), (26.7, 51.8), (30.7, 52.1), (36.5, 55.8))
        + cubic((36.5, 55.8), (31.7, 54.2), (27.7, 53.1), (22.6, 54.3))[1:]
    )
    draw.polygon(transformed(main_wave, scale), fill=wave_color)
    draw.polygon(transformed(light_wake, scale), fill=wake_color)


def rounded_square(size: int, radius: int) -> Image.Image:
    """Rounded field with transparent corners for purpose=any icons."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle(
        [0, 0, size - 1, size - 1],
        radius=radius,
        fill=(*EUCA_DEEP, 255),
    )
    return img


def full_square(size: int) -> Image.Image:
    """Opaque field for maskable and Apple touch icons."""
    return Image.new("RGB", (size, size), EUCA_DEEP)


def save_resized(img: Image.Image, name: str, size: int) -> None:
    output = img.resize((size, size), Image.Resampling.LANCZOS)
    output.save(OUT_DIR / name, optimize=True)
    print(name)


def make_icons() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # Standard purpose=any icons keep transparent rounded corners.
    for target in (192, 512):
        img = rounded_square(MASTER, int(MASTER * 0.225))
        draw_north_star_crossing(ImageDraw.Draw(img), scale=0.94)
        save_resized(img, f"icon-{target}.png", target)

    # Maskable: opaque square and slightly smaller mark inside the safe circle.
    img = full_square(MASTER)
    draw_north_star_crossing(ImageDraw.Draw(img), scale=0.88)
    save_resized(img, "icon-maskable-512.png", 512)

    # Apple: opaque 180px image; iOS applies its own rounded home-screen mask.
    img = full_square(MASTER)
    draw_north_star_crossing(ImageDraw.Draw(img), scale=0.94)
    save_resized(img, "apple-touch-icon.png", 180)
    # A versioned URL avoids Safari reusing the legacy pan icon from its cache.
    save_resized(img, "apple-touch-icon-v2.png", 180)

    # Android notification badges are monochrome masks, not full-color icons.
    badge = Image.new("RGBA", (MASTER, MASTER), (0, 0, 0, 0))
    draw_north_star_crossing(
        ImageDraw.Draw(badge),
        scale=0.90,
        star_color=BADGE_WHITE,
        boat_color=BADGE_WHITE,
        wave_color=BADGE_WHITE,
        wake_color=BADGE_WHITE,
    )
    save_resized(badge, "notification-badge.png", 96)


if __name__ == "__main__":
    make_icons()
    print(f"Done - icons written to {OUT_DIR}")
