
# How does JS9 find these files?

The css files:

`js9.css`
`js9support.css`

... need to be loaded in the index.html file using something like:

```
    <link
      type="text/css"
      rel="stylesheet"
      href="assets/js9-to-be-served/js9support.css"
    />
    <link
      type="text/css"
      rel="stylesheet"
      href="assets/js9-to-be-served/js9.css"
    />
```

The `js9.js` file will be compiled and run automatically with the loading of the angular application, and it will use the location of these `.css` files to determine the root location of all of the files that it might need to load thereafter.