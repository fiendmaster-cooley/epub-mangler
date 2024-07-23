import React from "react";
import { useState, ReactNode } from "react";
import ePub, { Book } from "epubjs";
import Section from "epubjs/types/section";
//this should be a parameter here...
export const BookLoader = (
  url: string,
  alsoByString: string,
  aboutString: string,
) => {
  const [sections, setSections]: Array<any> = useState([]);
  const [documentAlso, setDocumentAlso] = useState<XMLDocument>();
  const [documentAbout, setDocumentAbout] = useState<XMLDocument>();
  const [ready, setReady] = useState<boolean>(false);
  const [tb, setTB] = useState<Book>();
  let epub = ePub(url);
  epub!.ready.then(() => {
    const spine = epub!.spine;
    const nodes: ReactNode[] = [];
    const secs: Array<Section> = [];
    const fn = (el: Section, index: number) => {
      nodes.push(<li key={`${index}%`}>{el.idref}</li>);
      secs.push(el);
    };
    setSections(nodes);
    spine.each(fn);

    setReady(true);
  });

  const initDoc = (loadString: string) => {
    const prom = tb!.load(loadString);
    prom.then((doc: any) => {
      if (loadString.indexOf("also") === 0) {
        setDocumentAlso(doc as XMLDocument);
      } else if (loadString.indexOf("about") === 0) {
        setDocumentAbout(doc as XMLDocument);
      } else {
        //what do we do here?
      }
    });
  };

  const replaceFile = (loadString: string, bodyElement: Node) => {
    const prom = tb!.load(loadString);
    prom.then((d: any) => {
      const oldSection = d as XMLDocument;
      oldSection.replaceChild(oldSection.body, bodyElement);
    });
  };
  return { tb, sections, documentAlso, documentAbout, replaceFile, ready };
};
export default BookLoader;
