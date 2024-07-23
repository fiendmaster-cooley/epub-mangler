import JSZip from "jszip";
import Epub, { SPEC_FILE_NAMES } from "./Epub";
import ReplacementFile from "./ReplacementFile";
import FileSaver from "file-saver";
const serializer = require("w3c-xmlserializer");

const EpubService = () => {
  return {
    async processDir(dir: string) {},
    async createEpub(url: string, sourceZip: JSZip): Promise<Epub> {
      return {
        url: url,
        sourceZip: sourceZip,
      };
    },
    async openEpubFromBuffer(
      file: File,
      callBack: Function,
      statusCallback: Function,
    ) {
      const reader = new FileReader();
      reader.addEventListener("loadend", async (evt) => {
        const loaded = JSZip.loadAsync(reader.result as ArrayBuffer, {
          base64: true,
        });
        const epub = await loaded;
        await callBack(await this.createEpub(file.name, epub));
        await statusCallback(
          `Successfully opened epub ${file.name} in memory...`,
        );
      });
      reader.readAsArrayBuffer(file);
    },

    async generateEpub(epub: Epub, epubName: string, statusCallback: Function) {
      epub.sourceZip
        .generateAsync({ type: "blob" })
        .then(async function (content) {
          FileSaver.saveAs(content, epubName);
          await statusCallback("Successfully generated:\t" + epubName);
        });
    },
    async processEpubs(
      epubs: File[],
      about: ReplacementFile,
      also: ReplacementFile,
      statusCallback: Function,
    ) {
      const parser = new DOMParser();
      const xmlAbout = parser.parseFromString(about.xml, "text/xml");
      const xmlAlso = parser.parseFromString(also.xml, "text/xml");
      const checkNodeForError = (doc: XMLDocument) => {
        const errorNode = doc.querySelector("parsererror");
        if (errorNode) {
          const children: HTMLCollectionOf<Element> = errorNode.children;
          const textNode = children.item(1);
          throw new Error(textNode?.innerHTML);
        }
      };
      checkNodeForError(xmlAbout);
      checkNodeForError(xmlAlso);
      const epubSuffix = "_generated_and_modified.epub";
      await statusCallback("Processing " + epubs.length);
      for (let i = 0; i < epubs.length; i++) {
        await statusCallback("Processing " + epubs[i].name);
        //create the epub
        const file = epubs[i];
        await this.openEpubFromBuffer(
          file,
          async (tmpEpub: Epub) => {
            tmpEpub = await this.replaceFile(
              tmpEpub,
              `OEBPS/${also.file.name}`,
              xmlAlso,
              statusCallback,
            );
            //replace about
            tmpEpub = await this.replaceFile(
              tmpEpub,
              `OEBPS/${about.file.name}`,
              xmlAbout,
              statusCallback,
            );
            tmpEpub.sourceZip
              .generateAsync({ type: "blob" })
              .then(function (content) {
                FileSaver.saveAs(content, file.name + epubSuffix);
              });
          },
          statusCallback,
        );
        await statusCallback("Generated file:\t" + file.name + epubSuffix);
      }
    },
    async replaceFile(
      epub: Epub,
      fileName: string,
      xmlDocument: XMLDocument,
      statusCallback: Function,
    ): Promise<Epub> {
      //get the OEBPS
      //find the file
      const olds = epub.sourceZip.filter(function (relativePath, file) {
        if (file && file.name.indexOf(fileName) > -1) {
          return file.name.indexOf(fileName) > -1;
        } else {
          return false;
        }
      });
      // should only be a single old here...
      if (olds.length === 0) {
        await statusCallback(
          `Could not find file ${fileName}`,
          "Error",
          "error",
        );
        return epub;
      }

      epub.sourceZip.remove(olds[0].name);
      epub.sourceZip.file(fileName, serializer(xmlDocument.getRootNode()));

      return epub;
    },
    /**
    @todo
    */
    async storeEpub(dir: string, epub: any) {},
    /**
     *
     * @param epub the source epub
     * @param fileName the filename WITHOUT THE PATH
     * @param newFilename the filename WITHOUT THE PATH
     */
    async renameFile(epub: Epub, fileName: string, newFilename: string) {
      /**
       * Clone the old file
       * remove the old file
       * add new file
       * replace entries in toc, content.opf, and contents.xhtml
       */
      const oldFile = epub.sourceZip.file(`OEBPS/${fileName}`);
      //serialize the document to a string

      if (!oldFile) {
        throw new Error(`Filename ${fileName} not found...`);
      } else {
        const contentString = await oldFile.async("string");
        epub.sourceZip.remove(`${oldFile.name}`);
        epub.sourceZip.file(`OEBPS/${newFilename}`, contentString);
        //now that we've renamed the file
        //we need to go through the same procedure with the content for toc and ncx...
        const modifiedEpub = await this.replaceFileReferences(
          epub,
          oldFile.name.split("OEBPS/")[1],
          newFilename,
          () => {},
        );
        return modifiedEpub;
      }
    },
    /**
        @param fileNameToReplace ie, "about-the-author.xhtml"
        @param newFileName ie, about-paul-e-cooley.xhtml"
        */
    async replaceFileReferences(
      epub: Epub,
      fileNameToReplace: string,
      newFileName: string,
      statusCallback: Function,
    ): Promise<Epub> {
      //there are three files we need to modify here.
      //Content.opf, toc.ncx, and contents.html

      //since we don't care about dom rules, we're going to play fast and loose
      //and replace the raw text references.
      const getFileFromEpub = async (dirName: string, fname: string) => {
        let fileName = `${dirName}/${fname}`;
        const theFile = epub.sourceZip.file(fileName);
        if (theFile) {
          return theFile;
        } else throw new Error("Unable to find file!\t" + fileName);
      };
      SPEC_FILE_NAMES.forEach(async (specName) => {
        const fromEpub = await getFileFromEpub("OEBPS", specName);
        const contents = await fromEpub.async("text");
        const newContents = contents.replaceAll(
          `${fileNameToReplace}`,
          newFileName,
        );
        //parse the xml file...
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(newContents, "text/xml");
        //sanity check to look for parsing error
        const errorNode = xmlDoc.querySelector("parsererror");
        if (errorNode) {
          const children: HTMLCollectionOf<Element> = errorNode.children;
          const textNode = children.item(1);

          throw new Error(textNode?.innerHTML);
        } else {
          epub = await this.replaceFile(
            epub!,
            fromEpub!.name,
            xmlDoc,
            statusCallback,
          );
          await statusCallback({
            alertMessage: `Replaced file ${fromEpub!.name}`,
            alertTitle: "Status",
            severity: "info",
          });
        }
      });
      return epub;
    },
  };
};
const service = EpubService();
export default service;
