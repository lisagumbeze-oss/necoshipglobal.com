"""Generate a dark equirectangular world-map SVG from Natural Earth land GeoJSON."""
from __future__ import annotations

import json
import os
import urllib.request

SRC = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson"
OUT = os.path.join(
    os.path.dirname(__file__),
    "..",
    "public",
    "images",
    "hero",
    "world-map-dark.svg",
)

W, H = 1200, 600


def project(lon: float, lat: float) -> tuple[float, float]:
    x = (lon + 180) / 360 * W
    y = (90 - lat) / 180 * H
    return x, y


def ring_to_path(ring: list) -> str:
    if not ring:
        return ""
    parts: list[str] = []
    for i, coord in enumerate(ring):
        lon, lat = coord[0], coord[1]
        x, y = project(lon, lat)
        parts.append(("M" if i == 0 else "L") + f"{x:.2f},{y:.2f}")
    parts.append("Z")
    return " ".join(parts)


def main() -> None:
    print("downloading", SRC)
    with urllib.request.urlopen(SRC, timeout=90) as response:
        data = json.load(response)

    paths: list[str] = []
    for feat in data["features"]:
        geom = feat["geometry"]
        if geom["type"] == "Polygon":
            for ring in geom["coordinates"]:
                paths.append(ring_to_path(ring))
        elif geom["type"] == "MultiPolygon":
            for poly in geom["coordinates"]:
                for ring in poly:
                    paths.append(ring_to_path(ring))

    d = " ".join(p for p in paths if p)
    out_path = os.path.abspath(OUT)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    svg = (
        f'<?xml version="1.0" encoding="UTF-8"?>\n'
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" '
        f'width="{W}" height="{H}" fill="none">\n'
        f'  <rect width="{W}" height="{H}" fill="#062853"/>\n'
        f'  <path fill="#8FA3B8" fill-opacity="0.38" stroke="#C5D0DC" '
        f'stroke-opacity="0.22" stroke-width="0.4" d="{d}"/>\n'
        f"</svg>\n"
    )
    with open(out_path, "w", encoding="utf-8") as handle:
        handle.write(svg)
    print("wrote", out_path, "bytes", os.path.getsize(out_path), "rings", len(paths))


if __name__ == "__main__":
    main()
