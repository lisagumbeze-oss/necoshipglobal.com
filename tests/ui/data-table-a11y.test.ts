import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import path from "path";

describe("DataTable sortable headers (Phase 9 D1)", () => {
  const source = readFileSync(
    path.join(process.cwd(), "components/design-system/data-table.tsx"),
    "utf8"
  );

  it("attaches aria-sort to the th column header, not the sort button", () => {
    expect(source).toMatch(/<th[\s\S]*aria-sort=\{/);
    expect(source).not.toMatch(/<button[\s\S]*aria-sort=/);
  });

  it("keeps an accessible sort button label inside the header", () => {
    expect(source).toMatch(/aria-label=\{sortLabel\}/);
    expect(source).toMatch(/onClick=\{\(\) => onSort\(column\.id\)\}/);
  });
});
