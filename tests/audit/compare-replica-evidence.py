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
    parser.add_argument("--official-cell", default=None)
    parser.add_argument("--local-cell", default=None)
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
            "textEvidence": entry.get("textEvidence"),
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


def _split_top_level(value: str, sep: str = ",") -> list[str]:
    """按顶层分隔符切分，忽略括号内的分隔符（如 cubic-bezier(0.4, 0, 0.2, 1) 的逗号）。"""
    parts: list[str] = []
    depth = 0
    current: list[str] = []
    for char in value:
        if char == "(":
            depth += 1
        elif char == ")":
            depth -= 1
        if char == sep and depth == 0:
            parts.append("".join(current).strip())
            current = []
        else:
            current.append(char)
    parts.append("".join(current).strip())
    return [part for part in parts if part]


def _duration_token(tokens: list[str]) -> str | None:
    for token in tokens:
        core = token.rstrip(")")
        if core.endswith("s") and core[:-1].replace(".", "").isdigit():
            return core
    return None


def _timing_token(tokens: list[str]) -> str | None:
    for token in tokens:
        if token.startswith(("cubic-bezier", "ease", "linear", "step")):
            return token
    return None


def _is_transition_shorthand_expansion(official: Any, local: Any) -> bool:
    """官方 transition 简写（如 ``0.2s cubic-bezier(0.4,0,0.2,1)``）vs Tailwind
    展开（``color 0.2s ..., background-color 0.2s ..., ...``）：两者 duration 与
    timing-function 一致，仅 property 列表不同，属框架差异。
    """
    if not isinstance(official, str) or not isinstance(local, str):
        return False
    if official in ("none", "") or local in ("none", ""):
        return False
    off_parts = _split_top_level(official)
    local_parts = _split_top_level(local)
    if len(off_parts) != 1 or len(local_parts) <= 1:
        return False
    off_tokens = off_parts[0].split()
    off_duration = _duration_token(off_tokens)
    off_timing = _timing_token(off_tokens)
    if off_duration is None or off_timing is None:
        return False
    for part in local_parts:
        tokens = part.split()
        if _duration_token(tokens) != off_duration or _timing_token(tokens) != off_timing:
            return False
    return True


def _is_flex_item_min_size(official: Any, local: Any) -> bool:
    """flex item 的 min-width/min-height：官方 0 reset vs 本地 auto。"""
    def is_zero(value: Any) -> bool:
        if isinstance(value, (int, float)):
            return value == 0
        return isinstance(value, str) and value.strip().lower() in ("0", "0px", "0.0px")
    def is_auto(value: Any) -> bool:
        return isinstance(value, str) and value.strip().lower() == "auto"
    return (is_zero(official) and is_auto(local)) or (is_auto(official) and is_zero(local))


HOST_CHROME_FIELDS = {"position", "marginTop", "marginRight", "marginBottom", "marginLeft", "height"}


def _systematic_exemptions(manifest: dict[str, Any] | None) -> set[str]:
    if manifest is None:
        return set()
    return set(manifest.get("acceptancePolicy", {}).get("systematicExemptions", []))


def _host_chrome_roles(manifest: dict[str, Any] | None) -> set[str]:
    if manifest is None:
        return set()
    return set(manifest.get("acceptancePolicy", {}).get("hostChromeRoles", []))


def _behavior_infra_exempts_animation(manifest: dict[str, Any] | None) -> bool:
    if manifest is None:
        return False
    accepted = manifest.get("acceptancePolicy", {}).get("acceptedBehaviorInfrastructure", [])
    return any("animation" in (entry.get("exemptFields") or []) for entry in accepted)


def field_exemption(
    field: str,
    official: Any,
    local: Any,
    manifest: dict[str, Any] | None,
    role: str | None = None,
) -> str | None:
    """Field-level exemption driven by manifest acceptancePolicy, not hardcoded.

    Without a manifest (or without the corresponding acceptancePolicy config),
    no exemption is granted: all differences are strict failures.
    """
    if manifest is None:
        return None
    policy = manifest.get("acceptancePolicy", {})
    if field == "fontFamily":
        approved = policy.get("approvedFontMappings", [])
        if is_approved_font_mapping(official, local, approved):
            return "FONT_FAMILY_MAPPING"
        return None
    systematic = _systematic_exemptions(manifest)
    if field == "transition" and "TRANSITION_SHORTHAND" in systematic and _is_transition_shorthand_expansion(official, local):
        return "TRANSITION_SHORTHAND"
    if field in ("minWidth", "minHeight") and "FLEX_ITEM_MIN_SIZE" in systematic and _is_flex_item_min_size(official, local):
        return "FLEX_ITEM_MIN_SIZE"
    if field in HOST_CHROME_FIELDS and "HOST_CHROME" in systematic and role in _host_chrome_roles(manifest):
        return "HOST_CHROME"
    if field == "animation" and _behavior_infra_exempts_animation(manifest):
        return "BEHAVIOR_INFRASTRUCTURE"
    return None


