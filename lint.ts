import { parse } from "npm:comment-parser@1.4.1";
import type { Block } from "npm:comment-parser@1.4.1";

function findIndexFromLineSplitted(
  source: string[],
  line: number,
  ending?: boolean,
  rawSource?: string,
): number | undefined {
  if (line >= source.length) { return undefined }
  const srcLine = source[line];

  const src = rawSource ?? source.join("\n");
  const index = src.indexOf(srcLine);
  if (ending) {
    return index + srcLine.length;
  }
  return index;
}

function removeBraces(str: string): string {
  return str.slice(1, -1);
}


function generateReportsForTag(context: Deno.lint.RuleContext, ast: Block[], tagName: string) {
  const src = context.sourceCode;

  const sources = ast.filter((v) => {
    return v.tags.find((t) => t.tag === tagName);
  });

  const sourceLines = src.text.split("\n");

  const tagMap = sources.map((block) => {
    // nearest declaration line
    const tnTag = block.tags.find((t) => t.tag === tagName)!;
    const verboseTnTag = block.source.find((s) =>
      s.tokens.tag === tagName
    );

    const tnTagSrcMeta = tnTag.source[0]

    // find source code location
    const lastLineNumber = block.source[block.source.length - 1].number;
    const nearestLine = lastLineNumber + 1;

    const charIndex = findIndexFromLineSplitted(sourceLines, nearestLine, false, src.text);

    return {
      type: tagName,
      name: tnTag.description.startsWith('-') ? tnTag.name : undefined,
      description: tnTag.description.startsWith('-') ? tnTag.description.slice(2) : tnTag.name + " " + tnTag.description,
      source: tnTag.source[0].tokens.type !== "" && tnTag.source[0].tokens.type.length >= 2 ? removeBraces(tnTag.source[0].tokens.type) : undefined,
      tagLine: verboseTnTag?.number,
      elementLine: nearestLine,
      elementStartIndex: charIndex,
      tag: {
        // the start info for the tag
        start: {
          // the start line for the tag
          line: tnTagSrcMeta.number,
          fullIndex: findIndexFromLineSplitted(sourceLines, tnTagSrcMeta.number, false, src.text)!
        },
        end: {
          // the end line for the tag
          line: tnTagSrcMeta.number,
          fullIndex: findIndexFromLineSplitted(sourceLines, tnTagSrcMeta.number, true, src.text)!
        }
      },
      meta: {
        tag: tnTag,
      },
      verbose: {
        tag: verboseTnTag,
      },
    };
  });

  // return error
  tagMap.forEach((tagBlock) => {
    // find node in source
    if (tagBlock.elementStartIndex) {
      const node = src.ast.body.find((st) =>
        st.range[0] === tagBlock.elementStartIndex
      );

      context.report({
        message: tagBlock.name ? `${tagBlock.name}: ${tagBlock.description}` : tagBlock.description,
        hint: tagBlock.source ? `See ${tagBlock.source} for more info` : undefined,
        node,
      });
    } else {
      context.report({
        message: tagBlock.name ? `${tagBlock.name}: ${tagBlock.description}` : tagBlock.description,
        hint: tagBlock.source ? `See ${tagBlock.source} for more info` : undefined,
        range: [tagBlock.tag.start.fullIndex, tagBlock.tag.end.fullIndex]
      });
    }
  });
}

/**
 * The Doclint plugin
 */
const plugin: Deno.lint.Plugin = {
  name: "doclint",
  rules: {
    "todo": {
      create(context) {
        // parse docs from source
        const src = context.sourceCode;

        // parsing...
        const jsdocAst = parse(src.text);

        generateReportsForTag(context, jsdocAst, 'todo');

        return {};
      },
    },
    "fixme": {
      create(context) {
        // parse docs from source
        const src = context.sourceCode;

        // parsing...
        const jsdocAst = parse(src.text);

        generateReportsForTag(context, jsdocAst, 'fixme');

        return {};
      },
    }
  },
};


export default plugin;
