# bikeshed

convert code style. currently only whitespace.

## Usage

change all .js files in current directory from 2 spaces to tabs,


```
#convert 2 spaces to tabs. do not overwrite files.
bikeshed *.js --from 2 --to t --safe
```
this will create new files in '/tmp/bikeshed/'
when you become confidant, use

```
# overwrite files
bikeshed *.js --from 2 --to t
```

## Contributing

All contributions must have 3 space indentations!!!

If anyone wants to extend this to apply other tranformations,
like automatic formatting... ping me and I'll add to the repo.

## License

MIT
