import { MarkdownGenerator } from './markdownGenerator.js';
import fs from 'fs/promises';
import path from 'path';

export async function main() {
  try {
    // YAMLファイルの読み込み
    const yamlContents = {
      basicInfos: await fs.readFile(path.join(process.cwd(), 'docs/requirements', 'basicInfos.yml'), 'utf8'),
      requirementsList: await fs.readFile(path.join(process.cwd(), 'docs/requirements', 'requirementsList.yml'), 'utf8'),
      nonFunctionsList: await fs.readFile(path.join(process.cwd(), 'docs/requirements', 'nonFunctionsList.yml'), 'utf8'),
      functionsList: await fs.readFile(path.join(process.cwd(), 'docs/requirements', 'functionsList.yml'), 'utf8'),
      tobeOperationFlow: await fs.readFile(path.join(process.cwd(), 'docs/requirements', 'tobeOperationFlow.yml'), 'utf8')
    };

    // Markdownの生成
    const generator = new MarkdownGenerator(yamlContents);
    const markdown = generator.generateFullMarkdown();

    // 出力ディレクトリの作成（存在しない場合）
    await fs.mkdir('output', { recursive: true });

    // Markdownファイルの書き出し
    await fs.writeFile(path.join('output', 'requirements.md'), markdown);
    console.log('Markdown file has been generated successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}
