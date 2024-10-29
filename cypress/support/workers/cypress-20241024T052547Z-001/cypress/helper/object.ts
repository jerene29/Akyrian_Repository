/**
 * to shorten the tedious '[data-cy=selector]' selector.
 * just put the name of data-cy attributed element.
 * -- d stands for document
 *
```
d`addButton`
```
 */
export function d(args: TemplateStringsArray) {
  return `[data-cy=${args.join('')}]`;
}
