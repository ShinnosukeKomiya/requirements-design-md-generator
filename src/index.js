import { MarkdownGenerator } from './markdownGenerator.js';
import fs from 'fs/promises';
import path from 'path';

export async function main() {
  try {
    // output/functionsディレクトリを作成
    await fs.mkdir('output/functions', { recursive: true });

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

    // 全体の要件定義書を生成
    const markdown = generator.generateFullMarkdown();

    // 出力ディレクトリの作成（存在しない場合）
    await fs.mkdir('output', { recursive: true });

    // 全体の要件定義書を出力
    await fs.writeFile(path.join('output', 'requirements.md'), markdown);

    // 個別の機能要件定義書を生成
    for (const func of generator.functions) {
      const functionDoc = await generator.generateFunctionRequirements(func);
      await fs.writeFile(`output/functions/FUN-${func.id}.md`, functionDoc);
    }

    console.log('Markdown files have been generated successfully!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}
