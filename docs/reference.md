# Reference
This explains how TODOs and FIXMEs work and are interpreted by the lint rules.

## Applying TODOs and FIXMEs
When writing your code, you can use JSDoc to add TODOs to your code using an `@todo` tag in order to indicate things to do for a given declaration.
For example, the following code denotes that the function is unimplemented
```js
/** @todo Unimplemented function */
function myFunc() {
    /** code */
}
```

When this lint plugin has been implemented, running `deno lint` on the file with the given code will produce the given error:

```log
error[doclint/todo]: Unimplemented function
 --> file.ts:2:1
  | 
2 | function myFunc() {
  | ^^^^^^^^^^^^^^^^^^^
  | 
3 |     /** code */
  | ^^^^^^^^^^^^^^^
  | 
4 | }
  | ^
```
Similar occurs when adding FIXMEs, which can be done using an `@fixme` tag in place of the `@todo` tag.

```ts
/**
 * @fixme Function adds two rather than one
 */
function addOne(a: number): number {
    a += 2
    return a
}
```

Produces the following:
```log
error[doclint/fixme]: Function adds two rather than one
 --> file.ts:4:1
  | 
4 | function addOne(a: number): number {
  | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  | 
5 |     a += 2
  | ^^^^^^^^^^
  | 
6 |     return a
  | ^^^^^^^^^^^^
  | 
7 | }
  | ^
```

## Referencing URLs
In the case that you are working on a project, and a specific feature todo can be referenced with an issue, or somewhere with a URL, you can indicate so by placing the URL in parentheses

```ts
/**
 * @fixme {https://github.com/nikeokoronkwo/doclint} Function adds two rather than one
 */
function _addOne(a: number): number {
    a += 2
    return a
}
```

This provides a hint in the lint rules with the URL specified.

```log
error[doclint/fixme]: Function adds two rather than one
 --> file.ts:4:1
  | 
4 | function _addOne(a: number): number {
  | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  | 
5 |     a += 2
  | ^^^^^^^^^^
  | 
6 |     return a
  | ^^^^^^^^^^^^
  | 
7 | }
  | ^
  = hint: See https://github.com/nikeokoronkwo/doclint for more info
```

## Adding Names to Lints
You can name todos by writing your messages in the form "NAME/ID - MESSAGE", like the following
```ts
/** @todo TA101 - Work on myself */
export const myself = -1;
```

This produces the following lint error:
```log
error[doclint/todo]: TA101: Work on myself
  --> file.ts:12:1
   | 
12 | export const myself = -1;
```

Note that this only applies when running `deno lint` on the command line. When running lints via LSP the messages are shown as is.

## Limitations
- The plugin doesn't work when the TODO is located inside a declaration body, and only applies when located before a declaration is defined.