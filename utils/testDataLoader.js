const fs = require('fs');
const path = require('path');

/**
 * Loads JSON test data and resolves environment variable placeholders.
 * Supports ${ENV_VAR} syntax in string values.
 */
function loadTestData(fileName) {
  const filePath = path.join(__dirname, '..', 'test-data', fileName);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);
  const resolved = resolveEnvPlaceholders(data);

  if (fileName === 'users.json' && resolved) {
    resolved.validUser = resolved.validUser || resolved.valid;
    resolved.valid = resolved.valid || resolved.validUser;
    resolved.invalidUser = resolved.invalidUser || resolved.invalid;
    resolved.invalid = resolved.invalid || resolved.invalidUser;
  }

  return resolved;
}

function resolveEnvPlaceholders(value) {
  if (typeof value === 'string') {
    return value.replace(/\$\{(\w+)\}/g, (_, envKey) => process.env[envKey] ?? '');
  }

  if (Array.isArray(value)) {
    return value.map(resolveEnvPlaceholders);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [key, resolveEnvPlaceholders(nested)])
    );
  }

  return value;
}

module.exports = { loadTestData };