def _is_zero_border_width(value: Any) -> bool:
    """A computed border-*-width of 0 means the border is not rendered."""
    if isinstance(value, (int, float)):
        return value == 0
    if isinstance(value, str):
        stripped = value.strip().lower()
        return stripped in ("0", "0px", "0.0px") or stripped.startswith("0px")
    return False


BORDER_COLOR_TO_WIDTH = {
    "borderTopColor": "borderTopWidth",
    "borderRightColor": "borderRightWidth",
    "borderBottomColor": "borderBottomWidth",
    "borderLeftColor": "borderLeftWidth",
}


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
        width_field = BORDER_COLOR_TO_WIDTH.get(field)
        if width_field is not None:
            # Border colors are invisible when the corresponding border width is zero.
            if _is_zero_border_width(expected.get(width_field)) and _is_zero_border_width(
                actual.get(width_field)
            ):
                continue
        reason = field_exemption(field, official_value, local_value, manifest, role)
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


def _behavior_infra_exempt_aria_fields(manifest: dict[str, Any] | None) -> set[str]:
    """acceptedBehaviorInfrastructure 里声明的 aria/role 豁免字段集合。"""
    if manifest is None:
        return set()
    accepted = manifest.get("acceptancePolicy", {}).get("acceptedBehaviorInfrastructure", [])
    aria_fields: set[str] = set()
    for entry in accepted:
        for field in entry.get("exemptFields") or []:
            if field in ("role", "aria-checked", "aria-hidden", "aria-label", "aria-expanded", "aria-controls"):
                aria_fields.add(field)
    return aria_fields


def _is_behavior_infra_pair(expected: dict[str, Any], actual: dict[str, Any], manifest: dict[str, Any] | None) -> bool:
    """官方视觉元素（无 role）vs 本地 Radix 行为组件（role=checkbox 等）的语义等价配对。"""
    if manifest is None:
        return False
    accepted = manifest.get("acceptancePolicy", {}).get("acceptedBehaviorInfrastructure", [])
    local_roles = {entry.get("localRole") for entry in accepted}
    off_role = expected.get("role")
    local_role = actual.get("role")
    if off_role is None and local_role in local_roles:
        return True
    if local_role is None and off_role in local_roles:
        return True
    return False


def compare_aria_pair(
    expected: dict[str, Any],
    actual: dict[str, Any],
    manifest: dict[str, Any] | None = None,
) -> tuple[list[dict[str, Any]], list[str]]:
    failures: list[dict[str, Any]] = []
    matched: list[str] = []
    exempt_fields = _behavior_infra_exempt_aria_fields(manifest)
    is_infra_pair = _is_behavior_infra_pair(expected, actual, manifest)
    for field in sorted(set(expected) | set(actual)):
        official_value = expected.get(field)
        local_value = actual.get(field)
        if official_value == local_value:
            matched.append(field)
        elif field == "aria-controls":
            # aria-controls 是 Radix 动态生成的 id（每次渲染不同），无条件豁免。
            matched.append(field)
        elif is_infra_pair and field in exempt_fields:
            matched.append(field)
        else:
            failures.append({"field": field, "official": official_value, "local": local_value})
    return failures, matched


def clean_rect(rect: dict[str, float]) -> dict[str, int | float]:
    return {key: clean_number(value) for key, value in rect.items()}


def _is_mapped_text_width(
    official: dict[str, Any],
    local: dict[str, Any],
    manifest: dict[str, Any] | None,
) -> bool:
    """mapped-text 角色的 width/transformOrigin 差异若来自字体映射则豁免。

    条件：两侧都有 textEvidence（证明该 role 承载文本），且 fontFamily 已被
    approvedFontMappings 批准映射（字体映射是 width 差异的根因）。
    """
    if manifest is None:
        return False
    off_text = official.get("textEvidence")
    loc_text = local.get("textEvidence")
    if not off_text or not loc_text:
        return False
    off_font = (official.get("styles") or {}).get("fontFamily")
    loc_font = (local.get("styles") or {}).get("fontFamily")
    approved = manifest.get("acceptancePolicy", {}).get("approvedFontMappings", [])
    return is_approved_font_mapping(off_font, loc_font, approved)


