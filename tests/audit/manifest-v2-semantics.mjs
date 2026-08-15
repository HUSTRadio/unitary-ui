const ROLE_REFERENCE_FIELDS = [
  "coordinateOwnerRole",
  "textRole",
  "flowAnchorRole",
  "contextOwnerRole",
];

function addViolation(violations, path, reason) {
  violations.push({ path, reason });
}

function contractKey(contract) {
  return JSON.stringify([contract?.demoId, contract?.variant, contract?.state]);
}

function compoundTargetsMain(compound) {
  if (/^main(?=$|[.#:]|\[)/i.test(compound)) return true;

  for (const match of compound.matchAll(/:(?:is|where)\(([^()]*)\)/gi)) {
    if (selectsMainAsTarget(match[1])) return true;
  }
  return false;
}

function selectsMainAsTarget(selector) {
  const compounds = [];
  const text = String(selector).trim();
  let compoundStart = 0;
  let bracketDepth = 0;
  let parenthesisDepth = 0;
  let quote = null;
  let escaped = false;

  for (let index = 0; index <= text.length; index += 1) {
    const character = text[index] ?? ",";
    if (escaped) {
      escaped = false;
      continue;
    }
    if (character === "\\") {
      escaped = true;
      continue;
    }
    if (quote) {
      if (character === quote) quote = null;
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }
    if (character === "[") bracketDepth += 1;
    if (character === "]") bracketDepth = Math.max(0, bracketDepth - 1);
    if (character === "(") parenthesisDepth += 1;
    if (character === ")") parenthesisDepth = Math.max(0, parenthesisDepth - 1);
    if (bracketDepth || parenthesisDepth) continue;

    if (character === ",") {
      compounds.push(text.slice(compoundStart, index).trim());
      compoundStart = index + 1;
    } else if (/\s|[>+~]/.test(character)) {
      compoundStart = index + 1;
    }
  }

  return compounds.some(compoundTargetsMain);
}

function findDependencyCycle(graph) {
  const visited = new Set();
  const active = new Set();
  const stack = [];

  function visit(role) {
    if (active.has(role)) {
      const start = stack.indexOf(role);
      return [...stack.slice(start), role];
    }
    if (visited.has(role)) return null;

    visited.add(role);
    active.add(role);
    stack.push(role);
    for (const dependency of graph.get(role) ?? []) {
      const cycle = visit(dependency);
      if (cycle) return cycle;
    }
    stack.pop();
    active.delete(role);
    return null;
  }

  for (const role of graph.keys()) {
    const cycle = visit(role);
    if (cycle) return cycle;
  }
  return null;
}

function validateContract(contract, path, declaredViewports, violations) {
  const roles = contract?.roles;
  if (!roles || typeof roles !== "object" || Array.isArray(roles)) return;

  const roleNames = new Set(Object.keys(roles));
  const clipRole = contract?.clipRole;
  if (!roleNames.has(clipRole)) {
    addViolation(
      violations,
      `${path}.clipRole`,
      `clipRole must reference an existing role: ${String(clipRole)}`,
    );
  } else if (roles[clipRole]?.presence !== "required") {
    addViolation(violations, `${path}.clipRole`, "clipRole must reference a required role");
  } else if (roles[clipRole]?.acceptanceProfile === "measurement-context") {
    addViolation(violations, `${path}.clipRole`, "clipRole cannot use measurement-context");
  }

  const graph = new Map([...roleNames].map((role) => [role, []]));
  const referencedContexts = new Set();
  for (const [roleName, role] of Object.entries(roles)) {
    for (const viewport of Object.keys(role?.selectors?.byViewport ?? {})) {
      if (!declaredViewports.has(viewport)) {
        addViolation(
          violations,
          `${path}.roles.${roleName}.selectors.byViewport.${viewport}`,
          `selector viewport is not declared by component: ${viewport}`,
        );
      }
    }
    for (const field of ROLE_REFERENCE_FIELDS) {
      const target = role?.[field];
      if (target === undefined) continue;
      if (!roleNames.has(target)) {
        addViolation(
          violations,
          `${path}.roles.${roleName}.${field}`,
          `${field} references unknown role ${String(target)}`,
        );
        continue;
      }

      const targetRole = roles[target];
      if (targetRole?.presence !== "required") {
        addViolation(
          violations,
          `${path}.roles.${roleName}.${field}`,
          `${field} must reference a required role`,
        );
      }
      if (field === "textRole" && targetRole?.acceptanceProfile !== "mapped-text") {
        addViolation(
          violations,
          `${path}.roles.${roleName}.${field}`,
          "textRole must reference a required mapped-text role",
        );
      }
      if (field === "contextOwnerRole" && targetRole?.acceptanceProfile !== "measurement-context") {
        addViolation(
          violations,
          `${path}.roles.${roleName}.${field}`,
          "contextOwnerRole must reference a required measurement-context role",
        );
      }
      graph.get(roleName).push(target);
    }

    if (
      role?.acceptanceProfile === "context-owned-fill" &&
      roleNames.has(role.contextOwnerRole) &&
      roles[role.contextOwnerRole]?.presence === "required" &&
      roles[role.contextOwnerRole]?.acceptanceProfile === "measurement-context"
    ) {
      referencedContexts.add(role.contextOwnerRole);
    }
  }

  for (const [roleName, role] of Object.entries(roles)) {
    if (role?.acceptanceProfile === "measurement-context" && !referencedContexts.has(roleName)) {
      addViolation(
        violations,
        `${path}.roles.${roleName}`,
        "measurement-context must be referenced by context-owned-fill",
      );
    }
  }

  const cycle = findDependencyCycle(graph);
  if (cycle) {
    addViolation(violations, `${path}.roles`, `role dependency cycle: ${cycle.join(" -> ")}`);
  }

  const wrapperIds = new Set();
  for (const [wrapperIndex, wrapper] of (contract.transparentWrappers ?? []).entries()) {
    const wrapperPath = `${path}.transparentWrappers[${wrapperIndex}]`;
    if (wrapperIds.has(wrapper.id)) {
      addViolation(
        violations,
        `${wrapperPath}.id`,
        `duplicate transparent wrapper id: ${String(wrapper.id)}`,
      );
    } else {
      wrapperIds.add(wrapper.id);
    }
    if (!roleNames.has(wrapper.parentRole) || roles[wrapper.parentRole]?.presence !== "required") {
      addViolation(
        violations,
        `${wrapperPath}.parentRole`,
        "parentRole must reference a required role",
      );
    }
  }
}

export function collectManifestSemanticViolations(manifest) {
  const violations = [];
  if (!manifest || !Array.isArray(manifest.components)) return violations;

  const manifestEpoch = Date.parse(manifest.acceptancePolicy?.evidenceEpochNotBefore);

  manifest.components.forEach((component, componentIndex) => {
    if (component?.inventoryStatus !== "pending_live_enumeration") {
      for (const source of ["official", "local"]) {
        const selector = component?.selectors?.[source];
        if (selectsMainAsTarget(selector)) {
          addViolation(
            violations,
            `components[${componentIndex}].selectors.${source}`,
            "live component selector cannot target main as the acceptance root",
          );
        }
      }
    }
    if (!Array.isArray(component?.acceptanceContracts)) return;

    const declaredValues = {
      demoId: new Set((component.demos ?? []).map((demo) => demo.id)),
      variant: new Set(component.variants ?? []),
      state: new Set(component.states ?? []),
    };
    const declaredViewports = new Set(component.viewports ?? []);
    const seenContracts = new Set();
    component.acceptanceContracts.forEach((contract, contractIndex) => {
      const path = `components[${componentIndex}].acceptanceContracts[${contractIndex}]`;
      const contractEpoch = Date.parse(contract?.evidenceNotBefore);
      if (
        Number.isFinite(manifestEpoch) &&
        Number.isFinite(contractEpoch) &&
        contractEpoch < manifestEpoch
      ) {
        addViolation(
          violations,
          `${path}.evidenceNotBefore`,
          "evidenceNotBefore precedes manifest acceptance epoch",
        );
      }
      for (const [field, values] of Object.entries(declaredValues)) {
        if (!values.has(contract?.[field])) {
          addViolation(
            violations,
            `${path}.${field}`,
            `${field} is not declared by component: ${String(contract?.[field])}`,
          );
        }
      }
      const key = contractKey(contract);
      if (seenContracts.has(key)) {
        addViolation(violations, path, `duplicate acceptance contract for ${key}`);
      } else {
        seenContracts.add(key);
      }
      validateContract(contract, path, declaredViewports, violations);
    });
  });

  return violations;
}
