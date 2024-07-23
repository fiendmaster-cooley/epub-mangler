import JSZip from "jszip";
export const SPEC_FILE_NAMES = ["toc.ncx", "contents.xhtml", "content.opf"];
interface Epub {
  url: string;
  sourceZip: JSZip; //all the files in the OEPBS
}
export default Epub;