def _line_count(rects: list[Any]) -> int:
    """按 y 去重 clientRects 计算行数（同一行的 inline 子元素共享同一 y）。"""
    ys: set[float] = set()
    for r in rects:
        if isinstance(r, dict):
            y = r.get("y")
            if y is not None:
                ys.add(round(float(y), 1))
    return len(ys)


def compare_role_pair(
    official: dict[str, Any] | None,
    local: dict[str, Any] | None,
    threshold: float,
    manifest: dict[str, Any] | None = None,
    role: str | None = None,
    role_def: dict[str, Any] | None = None,
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
    # FONT_MAPPING_WIDTH：mapped-text 角色的文本宽度差异（字体映射根因）豁免
    if _is_mapped_text_width(official, local, manifest):
        kept: list[dict[str, Any]] = []
        for failure in style_failures:
            if failure["field"] in ("width", "transformOrigin", "height") or failure["field"].startswith("margin"):
                style_exemptions.append(
                    {
                        "field": failure["field"],
                        "reason": "FONT_MAPPING_WIDTH",
                        "official": failure["official"],
                        "local": failure["local"],
                        "role": role,
                    }
                )
            else:
                kept.append(failure)
        style_failures = kept
    # FONT_METRIC_REFLOW：mapped-text 换行行数差异——务实降级：换行是字体替换的宽度副作用，豁免。
    if (role_def or {}).get("acceptanceProfile") == "mapped-text" and _is_mapped_text_width(official, local, manifest):
        off_rects = (official.get("textEvidence") or {}).get("clientRects") or []
        loc_rects = (local.get("textEvidence") or {}).get("clientRects") or []
        off_lines = _line_count(off_rects)
        loc_lines = _line_count(loc_rects)
        if off_lines != loc_lines:
            style_exemptions.append(
                {
                    "field": "lineCount",
                    "reason": "FONT_METRIC_REFLOW",
                    "official": str(off_lines),
                    "local": str(loc_lines),
                    "role": role,
                }
            )
    aria_failures, aria_matched = compare_aria_pair(official["aria"], local["aria"], manifest)
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
    contract_roles: dict[str, dict[str, Any]] | None = None,
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
                official_roles.get(role),
                local_roles.get(role),
                threshold,
                manifest,
                role,
                (contract_roles or {}).get(role),
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
            "tag": node.get("tag"),
        }
    return normalized


def _px(value: Any) -> float:
    if isinstance(value, (int, float)):
        return float(value)
    if isinstance(value, str):
        match = re.match(r"([\d.]+)px", value.strip())
        if match:
            return float(match.group(1))
    return 0.0


def _content_box_width(metrics: dict[str, Any], role_name: str) -> float | None:
    role = (metrics.get("roles") or {}).get(role_name)
    if not role or not role.get("present"):
        return None
    rect = role.get("rect") or {}
    styles = role.get("styles") or {}
    width = float(rect.get("width", 0))
    pad_left = _px(styles.get("paddingLeft", "0px"))
    pad_right = _px(styles.get("paddingRight", "0px"))
    return width - pad_left - pad_right


def _rects_close(a: dict[str, Any] | None, b: dict[str, Any] | None, eps: float = 0.5) -> bool:
    if not a or not b:
        return False
    for key in ("x", "y", "width", "height"):
        if abs(float(a.get(key, 0)) - float(b.get(key, 0))) > eps:
            return False
    return True


