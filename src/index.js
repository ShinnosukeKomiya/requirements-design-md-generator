import { MarkdownGenerator } from './markdownGenerator.js';
import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';

export async function main() {
  try {
    // 必要なすべてのYAMLファイルを読み込む
    const yamlContents = {
      basicInfos: await fs.readFile(path.join(process.cwd(), 'docs/requirements', 'basicInfos.yml'), 'utf8'),
      requirementsList: await fs.readFile(path.join(process.cwd(), 'docs/requirements', 'requirementsList.yml'), 'utf8'),
      nonFunctionsList: await fs.readFile(path.join(process.cwd(), 'docs/requirements', 'nonFunctionsList.yml'), 'utf8'),
      functionsList: await fs.readFile(path.join(process.cwd(), 'docs/requirements', 'functionsList.yml'), 'utf8'),
      tobeOperationFlow: await fs.readFile(path.join(process.cwd(), 'docs/requirements', 'tobeOperationFlow.yml'), 'utf8')
    };

    // screensList.ymlを別途読み込む
    const screensList = await fs.readFile(path.join(process.cwd(), 'docs/requirements', 'screensList.yml'), 'utf8');

    // MarkdownGeneratorのインスタンス化
    const generator = new MarkdownGenerator(yamlContents);

    // output/screensディレクトリを作成（存在しない場合）
    await fs.mkdir('output/screens', { recursive: true });

    // Markdown生成
    await generator.generateMarkdown(yamlContents.basicInfos, yaml.load(screensList));

    console.log('Markdown files have been generated successfully!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
