import type { EhpSectionRow, SignaleringsplanRow } from './db';

/** Shared by the schema upgrade and restoring exports made before version 2. */
export function legacyEhpPlan(rows: EhpSectionRow[], timestamp: number): SignaleringsplanRow | null {
  const fields = Object.fromEntries(rows
    .filter((row) => typeof row?.key === 'string' && typeof row?.content === 'string' && row.content.trim() !== '')
    .map((row) => [row.key, row.content]));
  return Object.keys(fields).length > 0 ? { createdAt: timestamp, updatedAt: timestamp, fields } : null;
}