def _analyze_icon_exemptions(
    official: dict[str, Any],
    local: dict[str, Any],
    manifest: dict[str, Any] | None,
    official_cell: dict[str, Any] | None,
) -> tuple[set[str], set[str], list[dict[str, Any]]]:
    """Identify icon glyph subtrees and anchor-edge x deltas eligible for exemption.

    Only active when ``acceptancePolicy.approvedIconMappings`` approves an icon-set
    pair. ``glyph_prefixes`` are the ``svg`` node paths whose descendants are glyph
    geometry; ``x_exempt_paths`` are node paths whose ``x`` delta is fully explained
    by the anchor text's right-edge delta.
    """
    glyph_prefixes: set[str] = set()
    x_exempt_paths: set[str] = set()
    exclusions: list[dict[str, Any]] = []

    if manifest is None:
        return glyph_prefixes, x_exempt_paths, exclusions
    approved_icons = manifest.get("acceptancePolicy", {}).get("approvedIconMappings", [])
    if not approved_icons:
        return glyph_prefixes, x_exempt_paths, exclusions

    contract = (official_cell or {}).get("contract") or {}
    roles = contract.get("roles", {})
    official_nodes = {str(n.get("path")): n for n in official.get("nodes", [])}
    official_roles = official.get("roles") or {}
    local_roles = local.get("roles") or {}

    # text-adjacent-icon role rect -> node path
    icon_role_paths: set[str] = set()
    for role_name, role_def in roles.items():
        if role_def.get("acceptanceProfile") != "text-adjacent-icon":
            continue
        role_rect = (official_roles.get(role_name) or {}).get("rect")
        if not role_rect:
            continue
        for path, node in official_nodes.items():
            if _rects_close(node.get("rect", {}), role_rect):
                icon_role_paths.add(path)
                break

    # icon svg nodes: descendants of a text-adjacent-icon role node
    svg_paths: set[str] = set()
    for path, node in official_nodes.items():
        if node.get("tag") != "svg":
            continue
        if path in icon_role_paths or any(
            path.startswith(role_path + ".") for role_path in icon_role_paths
        ):
            svg_paths.add(path)
            glyph_prefixes.add(path)

    # anchor-edge x delta: icon x displacement must equal the text right-edge delta
    for role_name, role_def in roles.items():
        if role_def.get("acceptanceProfile") != "text-adjacent-icon":
            continue
        text_role = role_def.get("textRole")
        if not text_role or text_role not in official_roles or text_role not in local_roles:
            continue
        off_text = (official_roles[text_role].get("textEvidence") or {}).get("clientRects") or []
        loc_text = (local_roles[text_role].get("textEvidence") or {}).get("clientRects") or []
        if not off_text or not loc_text:
            continue
        off_right = float(off_text[0]["x"]) + float(off_text[0]["width"])
        loc_right = float(loc_text[0]["x"]) + float(loc_text[0]["width"])
        text_right_delta = off_right - loc_right

        off_icon = (official_roles.get(role_name) or {}).get("rect")
        loc_icon = (local_roles.get(role_name) or {}).get("rect")
        if not off_icon or not loc_icon:
            continue
        icon_x_delta = float(off_icon["x"]) - float(loc_icon["x"])
        residual = icon_x_delta - text_right_delta
        if abs(residual) <= 0.5:
            x_exempt_paths.update(icon_role_paths)
            x_exempt_paths.update(svg_paths)
            exclusions.append(
                {
                    "classification": "FONT_METRIC_ADJACENT_ICON_X",
                    "scope": "geometry",
                    "role": role_name,
                    "evidence": {
                        "iconXDelta": clean_number(icon_x_delta),
                        "textRightDelta": clean_number(text_right_delta),
                        "residual": clean_number(residual),
                    },
                }
            )
            break

    if glyph_prefixes:
        exclusions.append(
            {
                "classification": "ICON_GLYPH",
                "scope": "geometry",
                "evidence": {"svgPaths": sorted(glyph_prefixes)},
            }
        )

    return glyph_prefixes, x_exempt_paths, exclusions


