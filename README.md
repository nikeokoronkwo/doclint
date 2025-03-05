# Doclint

Doclint is a powerful set of lint rules designed to improve development tracking within your codebase. 
It focuses on identifying and flagging **TODO** and **FIXME** tags within your source code through the use of JSDoc, helping you keep track of pending tasks and areas requiring attention. 
By integrating Doclint into your development workflow, you can maintain a cleaner, more organized codebase and ensure that important development reminders are never overlooked.

## Getting Started
> Deno Lint Plugns require Deno 2.2
Include the following in your lint plugins:

```json
// ...
    "lints": {
        "plugins": [
            // other plugins...
            "jsr:@nikechukwu/doclint"
        ]
    }
```
For more information on how this works, see the [reference file](./docs/reference.md)

## Uses
Doclint can either be used in your general development workflow, or can be integrated into your CI/CD pipeline for testing Deno code

## Inspiration
This package was inspired by the Dart Analyzer's builtin feature to detect TODOs in code and flag them as (info) warnings. 