import React, { HTMLAttributes } from 'react';

//TODO: Effect in markdown when pressing a lot of spaces between first symbols and start of words in a line
//TODO: Check if Google Gemini returns special characters for \s or just strings
class MarkdownProcessorC {
  process(markdownText: string) {
    const lines = markdownText.split("\n");
    const children: React.ReactNode[] = [];

    let listType: string | null = null;
    let listChildren: React.ReactNode[] = [];

    let key = 0;
    for (let i = 0; i < lines.length; ++i) {
      const line = lines[i].trim();

      const endList = () => {
        if (listType) {
          children.push(React.createElement(listType, { key: key++ }, listChildren));
          listType = null;
          listChildren = [];
          children.push(React.createElement("br", { key: key++ }));
        }
      }

      if (!line) {
        endList();
        continue;
      }

      //TODO: Add itacilizing for header
      //Header
      const headerMatch = line.match(/^(#{1,6})\s+(.*)$/);
      if (headerMatch) {
        endList();
        children.push(React.createElement(`h${headerMatch[1].length}`, { key: key++ }, headerMatch[2]));
        continue;
      }

      //TODO: Conflicts with lines under header
      //Horizontal Rule
      if (/^(?:\s*[\*-_]){3,}\s*$/.test(line)) {
        endList();
        children.push(React.createElement("hr", { key: key++ }));
        continue;
      }

      //TODO: Nested Blockquotes
      //Blockquotes
      const blockquoteMatch = line.match(/^(>+)\s*/);
      if (blockquoteMatch) {
        endList();
        children.push(React.createElement("blockquote", { key: key++ }, line.substring(blockquoteMatch[0].length)));
        continue;
      }

      //TODO: Nested Unordered Lists
      //TODO: Substring start after \s characters
      //Unordered lists
      const unorderedListMatch = line.match(/^[*-+](?:$|\s{2,}|\s(?=.))/);
      if (unorderedListMatch) {
        if (listType !== "ul") {
          if (listType) {
            children.push(React.createElement(listType, { key: key++ }, listChildren));
            listChildren = [];
          }
          listType = "ul";
        }

        listChildren.push(React.createElement("li", { key: key++ }, this.processInline(line.substring(unorderedListMatch[0].length))));
        continue;
      }

      //TODO: Nested Ordered Lists
      //TODO: Ordered Lists should start only if first number is 1.
      //TODO: Substring start after \s characters
      //Ordered Lists
      const orderedListMatch = line.match(/^\d+\.(?:$|\s+(?=\S))/);
      if (orderedListMatch) {
        if (listType !== "ol") {
          if (listType) {
            children.push(React.createElement(listType, { key: key++ }, listChildren));
            listChildren = [];
          }
          listType = "ol";
        }

        listChildren.push(React.createElement("li", { key: key++ }, this.processInline(line.substring(orderedListMatch[0].length))));
        continue;
      }

      //Paragraphs
      if (listType) {
        children.push(React.createElement(listType, { key: key++ }, listChildren));
        listType = null;
      }
      children.push(React.createElement("p", { key: key++ }, this.processInline(line)));
    }

    if (listType) {
      children.push(React.createElement(listType, { key: key++ }, listChildren));
    }

    return React.createElement("div", null, children);
  }

  //TODO: Bold would need to loop multiple times for ex: ******bolded_text******
  private processInline(text: string) {

    // Bold
    text = text.replace(/\*\*([^*]+)\*\*/g, "\n<b>\n$1\n</b>\n");
    
    //TODO: add underscores
    // Italic
    text = text.replace(/\*([^*]+)\*/g, "\n<i>\n$1\n</i>\n");

    // Inline Code
    text = text.replace(/`([^`]+)`/g, "\n<code>\n$1\n</code>\n");

    // Links
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "\n<a href=\"$2\">\n$1\n</a>\n");

    // Images
    text = text.replace(/!\[([^\]]+)\]\(([^)]+)\)/g, "\n<img src=\"$2\" alt=\"$1\"/>\n");

    return this.toJSX(text);
  }

  /**
   * @param text HTML must be non-self-closing and in form `<tag prop1="..." prop2="...">...</tag>`. Each property within opening tag is separated by a single space.
   * Each tag must be followed and preceded by newline character `"\n"`
   * @returns Children array of `React.ReactNode` objects
   * @example
   * ```JS
   * const mp = new MarkdownProcessor();
   * const children = mp.toJSX("Hello, \n<b>\nTom\n</b>\n\n<i>\n!\n</i>\n");
   * const JSX = React.createElement("p", null, children);
   * //`JSX` Renders as the equivalent of this markdown: Hello, **Tom***!*
   * ```
   */
  private toJSX(htmlContent: string): React.ReactNode[] {
    return this.toJSX_priv({ content: htmlContent.split("\n"), index: 0 });
  }

  /**
   * @param p.content Even indexes are text, odd indexes are element tags.
   * Format within element tags follow as per the parameter guidelines of `toJSX`
   */
  private toJSX_priv(p: { content: string[], index: number}): React.ReactNode[] {
    const children: React.ReactNode[] = [];

    while (p.index < p.content.length) {
      if (p.index % 2 === 0) {

        //Plain text
        children.push(p.content[p.index]);

      } else if (p.content[p.index][1] === "/") {

        //Closing tag
        return children;

      } else {

        //Opening tag
        const tag = p.content[p.index];
        const end = tag.length - 1;

        //Get tag
        let tagNameEnd = tag.indexOf(" ", 1);
        if (tagNameEnd < 0) {
          tagNameEnd = end;
        }
        const tagName = tag.substring(1, tagNameEnd);

        // Get properties
        const properties: { [key: string]: string | number | boolean | undefined } & HTMLAttributes<HTMLElement> & React.Attributes = { key: p.index };
        let tagIndex = tagNameEnd + 1;

        while (tagIndex < end) {

          //Get property-name
          const propNameEnd = tag.indexOf("=", tagIndex + 1);
          const propName = tag.substring(tagIndex, propNameEnd);

          //Get property-value
          const propValueStart = propNameEnd + 2;
          const propValueEnd = tag.indexOf("\"", propValueStart);
          const propValue = tag.substring(propValueStart, propValueEnd);

          properties[propName] = propValue;
          tagIndex = propValueEnd + 2;
        }

        ++p.index;
        children.push(React.createElement(tagName, properties, this.toJSX_priv(p)));

      }

      ++p.index;
    }

    return children;
  }

}

const markdownProcessor = new MarkdownProcessorC();

const MarkdownProcessor: React.FC<{ children?: string }> = ({ children }) => {
  if (!children) {
    return "";
  }
  return markdownProcessor.process(children);
}

export default MarkdownProcessor;