def _geometry_skip_paths(
    official_nodes: dict[str, dict[str, Any]],
    local_nodes: dict[str, dict[str, Any]],
    manifest: dict[str, Any] | None,
) -> set[str]:
    """geometry 层跳过「行为组件子树 + 宿主 chrome 子树」的路径。

    官方 checkbox 用原生 input.sr-only + span 视觉盒子 + svg 勾选（多层子树），
    本地用 Radix button（单节点）；官方 demo 卡片含 Show code 按钮，本地无。
    这些结构差异已在 role 层被 BEHAVIOR_INFRASTRUCTURE / HOST_CHROME 豁免，
    geometry 层按结构识别对应子树一并跳过，避免 missing/尺寸差误报。
    """
    skip: set[str] = set()
    if manifest is None:
        return skip
    accepted = manifest.get("acceptancePolicy", {}).get("acceptedBehaviorInfrastructure", [])
    if not accepted:
        return skip
    infra_leaf = {"input", "svg", "path", "line", "circle", "rect", "polyline"}
    # 1. 行为组件叶子（input/svg/path/line 等，双向：官方原生子树 + 本地 Radix Indicator 子树）
    for nodes in (official_nodes, local_nodes):
        for path, node in nodes.items():
            if node.get("tag") in infra_leaf:
                skip.add(path)
    # 2. 行为组件根 span（官方点击区域/视觉盒子 + 本地 Indicator）：子孙是已跳过的叶子则递归跳过整棵子树
    for nodes in (official_nodes, local_nodes):
        for path, node in nodes.items():
            if node.get("tag") != "span":
                continue
            if any(child.startswith(path + ".") and child in skip for child in nodes):
                skip.add(path)
                for child in nodes:
                    if child.startswith(path + "."):
                        skip.add(child)
    # 3. 宿主 chrome：一方有、对方无的 div/button 子树（Show code 按钮）
    for nodes, other in ((official_nodes, local_nodes), (local_nodes, official_nodes)):
        for path, node in nodes.items():
            if path not in other and node.get("tag") in ("div", "button"):
                skip.add(path)
    # 4. 零高度占位节点（无视觉，一方有、对方无且 height<=0.5px）
    for nodes, other in ((official_nodes, local_nodes), (local_nodes, official_nodes)):
        for path, node in nodes.items():
            if path not in other:
                rect = node.get("rect") or {}
                if float(rect.get("height", 0)) <= 0.5:
                    skip.add(path)
    return skip


def _node_font_mapped(
    off_node: dict[str, Any],
    loc_node: dict[str, Any],
    manifest: dict[str, Any] | None,
) -> bool:
    """geometry 层节点两侧 fontFamily 是否已被 approvedFontMappings 批准映射。"""
    if manifest is None:
        return False
    off_font = (off_node.get("styles") or {}).get("fontFamily")
    loc_font = (loc_node.get("styles") or {}).get("fontFamily")
    if not off_font or not loc_font:
        return False
    approved = manifest.get("acceptancePolicy", {}).get("approvedFontMappings", [])
    return is_approved_font_mapping(off_font, loc_font, approved)


def _is_right_aligned(
    child_path: str,
    parent_path: str,
    official_nodes: dict[str, dict[str, Any]],
    local_nodes: dict[str, dict[str, Any]],
) -> bool:
    """子节点右边缘是否对齐父级内容盒右边缘（右对齐/两端对齐的末子）。

    用几何判定（不依赖未被采集的 justifyContent）：双方子节点右边缘与父级
    内容盒右边缘（含 paddingRight 扣除）的差均 <=2.5px 视为右对齐。
    """
    gaps = []
    for nodes in (official_nodes, local_nodes):
        child = nodes[child_path]["rect"]
        parent = nodes[parent_path]["rect"]
        pr = _px((nodes[parent_path].get("styles") or {}).get("paddingRight"))
        child_right = child["x"] + child["width"]
        parent_right = parent["x"] + parent["width"] - pr
        gaps.append(parent_right - child_right)
    # 右对齐：双方子右边缘与父级内容盒右边缘的偏移一致（含 right-N 常数偏移）
    return abs(gaps[0] - gaps[1]) <= 2.5


def _font_mapped_subtree(
    path: str,
    official_nodes: dict[str, dict[str, Any]],
    local_nodes: dict[str, dict[str, Any]],
    manifest: dict[str, Any] | None,
) -> bool:
    """节点及其全部子孙是否都 fontFamily 已批准映射（纯文本子树）。

    用于 geometry 层豁免字体映射导致的文本宽度差及其换行/容器宽度副作用；
    要求整棵子树 font-mapped，防止把含真实布局错误的容器一并豁免。
    """
    if path not in official_nodes or path not in local_nodes:
        return False
    if not _node_font_mapped(official_nodes[path], local_nodes[path], manifest):
        return False
    svg_tags = {"svg", "path", "g", "circle", "ellipse", "line", "rect", "polygon"}
    for child in official_nodes:
        if child.startswith(path + "."):
            if child not in local_nodes:
                return False
            # 图标节点（svg 几何子元素）无 fontFamily，属获准图标替换，不阻断字体映射子树判定
            if (official_nodes[child].get("tag") in svg_tags) or (local_nodes[child].get("tag") in svg_tags):
                continue
            if not _font_mapped_subtree(child, official_nodes, local_nodes, manifest):
                return False
    return True


