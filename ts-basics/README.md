# ts-basics

## tsc usage

### Verison

```bash
tsc -v
```

### Compile

```bash
tsc index
tsc index --watch
```
### Init Config file

```bash
tsc --init
```

#### Change compile options

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  }
}
```