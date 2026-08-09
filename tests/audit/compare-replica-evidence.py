#!/usr/bin/env python
"""Compare one official/local evidence cell and emit deterministic artifacts."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

from PIL import Image, ImageChops


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--official-image", required=True)
    parser.add_argument("--local-image", required=True)
    parser.add_argument("--official-metrics", required=True)
    parser.add_argument("--local-metrics", required=True)
    parser.add_argument("--out", required=True)
    parser.add_argument("--pixel-threshold", type=int, default=0)
    parser.add_argument("--geometry-threshold", type=float, default=0.0)
    return parser.parse_args()


def load_json(path: str) -> dict[str, Any]:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def normalized_nodes(metrics: dict[str, Any]) -> dict[str, dict[str, Any]]:
    root = metrics.get("root", {})
    root_x = float(root.get("x", 0))
    root_y = float(root.get("y", 0))
    normalized: dict[str, dict[str, Any]] = {}
    for node in metrics.get("nodes", []):
        rect = node.get("rect", {})
        normalized[str(node.get("path"))] = {
            "rect": {
                "x": float(rect.get("x", 0)) - root_x,
                "y": float(rect.get("y", 0)) - root_y,
                "width": float(rect.get("width", 0)),
                "height": float(rect.get("height", 0)),
            },
            "styles": node.get("styles", {}),
        }
    return normalized


def clean_number(value: float) -> int | float:
    return int(value) if value.is_integer() else value


def compare_geometry(official: dict[str, Any], local: dict[str, Any]) -> dict[str, Any]:
    official_nodes = normalized_nodes(official)
    local_nodes = normalized_nodes(local)
    rows = []
    max_delta = 0.0
    missing = []
    for path in sorted(set(official_nodes) | set(local_nodes)):
        if path not in official_nodes or path not in local_nodes:
            missing.append(path)
            continue
        expected = official_nodes[path]["rect"]
        actual = local_nodes[path]["rect"]
        deltas = {key: abs(expected[key] - actual[key]) for key in expected}
        max_delta = max(max_delta, *deltas.values())
        rows.append(
            {
                "path": path,
                "official": {key: clean_number(value) for key, value in expected.items()},
                "local": {key: clean_number(value) for key, value in actual.items()},
                "delta": {key: clean_number(value) for key, value in deltas.items()},
            }
        )
    return {
        "max_geometry_delta_px": clean_number(max_delta),
        "missing_paths": missing,
        "nodes": rows,
    }


def compare_styles(official: dict[str, Any], local: dict[str, Any]) -> list[dict[str, Any]]:
    official_nodes = normalized_nodes(official)
    local_nodes = normalized_nodes(local)
    failures = []
    for path in sorted(set(official_nodes) & set(local_nodes)):
        expected = official_nodes[path]["styles"]
        actual = local_nodes[path]["styles"]
        for field in sorted(set(expected) | set(actual)):
            if expected.get(field) != actual.get(field):
                failures.append(
                    {
                        "path": path,
                        "field": field,
                        "official": expected.get(field),
                        "local": actual.get(field),
                    }
                )
    return failures


def main() -> None:
    args = parse_args()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    official_image = Image.open(args.official_image).convert("RGBA")
    local_image = Image.open(args.local_image).convert("RGBA")
    if official_image.size != local_image.size:
        raise ValueError(
            f"Image dimensions differ: official={official_image.size}, local={local_image.size}"
        )

    raw_diff = ImageChops.difference(official_image, local_image)
    changed_pixels = sum(
        1 for pixel in raw_diff.get_flattened_data() if max(pixel) > args.pixel_threshold
    )
    total_pixels = official_image.width * official_image.height
    raw_diff.save(out / "diff.png")
    Image.blend(official_image, local_image, 0.5).save(out / "overlay.png")

    official_metrics = load_json(args.official_metrics)
    local_metrics = load_json(args.local_metrics)
    geometry = compare_geometry(official_metrics, local_metrics)
    style_failures = compare_styles(official_metrics, local_metrics)
    passed = (
        changed_pixels == 0
        and geometry["max_geometry_delta_px"] <= args.geometry_threshold
        and not geometry["missing_paths"]
        and not style_failures
    )
    report = {
        "status": "PASS" if passed else "FAIL",
        "pixel": {
            "changed_pixels": changed_pixels,
            "total_pixels": total_pixels,
            "changed_ratio": changed_pixels / total_pixels if total_pixels else 0,
            "threshold": args.pixel_threshold,
        },
        "geometry": geometry,
        "style_failures": style_failures,
        "approved_exclusions": [],
        "artifacts": {"diff": "diff.png", "overlay": "overlay.png"},
    }
    (out / "comparison.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps(report, ensure_ascii=False))


if __name__ == "__main__":
    main()
