import { join, extname } from "jsr:@std/path";
import { assertEquals } from "jsr:@std/assert";
import doclint from "../lint.ts";

Deno.test({
    name: "Lint Integration Test",
    fn: async function (t) {
        for await (const dirEntry of Deno.readDir(join(Deno.cwd(), 'tests', 'sources'))) {
            await t.step({
                name: `Lint Test on ${dirEntry.name}`,
                fn: async () => {
                    const diagnostics = Deno.lint.runPlugin(
                        doclint, dirEntry.name, await Deno.readTextFileSync(
                            join(Deno.cwd(), 'tests', 'sources', dirEntry.name)
                        ),
                    );
                    let mappedDiagnostics;
                    try {
                        mappedDiagnostics = diagnostics.map((d) => ({
                            id: d.id,
                            message: d.message,
                            hint: d.hint,
                        }));
                    } catch (error) {
                        throw new Error(
                            `Error mapping diagnostics: ${(error as Error).message}`,
                        );
                    }

                    const expectedDiagnostics = JSON.parse(
                        await Deno.readTextFileSync(
                            join(
                                Deno.cwd(),
                                'tests',
                                'expected',
                                dirEntry.name.replace(
                                    extname(dirEntry.name),
                                    '.json',
                                )
                            )
                        )
                    );

                    for (let i = 0; i < mappedDiagnostics.length; ++i) {
                        assertEquals(mappedDiagnostics[i].hint, expectedDiagnostics[i].hint);
                        assertEquals(mappedDiagnostics[i].message, expectedDiagnostics[i].message);
                        assertEquals(mappedDiagnostics[i].id, expectedDiagnostics[i].id);
                    }
                }
            });
        }
    },
});