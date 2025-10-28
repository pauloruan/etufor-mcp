import { XMLParser } from "fast-xml-parser";
import type { BusLine } from "../services/busLinesService";

interface Linhas {
  Linha: BusLine[];
}

interface Arquivo {
  Linhas: Linhas;
}

interface Raiz {
  Arquivo: Arquivo;
}

interface ParsedXml {
  Raiz: Raiz;
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  parseAttributeValue: false,
  trimValues: true,
  isArray: (_name, jpath) => {
    if (jpath === "Raiz.Arquivo.Linhas.Linha") return true;
    return false;
  },
});

export function parseBusLinesXML(xmlText: string): BusLine[] {
  try {
    const jsonObject: ParsedXml = parser.parse(xmlText);
    const lines = jsonObject?.Raiz?.Arquivo?.Linhas?.Linha || [];

    if (lines.length === 0) {
      console.warn(
        "XML parsed, but no <Linha> items were found at the expected path.",
      );
    }

    return lines;
  } catch (error) {
    console.error("Failed to parse XML string:", error);
    return [];
  }
}
