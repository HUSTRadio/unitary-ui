#!/usr/bin/env python
"""Compare one official/local evidence cell and emit deterministic artifacts.

Task 4 语义化升级：输入 metrics JSON 可含 roles（按语义角色对齐而非仅 DOM path）、
可含 viewports（同一 role 在不同 viewport 的 rect/style 变化输出为 responsiveDelta），
并对 fontFamily / Lucide icon path 做字段级豁免（绝不抹掉尺寸/位置/颜色/ARIA 差异）。

向后兼容：旧 CLI 参数（--official-image/--local-image/--official-metrics/
--local-metrics/--out/--pixel-threshold/--geometry-threshold）不变，
comparison.json 保留 schemaVersion=1 时代的全部字段，并新增 schemaVersion=2、
roleComparisons、missingRoles、unexpectedRoles、responsiveDelta 以及
pixelDiff / missingPaths / normalizedGeometry 三个规范别名。
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any

from PIL import Image, ImageChops

# 只豁免这两个类别的字段级差异；其余任何字段差异都照常 FAIL。
ICON_FIELDS = {"backgroundImage", "content", "pseudoContent", "maskImage", "-webkit-mask-image"}
PATH_ATTR_RE = re.compile(r"""d\s*=\s*["'][^"']*["']""")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--official-image", required=True)
    parser.add_argument("--local-image", required=True)
    parser.add_argument("--official-metrics", required=True)
    parser.add_argument("--local-metrics", required=True)
    parser.add_argument("--out", required=True)
    parser.add_argument("--pixel-threshold", type=int, default=0)
    parser.add_argument("--geometry-threshold", type=float, default=0.0)
    parser.add_argument("--manifest", default=None)
    return parser.parse_args()


def load_json(path: str) -> dict[str, Any]:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def clean_number(value: float) -> int | float:
    return int(value) if value.is_integer() else value


def viewport_sort_key(viewport: str) -> int:
    match = re.match(r"(\d+)", viewport)
    return int(match.group(1)) if match else 0


def effective_viewports(metrics: dict[str, Any]) -> dict[str, dict[str, Any]]:
    """把 metrics 展开为按 viewport 文本排序的 {viewport: metrics body}。

    顶层 body 即主 viewport（metrics.viewport，缺省 "default"）；
    metrics.viewports 提供其余 viewport 的 body。缺失 viewports 时退化为单 viewport。
    """
    body = dict(metrics)
    extra = body.pop("viewports", None)
    viewports: dict[str, dict[str, Any]] = {
        str(body.get("viewport") or "default"): body,
    }
    if isinstance(extra, dict):
        for key, entry in extra.items():
            if isinstance(entry, dict):
                viewports[str(key)] = entry
    return dict(sorted(viewports.items(), key=lambda item: viewport_sort_key(item[0])))


def normalize_aria(aria: Any) -> dict[str, Any]:
    if not isinstance(aria, dict):
        return {}
    merged = dict(aria.get("attributes") or {})
    for key, value in aria.items():
        if key != "attributes":
            merged[key] = value
    return merged


def viewport_roles(metrics_body: dict[str, Any]) -> dict[str, dict[str, Any]]:
    """按 root 归一化每个 role 的 rect，并整理 styles / aria / ancestorChain。"""
    root = metrics_body.get("root") or {}
    root_x = float(root.get("x", 0))
    root_y = float(root.get("y", 0))
    roles: dict[str, dict[str, Any]] = {}
    for role, entry in (metrics_body.get("roles") or {}).items():
        if not isinstance(entry, dict):
            continue
        if not entry.get("present", True):
            # present:false 声明角色实际缺席：不参与双方在场的全量比较，
            # 由 MISSING_ROLE / UNEXPECTED_ROLE 分类承载。
            continue
        rect = entry.get("rect") or {}
        roles[str(role)] = {
            "selector": entry.get("selector"),
            "present": bool(entry.get("present", True)),
            "rect": {
                "x": float(rect.get("x", 0)) - root_x,
                "y": float(rect.get("y", 0)) - root_y,
                "width": float(rect.get("width", 0)),
                "height": float(rect.get("height", 0)),
            },
            "styles": entry.get("styles") or {},
            "aria": normalize_aria(entry.get("aria")),
            "ancestorChain": entry.get("ancestorChain"),
        }
    return roles


def parse_font_family_token(value: Any) -> str | None:
    """Extract the primary family token from a CSS font-family computed value."""
    if not isinstance(value, str):
        return None
    # Split on comma, take first, strip quotes and whitespace
    parts = value.split(",")
    if not parts:
        return None
    token = parts[0].strip().strip("\"'").strip()
    if not token:
        return None
    # Normalize: collapse internal whitespace, lowercase
    return " ".join(token.split()).lower()


def is_approved_font_mapping(
    official_value: Any,
    local_value: Any,
    approved_mappings: list[dict[str, str]],
) -> bool:
    """Check if a fontFamily difference matches an approved mapping in the manifest policy."""
    official_token = parse_font_family_token(official_value)
    local_token = parse_font_family_token(local_value)
    if official_token is None or local_token is None:
        return False
    for mapping in approved_mappings:
        if (
            parse_font_family_token(mapping.get("officialPrimaryFamily", "")) == official_token
            and parse_font_family_token(mapping.get("localPrimaryFamily", "")) == local_token
        ):
            return True
    return False


def field_exemption(
    field: str,
    official: Any,
    local: Any,
    manifest: dict[str, Any] | None,
) -> str | None:
    """Field-level exemption driven by manifest acceptancePolicy, not hardcoded.

    Without a manifest, no exemption is granted: all differences are strict failures.
    """
    if field == "fontFamily":
        if manifest is None:
            return None
        approved = manifest.get("acceptancePolicy", {}).get("approvedFontMappings", [])
        if is_approved_font_mapping(official, local, approved):
            return "FONT_FAMILY_MAPPING"
        return None
    # ICON_PATH is no longer a valid exemption: the v3 taxonomy has no such classification.
    return None


def compare_styles_pair(
    expected: dict[str, Any],
    actual: dict[str, Any],
    manifest: dict[str, Any] | None = None,
    role: str | None = None,
) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    failures: list[dict[str, Any]] = []
    exemptions: list[dict[str, Any]] = []
    for field in sorted(set(expected) | set(actual)):
        official_value = expected.get(field)
        local_value = actual.get(field)
        if official_value == local_value:
            continue
        reason = field_exemption(field, official_value, local_value, manifest)
        if reason is not None:
            exemptions.append(
                {
                    "field": field,
                    "reason": reason,
                    "official": official_value,
                    "local": local_value,
                    "role": role,
                }
            )
        else:
            failures.append({"field": field, "official": official_value, "local": local_value})
    return failures, exemptions


def compare_aria_pair(expected: dict[str, Any], actual: dict[str, Any]) -> tuple[list[dict[str, Any]], list[str]]:
    failures: list[dict[str, Any]] = []
    matched: list[str] = []
    for field in sorted(set(expected) | set(actual)):
        official_value = expected.get(field)
        local_value = actual.get(field)
        if official_value == local_value:
            matched.append(field)
        else:
            failures.append({"field": field, "official": official_value, "local": local_value})
    return failures, matched


def clean_rect(rect: dict[str, float]) -> dict[str, int | float]:
    return {key: clean_number(value) for key, value in rect.items()}


def compare_role_pair(
    official: dict[str, Any] | None,
    local: dict[str, Any] | None,
    threshold: float,
    manifest: dict[str, Any] | None = None,
    role: str | None = None,
) -> dict[str, Any] | None:
    """比较同一语义 role 的 official/local 归一化数据；单侧缺失返回缺失分类。"""
    if official is None and local is None:
        return None
    if official is not None and local is None:
        return {
            "classification": "MISSING_ROLE",
            "selector": {"official": official["selector"]},
            "rect": {"official": clean_rect(official["rect"]), "local": None, "delta": None, "max_delta_px": None},
            "styles": {"failures": [], "exemptions": []},
            "aria": {"failures": [], "matched": []},
        }
    if official is None and local is not None:
        return {
            "classification": "UNEXPECTED_ROLE",
            "selector": {"local": local["selector"]},
            "rect": {"official": None, "local": clean_rect(local["rect"]), "delta": None, "max_delta_px": None},
            "styles": {"failures": [], "exemptions": []},
            "aria": {"failures": [], "matched": []},
        }
    rect_delta = {
        key: abs(official["rect"][key] - local["rect"][key]) for key in ("x", "y", "width", "height")
    }
    max_delta = max(rect_delta.values())
    style_failures, style_exemptions = compare_styles_pair(
        official["styles"], local["styles"], manifest, role
    )
    aria_failures, aria_matched = compare_aria_pair(official["aria"], local["aria"])
    classification = "MATCH"
    if max_delta > threshold or style_failures or aria_failures:
        classification = "MISMATCH"
    return {
        "classification": classification,
        "selector": {"official": official["selector"], "local": local["selector"]},
        "rect": {
            "official": clean_rect(official["rect"]),
            "local": clean_rect(local["rect"]),
            "delta": {key: clean_number(value) for key, value in rect_delta.items()},
            "max_delta_px": clean_number(max_delta),
        },
        "styles": {"failures": style_failures, "exemptions": style_exemptions},
        "aria": {"failures": aria_failures, "matched": aria_matched},
        "ancestorChain": {"official": official["ancestorChain"], "local": local["ancestorChain"]},
    }


def compare_roles_by_viewport(
    official_metrics: dict[str, Any],
    local_metrics: dict[str, Any],
    threshold: float,
    manifest: dict[str, Any] | None = None,
) -> tuple[dict[str, list[dict[str, Any]]], list[dict[str, Any]], list[dict[str, Any]]]:
    official_viewports = effective_viewports(official_metrics)
    local_viewports = effective_viewports(local_metrics)
    role_comparisons: dict[str, list[dict[str, Any]]] = {}
    missing_roles: list[dict[str, Any]] = []
    unexpected_roles: list[dict[str, Any]] = []
    for viewport in sorted(set(official_viewports) | set(local_viewports), key=viewport_sort_key):
        # viewport 只存在于一侧时不做角色噪音比较（属于结构差异，由 responsiveDelta 语境承载）
        if viewport not in official_viewports or viewport not in local_viewports:
            continue
        official_roles = viewport_roles(official_viewports[viewport])
        local_roles = viewport_roles(local_viewports[viewport])
        rows: list[dict[str, Any]] = []
        for role in sorted(set(official_roles) | set(local_roles)):
            row = compare_role_pair(
                official_roles.get(role), local_roles.get(role), threshold, manifest, role
            )
            if row is None:
                continue
            row["role"] = role
            row["viewport"] = viewport
            if row["classification"] == "MISSING_ROLE":
                missing_roles.append(
                    {"role": role, "viewport": viewport, "selector": row["selector"]["official"]}
                )
            elif row["classification"] == "UNEXPECTED_ROLE":
                unexpected_roles.append(
                    {"role": role, "viewport": viewport, "selector": row["selector"]["local"]}
                )
            rows.append(row)
        role_comparisons[viewport] = rows
    return role_comparisons, missing_roles, unexpected_roles


def _role_presence(roles: dict[str, dict[str, Any]], role: str) -> bool:
    entry = roles.get(role)
    return entry is not None and entry["present"]


def _rect_delta_across(
    roles_a: dict[str, dict[str, Any]], roles_b: dict[str, dict[str, Any]], role: str
) -> tuple[dict[str, float] | None, list[str]]:
    entry_a, entry_b = roles_a.get(role), roles_b.get(role)
    if (
        entry_a is None
        or entry_b is None
        or not entry_a["present"]
        or not entry_b["present"]
    ):
        return None, []
    delta = {key: entry_b["rect"][key] - entry_a["rect"][key] for key in ("x", "y", "width", "height")}
    changes = [
        field
        for field in sorted(set(entry_a["styles"]) | set(entry_b["styles"]))
        if entry_a["styles"].get(field) != entry_b["styles"].get(field)
    ]
    return delta, changes


def compute_responsive_delta(
    official_metrics: dict[str, Any],
    local_metrics: dict[str, Any],
    threshold: float,
) -> list[dict[str, Any]]:
    """按同一 role 在相邻 viewport 间的 rect/style 变化输出，绝不折算成像素误差。"""
    official_viewports = effective_viewports(official_metrics)
    local_viewports = effective_viewports(local_metrics)
    ordered = [vp for vp in official_viewports if vp in local_viewports]
    entries: list[dict[str, Any]] = []
    for viewport_a, viewport_b in zip(ordered, ordered[1:]):
        official_a = viewport_roles(official_viewports[viewport_a])
        official_b = viewport_roles(official_viewports[viewport_b])
        local_a = viewport_roles(local_viewports[viewport_a])
        local_b = viewport_roles(local_viewports[viewport_b])
        roles = sorted(
            set(official_a) | set(official_b) | set(local_a) | set(local_b)
        )
        for role in roles:
            official_delta, official_changes = _rect_delta_across(official_a, official_b, role)
            local_delta, local_changes = _rect_delta_across(local_a, local_b, role)
            official_present = (_role_presence(official_a, role), _role_presence(official_b, role))
            local_present = (_role_presence(local_a, role), _role_presence(local_b, role))
            # 角色必须至少在两个来源各出现一次才有“同一 role 响应式变化”可比；
            # 完全缺失于某一侧（item/portal）由 MISSING/UNEXPECTED_ROLE 承载。
            if not (any(official_present) and any(local_present)):
                continue
            # 只有某一侧在 viewport 间发生变化才算响应式差异；
            # 双侧都存在但始终不一致（如 item/portal）由 MISSING/UNEXPECTED_ROLE 承载，不进 responsiveDelta。
            changed = (
                official_present[0] != official_present[1]
                or local_present[0] != local_present[1]
                or any((official_delta or {}).values())
                or any((local_delta or {}).values())
                or bool(official_changes)
                or bool(local_changes)
            )
            if not changed:
                continue
            reasons: list[str] = []
            if (official_present[0] != official_present[1]) != (local_present[0] != local_present[1]):
                reasons.append(
                    f"presence pattern differs: official {official_present[0]}->{official_present[1]}, "
                    f"local {local_present[0]}->{local_present[1]}"
                )
            if official_delta is not None and local_delta is not None:
                for axis in ("x", "y", "width", "height"):
                    if abs(official_delta[axis] - local_delta[axis]) > threshold:
                        reasons.append(
                            f"{axis} delta official {clean_number(official_delta[axis])} "
                            f"vs local {clean_number(local_delta[axis])}"
                        )
            if set(official_changes) != set(local_changes):
                reasons.append(
                    f"style changes differ: official {official_changes} vs local {local_changes}"
                )
            classification = "RESPONSIVE_STRUCTURE_DELTA" if reasons else "MATCH"
            entries.append(
                {
                    "role": role,
                    "viewportA": viewport_a,
                    "viewportB": viewport_b,
                    "classification": classification,
                    "official": {
                        "present": {viewport_a: official_present[0], viewport_b: official_present[1]},
                        "rectDelta": (
                            {key: clean_number(value) for key, value in official_delta.items()}
                            if official_delta is not None
                            else None
                        ),
                        "styleChanges": official_changes,
                    },
                    "local": {
                        "present": {viewport_a: local_present[0], viewport_b: local_present[1]},
                        "rectDelta": (
                            {key: clean_number(value) for key, value in local_delta.items()}
                            if local_delta is not None
                            else None
                        ),
                        "styleChanges": local_changes,
                    },
                    "reasons": reasons,
                }
            )
    return entries


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

    manifest: dict[str, Any] | None = None
    if args.manifest:
        manifest = load_json(args.manifest)

    official_image = Image.open(args.official_image).convert("RGBA")
    local_image = Image.open(args.local_image).convert("RGBA")
    official_size = official_image.size
    local_size = local_image.size
    dimension_mismatch = official_size != local_size
    canvas_size = (max(official_size[0], local_size[0]), max(official_size[1], local_size[1]))
    if dimension_mismatch:
        official_canvas = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
        local_canvas = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
        official_canvas.paste(official_image, (0, 0))
        local_canvas.paste(local_image, (0, 0))
        official_image = official_canvas
        local_image = local_canvas

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
    role_comparisons, missing_roles, unexpected_roles = compare_roles_by_viewport(
        official_metrics, local_metrics, args.geometry_threshold, manifest
    )
    responsive_delta = compute_responsive_delta(
        official_metrics, local_metrics, args.geometry_threshold
    )
    role_failures = any(
        row["classification"] != "MATCH"
        for rows in role_comparisons.values()
        for row in rows
    )
    responsive_failures = any(
        entry["classification"] == "RESPONSIVE_STRUCTURE_DELTA" for entry in responsive_delta
    )
    passed = (
        not dimension_mismatch
        and changed_pixels == 0
        and geometry["max_geometry_delta_px"] <= args.geometry_threshold
        and not geometry["missing_paths"]
        and not style_failures
        and not role_failures
        and not responsive_failures
    )
    pixel = {
        "changed_pixels": changed_pixels,
        "total_pixels": total_pixels,
        "changed_ratio": changed_pixels / total_pixels if total_pixels else 0,
        "threshold": args.pixel_threshold,
        "dimension_mismatch": dimension_mismatch,
        "image_dimensions": {
            "official": {"width": official_size[0], "height": official_size[1]},
            "local": {"width": local_size[0], "height": local_size[1]},
            "canvas": {"width": canvas_size[0], "height": canvas_size[1]},
        },
    }
    # Collect strictFailures and approvedExclusions from role comparisons
    strict_failures_v3: list[dict[str, Any]] = []
    approved_exclusions_v3: list[dict[str, Any]] = []
    for rows in role_comparisons.values():
        for row in rows:
            role_name = row.get("role", "unknown")
            for failure in row.get("styles", {}).get("failures", []):
                strict_failures_v3.append(
                    {
                        "classification": "STYLE_MISMATCH",
                        "scope": "role",
                        "role": role_name,
                        "field": failure["field"],
                        "official": failure["official"],
                        "local": failure["local"],
                    }
                )
            for exemption in row.get("styles", {}).get("exemptions", []):
                approved_exclusions_v3.append(
                    {
                        "classification": exemption["reason"],
                        "scope": "role",
                        "role": role_name,
                        "fields": [exemption["field"]],
                        "official": exemption["official"],
                        "local": exemption["local"],
                    }
                )
            for failure in row.get("aria", {}).get("failures", []):
                strict_failures_v3.append(
                    {
                        "classification": "ARIA_MISMATCH",
                        "scope": "role",
                        "role": role_name,
                        "field": failure["field"],
                        "official": failure["official"],
                        "local": failure["local"],
                    }
                )
            if row.get("classification") == "MISSING_ROLE":
                strict_failures_v3.append(
                    {"classification": "MISSING_ROLE", "scope": "role", "role": role_name}
                )
            elif row.get("classification") == "UNEXPECTED_ROLE":
                strict_failures_v3.append(
                    {"classification": "UNEXPECTED_ROLE", "scope": "role", "role": role_name}
                )

    # Without manifest: any style failure that was previously exempted is now a strict failure
    if manifest is None:
        # All style differences are already in failures because field_exemption returns None
        pass

    # Determine v3 semantic status
    has_strict_failures = bool(strict_failures_v3)
    has_non_font_failures = any(
        f.get("field") != "fontFamily" for f in strict_failures_v3
    )
    has_geometry_failures = (
        geometry["max_geometry_delta_px"] > args.geometry_threshold
        or bool(geometry["missing_paths"])
    )
    semantic_acceptance_status: str
    if has_non_font_failures or dimension_mismatch or has_geometry_failures:
        semantic_acceptance_status = "FAIL"
    elif manifest is None and has_strict_failures:
        # Without manifest, font-only differences cannot be evaluated: BLOCK, not FAIL
        semantic_acceptance_status = "BLOCKED"
    elif has_strict_failures:
        # Manifest present but font pair not approved: FAIL
        semantic_acceptance_status = "FAIL"
    else:
        semantic_acceptance_status = "PASS"

    diagnostic_pixel_status = "IDENTICAL" if changed_pixels == 0 else "DIFFERENT"

    report = {
        "schemaVersion": 3,
        "diagnosticPixelStatus": diagnostic_pixel_status,
        "semanticAcceptanceStatus": semantic_acceptance_status,
        "status": semantic_acceptance_status,
        "strictFailures": strict_failures_v3,
        "approvedExclusions": approved_exclusions_v3,
        "pixel": pixel,
        "pixelDiff": pixel,
        "geometry": geometry,
        "normalizedGeometry": geometry,
        "missingPaths": geometry["missing_paths"],
        "style_failures": style_failures,
        "approved_exclusions": [],
        "roleComparisons": role_comparisons,
        "missingRoles": missing_roles,
        "unexpectedRoles": unexpected_roles,
        "responsiveDelta": responsive_delta,
        "artifacts": {"diff": "diff.png", "overlay": "overlay.png"},
    }
    (out / "comparison.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps(report, ensure_ascii=False))


if __name__ == "__main__":
    main()
