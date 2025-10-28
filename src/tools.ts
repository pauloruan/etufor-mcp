type Params = {
  name?: string | undefined;
};

interface Content {
  type: string;
  text: string;
}

interface StructuredContent {
  result: string;
}

interface GreetingGeneratorReturn {
  content: Array<Content>;
  structuredContent: StructuredContent;
}

async function greetingGenerator({
  name = "Stranger",
}: Params): Promise<GreetingGeneratorReturn> {
  const finalName = name ?? "Stranger";
  const result = `Hello, ${finalName}!`;
  return {
    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    structuredContent: { result },
  };
}

export { greetingGenerator };
