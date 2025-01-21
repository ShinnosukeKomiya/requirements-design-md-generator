import { MarkdownGenerator } from './markdownGenerator.js';
import fs from 'fs/promises';
import path from 'path';

export async function main() {
  try {
    // 必要なすべてのYAMLファイルを読み込む
    const yamlContents = {
      basicInfos: await fs.readFile(path.join(process.cwd(), 'tmp', 'basicInfos.yml'), 'utf8'),
      requirementsList: await fs.readFile(path.join(process.cwd(), 'tmp', 'requirementsList.yml'), 'utf8'),
      nonFunctionsList: await fs.readFile(path.join(process.cwd(), 'tmp', 'nonFunctionsList.yml'), 'utf8'),
      functionsList: await fs.readFile(path.join(process.cwd(), 'tmp', 'functionsList.yml'), 'utf8'),
      tobeOperationFlow: await fs.readFile(path.join(process.cwd(), 'tmp', 'tobeOperationFlow.yml'), 'utf8'),
      screensList: await fs.readFile(path.join(process.cwd(), 'tmp', 'screensList.yml'), 'utf8')
    };
    // MarkdownGeneratorのインスタンス化
    const generator = new MarkdownGenerator(yamlContents);

    // Markdown生成
    await generator.generateMarkdown();

    console.log('Markdown files have been generated successfully!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
