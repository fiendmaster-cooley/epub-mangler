import React from "react";
import { ReactNode } from "react";
import ePub, { Book } from "epubjs";
import Section from "epubjs/types/section";

const BL2 = () => {
  return {
    initEpub(url: string): Promise<Book> {
      return new Promise((resolve) => {
        const tb = ePub(url);
        return resolve(tb);
      });
    },

    getDocument(book: Book, loadString: string, cb: Function) {
      book.load(loadString).then((d) => {
        cb(d);
      });
    },

    getSectionsAsNodes(book: Book) {
      const nodes: ReactNode[] = [];
      const fn = (el: Section, index: number) => {
        nodes.push(<li key={`${index}%`}>{el.idref}</li>);
      };
      book.spine.each(fn);
      return nodes;
    },

    getSections(book: Book) {
      const secs: Array<Section> = [];
      const fn = (el: Section, index: number) => {
        secs.push(el);
      };
      book.spine.each(fn);
      return secs;
    },

    replaceSection(book: Book, sectionName: string, replacementBodyNode: Node) {
      const sectionDocument: Element = book.section(sectionName).contents;
      sectionDocument.removeChild(
        sectionDocument.getElementsByTagName("body")[0],
      );
      sectionDocument.appendChild(replacementBodyNode);
      book.section(sectionName).contents = sectionDocument;
    },

    replaceFile(
      book: Book,
      loadString: string,
      bodyElement: Node,
      cb: Function,
    ) {
      this.getDocument(book, loadString, (d: XMLDocument) => {
        // now want to remove the existing body (by going to root node)
        // then replace with new body.
        const docEl = d.documentElement;
        const bodyEl = d.body;
        console.debug(bodyEl.children);
        docEl.removeChild(bodyEl);
        docEl.appendChild(bodyElement);
        cb(d);
      });
    },
  };
};
const bl = BL2();
export default bl;
