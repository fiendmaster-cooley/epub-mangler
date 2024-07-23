# epub-mangler
Application for mangling epubs by renaming files and references, directly editing epub contents, and infinite regeneration of ebook files.

## Modules
Epub-Mangler consists of three modules which each perform a specific task.

### Epub Explorer
The Epub Explorer module loads an epub from the local disk, displays the `.xhtml` files within the `OEBPS` directory, and allows the user to not only view the contents, but make changes and save them to the epub.
The application then generates a new epub which will appear in the user's browser default `downloads` directory.

### Epub Renamer
The Epub Renamer module loads an epub from the local disk and displays all the `.xhtml` files in the `OEBPS` directory.
A user can select a file and rename it. File references in the content.opf, contents.xhtml, and toc.ncx are then modified to reflect the changes.
__This feature is only tested for about and also-by files.__

### Epub Replacer
The Epub Replacer loads an epub from the disk and provides the user the ability to upload their own `.xhtml` files for the `about-the-author` and `also-by` files in the `OEBPS` directory.
The existing `also-by` and `about-the-author` file contents are replaced.
The user then generates a new epub with the new file contents.

## Run instructions
Fork repository.
Install `yarn`
`yarn start install
yarn start`