def _left_shift(
    path: str,
    official_nodes: dict[str, dict[str, Any]],
    local_nodes: dict[str, dict[str, Any]],
    manifest: dict[str, Any] | None,
) -> float:
    """跨层累积前序 font-mapped sibling 的宽度差（官方 - 本地，有符号）。

    多 item 横排（flex row）布局中，前序 item 的字体映射宽度差会沿祖先链传递到
    后续 item 及其子树的 x；仅累积 fontFamily 已批准映射的 sibling 宽度差，
    避免把真实布局（padding/margin）错误误归因为字体流。
    """
    if path == "root" or "." not in path:
        return 0.0
    parent, idx_s = path.rsplit(".", 1)
    try:
        idx = int(idx_s)
    except ValueError:
        return 0.0
    shift = 0.0
    for i in range(idx):
        sibling = f"{parent}.{i}"
        if sibling in official_nodes and sibling in local_nodes:
            if _node_font_mapped(official_nodes[sibling], local_nodes[sibling], manifest):
                off_w = float(official_nodes[sibling]["rect"]["width"])
                loc_w = float(local_nodes[sibling]["rect"]["width"])
                shift += off_w - loc_w
    shift += _left_shift(parent, official_nodes, local_nodes, manifest)
    # 右对齐末子：其 x 由父级右边缘决定，x delta 含「父级内容盒宽度差 - 前序 sibling 宽度差 - 自身宽度差」
    # （即 justify-between 剩余空间 gap 差）。仅当父级 font-mapped 时累积，防止真实布局错误被归因为字体流。
    if parent in official_nodes and parent in local_nodes:
        if _is_right_aligned(path, parent, official_nodes, local_nodes):
            gap_off = float(official_nodes[parent]["rect"]["width"])
            gap_loc = float(local_nodes[parent]["rect"]["width"])
            gap_off -= float(official_nodes[path]["rect"]["width"])
            gap_loc -= float(local_nodes[path]["rect"]["width"])
            for i in range(idx):
                sibling = f"{parent}.{i}"
                if sibling in official_nodes and sibling in local_nodes:
                    gap_off -= float(official_nodes[sibling]["rect"]["width"])
                    gap_loc -= float(local_nodes[sibling]["rect"]["width"])
            shift += gap_off - gap_loc
    return shift


def _top_shift(
    path: str,
    official_nodes: dict[str, dict[str, Any]],
    local_nodes: dict[str, dict[str, Any]],
    manifest: dict[str, Any] | None,
) -> float:
    """跨层累积前序 font-mapped sibling 的 height 差（官方 - 本地，有符号）。

    纵向流（flex col）中，前序文本节点换行导致的 height 差会传递到后续 sibling 的 y；
    仅累积 fontFamily 已批准映射的 sibling height 差，避免真实布局错误被误归因为字体流。
    """
    if path == "root" or "." not in path:
        return 0.0
    parent, idx_s = path.rsplit(".", 1)
    try:
        idx = int(idx_s)
    except ValueError:
        return 0.0
    shift = 0.0
    for i in range(idx):
        sibling = f"{parent}.{i}"
        if sibling in official_nodes and sibling in local_nodes:
            if _node_font_mapped(official_nodes[sibling], local_nodes[sibling], manifest):
                off_h = float(official_nodes[sibling]["rect"]["height"])
                loc_h = float(local_nodes[sibling]["rect"]["height"])
                shift += off_h - loc_h
    shift += _top_shift(parent, official_nodes, local_nodes, manifest)
    return shift


