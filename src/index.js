import { MarkdownGenerator } from './markdownGenerator.js';
import fs from 'fs/promises';
import path from 'path';

export async function main() {
  try {
    // JSONファイルを読み込んでパースする
    const jsonContents = {
      basicInfos: JSON.parse(await fs.readFile(path.join(process.cwd(), 'docs', 'basicInfos.json'), 'utf8')),
      requirementsList: JSON.parse(await fs.readFile(path.join(process.cwd(), 'docs', 'requirementsList.json'), 'utf8')),
      nonFunctionsList: JSON.parse(await fs.readFile(path.join(process.cwd(), 'docs', 'nonFunctionsList.json'), 'utf8')),
      functionsList: JSON.parse(await fs.readFile(path.join(process.cwd(), 'docs', 'functionsList.json'), 'utf8')),
      tobeOperationFlow: JSON.parse(await fs.readFile(path.join(process.cwd(), 'docs', 'tobeOperationFlow.json'), 'utf8')),
      screensList: JSON.parse(await fs.readFile(path.join(process.cwd(), 'docs', 'screensList.json'), 'utf8'))
    };
    // MarkdownGeneratorのインスタンス化
    const generator = new MarkdownGenerator(jsonContents);

    // Markdown生成
    await generator.generateMarkdown();

    console.log('Markdown files have been generated successfully!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
