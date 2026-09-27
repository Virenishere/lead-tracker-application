import fs from "node:fs";
import path from "node:path";

const prismaDir = path.resolve("src/generated/prisma");

function processFile(filePath) {
  if (!filePath.endsWith(".ts")) {
    return;
  }

  let content = fs.readFileSync(filePath, "utf8");

  content = content.replace(
    /from (["'])(\.\.?\/[^"']+)\1/g,
    (match, quote, importPath) => {
      if (
        importPath.endsWith(".js") ||
        importPath.endsWith(".json")
      ) {
        return match;
      }

      return `from ${quote}${importPath}.js${quote}`;
    }
  );

  fs.writeFileSync(filePath, content);
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const filePath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(filePath);
    } else {
      processFile(filePath);
    }
  }
}

walk(prismaDir);

console.log("Prisma ESM imports fixed.");