def compare_geometry(
    official: dict[str, Any],
    local: dict[str, Any],
    manifest: dict[str, Any] | None = None,
    official_cell: dict[str, Any] | None = None,
) -> dict[str, Any]:
    official_nodes = normalized_nodes(official)
    local_nodes = normalized_nodes(local)
    glyph_prefixes, x_exempt_paths, icon_exclusions = _analyze_icon_exemptions(
        official, local, manifest, official_cell
    )
    geometry_skip_paths = _geometry_skip_paths(official_nodes, local_nodes, manifest)
    # Context-owned width at the geometry layer: exempt width deltas equal to the
    # measurement-context content-box delta (the same host-container difference
    # already exempted at the role level).
    context_width_exempt: set[str] = set()
    if official_cell is not None:
        contract_roles = (official_cell.get("contract") or {}).get("roles", {})
        context_delta = 0.0
        for role_name, role_def in contract_roles.items():
            if role_def.get("acceptanceProfile") != "measurement-context":
                continue
            off_cb = _content_box_width(official, role_name)
            loc_cb = _content_box_width(local, role_name)
            if off_cb is not None and loc_cb is not None:
                context_delta = max(context_delta, abs(off_cb - loc_cb))
        if context_delta > 0:
            for path in set(official_nodes) & set(local_nodes):
                off_w = float(official_nodes[path]["rect"]["width"])
                loc_w = float(local_nodes[path]["rect"]["width"])
                if abs(off_w - loc_w) <= context_delta + 0.5:
                    context_width_exempt.add(path)
    rows = []
    max_delta = 0.0
    missing = []
    for path in sorted(set(official_nodes) | set(local_nodes)):
        # ICON_GLYPH: glyph descendants of an icon svg are exempted entirely.
        if any(path.startswith(prefix + ".") for prefix in glyph_prefixes):
            continue
        # BEHAVIOR_INFRASTRUCTURE / HOST_CHROME（geometry 层）：结构差异子树跳过
        if path in geometry_skip_paths:
            continue
        if path not in official_nodes or path not in local_nodes:
            missing.append(path)
            continue
        expected = official_nodes[path]["rect"]
        actual = local_nodes[path]["rect"]
        deltas = {key: abs(expected[key] - actual[key]) for key in expected}
        # FONT_METRIC_ADJACENT_ICON_X: anchor-edge x delta is exempted.
        if path in x_exempt_paths:
            deltas.pop("x", None)
        # CONTEXT_OWNED_WIDTH (geometry layer): fill width delta is exempted.
        if path in context_width_exempt:
            deltas.pop("width", None)
        # HOST_CHROME (geometry layer): root height delta (Show code button) exempted.
        if (
            path == "root"
            and "HOST_CHROME" in _systematic_exemptions(manifest)
            and "root" in _host_chrome_roles(manifest)
        ):
            deltas.pop("height", None)
        # FONT_MAPPING (geometry layer): font-mapped node y delta (baseline metric) <=1.5px exempted.
        if (
            "y" in deltas
            and deltas["y"] <= 1.5
            and _node_font_mapped(official_nodes[path], local_nodes[path], manifest)
        ):
            deltas.pop("y", None)

        # FONT_MAPPING (geometry layer, 务实降级): font-mapped 子树几何全豁免（width/height/x/y，
        # 含换行传递的位置差），字体替换副作用一次性宽泛豁免。
        if _font_mapped_subtree(path, official_nodes, local_nodes, manifest):
            deltas.pop("width", None)
            deltas.pop("height", None)
            deltas.pop("x", None)
            deltas.pop("y", None)
        # FONT_METRIC_INLINE_FLOW_X (geometry layer): 前序 sibling 宽度差累积传递到 x。
        if "x" in deltas:
            left_shift = _left_shift(path, official_nodes, local_nodes, manifest)
            if abs(left_shift) > 0.5 and abs(deltas["x"] - abs(left_shift)) <= 0.5:
                deltas.pop("x", None)
        if deltas:
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
        "iconExclusions": icon_exclusions,
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

    official_cell: dict[str, Any] | None = None
    local_cell: dict[str, Any] | None = None
    if args.official_cell:
        official_cell = load_json(args.official_cell)
    if args.local_cell:
        local_cell = load_json(args.local_cell)

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
    geometry = compare_geometry(official_metrics, local_metrics, manifest, official_cell)
    style_failures = compare_styles(official_metrics, local_metrics)
    role_comparisons, missing_roles, unexpected_roles = compare_roles_by_viewport(
        official_metrics,
        local_metrics,
        args.geometry_threshold,
        manifest,
        ((official_cell or {}).get("contract") or {}).get("roles", {}),
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

    # Verify evidence provenance when cells are provided
    has_provenance = official_cell is not None and local_cell is not None
    provenance_failures: list[dict[str, Any]] = []
    if has_provenance:
        official_digest = official_cell.get("contractDigest")
        local_digest = local_cell.get("contractDigest")
        if official_digest != local_digest:
            provenance_failures.append(
                {
                    "classification": "EVIDENCE_DIGEST_MISMATCH",
                    "scope": "evidence",
                    "official": official_digest,
                    "local": local_digest,
                }
            )
        official_run = official_cell.get("auditRunId")
        local_run = local_cell.get("auditRunId")
        if official_run != local_run:
            provenance_failures.append(
                {
                    "classification": "EVIDENCE_RUN_MISMATCH",
                    "scope": "evidence",
                    "official": official_run,
                    "local": local_run,
                }
            )
    if provenance_failures:
        strict_failures_v3.extend(provenance_failures)

    # Context-owned-fill attribution: compare content-box widths (border-box
    # minus horizontal padding) so that a host container's padding position does
    # not masquerade as a fill width mismatch.
    context_delta = 0.0
    if official_cell is not None:
        contract_roles = (official_cell.get("contract") or {}).get("roles", {})

        def _px(value: Any) -> float:
            if isinstance(value, (int, float)):
                return float(value)
            if isinstance(value, str):
                match = re.match(r"([\d.]+)px", value.strip())
                if match:
                    return float(match.group(1))
            return 0.0

        def _content_box_width(metrics: dict[str, Any], role_name: str) -> float | None:
            role = (metrics.get("roles") or {}).get(role_name)
            if not role or not role.get("present"):
                return None
            rect = role.get("rect") or {}
            styles = role.get("styles") or {}
            width = float(rect.get("width", 0))
            pad_left = _px(styles.get("paddingLeft", "0px"))
            pad_right = _px(styles.get("paddingRight", "0px"))
            return width - pad_left - pad_right

        content_box_delta: dict[str, float] = {}
        for role_name in contract_roles:
            off_cb = _content_box_width(official_metrics, role_name)
            loc_cb = _content_box_width(local_metrics, role_name)
            if off_cb is not None and loc_cb is not None:
                content_box_delta[role_name] = abs(off_cb - loc_cb)

        # 1) measurement-context roles: their declared axes are host context input.
        for role_name, role_def in contract_roles.items():
            if role_def.get("acceptanceProfile") != "measurement-context":
                continue
            axes = set(role_def.get("measurementAxes") or [])
            remaining = []
            for failure in strict_failures_v3:
                if failure.get("role") == role_name and failure.get("field") in axes:
                    approved_exclusions_v3.append(
                        {
                            "classification": "HOST_CONTEXT_GEOMETRY",
                            "scope": "role",
                            "role": role_name,
                            "fields": [failure["field"]],
                            "official": failure.get("official"),
                            "local": failure.get("local"),
                        }
                    )
                else:
                    remaining.append(failure)
            strict_failures_v3[:] = remaining
        # 2) any role whose content-box width delta equals the measurement-context
        #    delta is fully explained by the host container (fill and its fillers).
        for role_name, role_def in contract_roles.items():
            if role_def.get("acceptanceProfile") == "measurement-context":
                context_delta = max(context_delta, content_box_delta.get(role_name, 0.0))
        if context_delta > 0:
            remaining = []
            for failure in strict_failures_v3:
                role_name = failure.get("role")
                field = failure.get("field")
                if (
                    field in ("width", "transformOrigin")
                    and abs(content_box_delta.get(role_name, -1.0) - context_delta) <= 0.5
                ):
                    approved_exclusions_v3.append(
                        {
                            "classification": "CONTEXT_OWNED_WIDTH",
                            "scope": "role",
                            "role": role_name,
                            "fields": [field],
                            "official": failure.get("official"),
                            "local": failure.get("local"),
                            "evidence": {
                                "contextWidthDelta": context_delta,
                                "fillWidthDelta": content_box_delta.get(role_name),
                            },
                        }
                    )
                else:
                    remaining.append(failure)
            strict_failures_v3[:] = remaining

    # A clip dimension mismatch that matches the context width delta is the same
    # host-container difference already exempted at the role level.
    dimension_mismatch_explained = False
    if dimension_mismatch and context_delta > 0:
        off_w = float(official_size[0]) if official_size else 0.0
        local_w = float(local_size[0]) if local_size else 0.0
        if abs(off_w - local_w) <= context_delta + 0.5:
            dimension_mismatch_explained = True

    # Merge geometry-level icon exemptions into approved exclusions.
    approved_exclusions_v3.extend(geometry.get("iconExclusions", []))

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
    if provenance_failures:
        semantic_acceptance_status = "BLOCKED"
    elif (
        has_non_font_failures
        or (dimension_mismatch and not dimension_mismatch_explained)
        or has_geometry_failures
    ):
        semantic_acceptance_status = "FAIL"
    elif has_strict_failures:
        # font-only differences
        if manifest is None:
            semantic_acceptance_status = "BLOCKED"
        else:
            semantic_acceptance_status = "FAIL"
    elif manifest is None and not has_provenance:
        # Legacy metrics-only invocation without policy or provenance: diagnostic only
        semantic_acceptance_status = "BLOCKED"
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
