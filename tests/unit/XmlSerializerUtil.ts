const serializer = require("w3c-xmlserializer");
export default class XmlSerializerWrapper {
  private serializer: XMLSerializer;
  constructor() {
    this.serializer = new XMLSerializer();
  }
  public serializeToString(doc: Document) {
    return serializer.serialize(doc, { requireWellFormed: true });
  }
}
