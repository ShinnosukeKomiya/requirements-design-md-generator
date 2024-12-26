import yaml from 'js-yaml';
import fs from 'fs/promises';

export class MarkdownGenerator {
  constructor(yamlContents) {
    this.basicInfo = yaml.load(yamlContents.basicInfos);
    this.requirements = yaml.load(yamlContents.requirementsList);
    this.nonFunctions = yaml.load(yamlContents.nonFunctionsList);
    this.functions = yaml.load(yamlContents.functionsList);
    this.operations = yaml.load(yamlContents.tobeOperationFlow);
  }

  generateBasicSection() {
    return `# 基本要件定義書

## 1. プロジェクト概要

### 1.1 現状分析

#### 1.1.1 現行システムの概要
${this.basicInfo.current_system}

#### 1.1.2 対象ユーザー
${this.basicInfo.user_of_system.map(user => `- ${user}`).join('\n')}

#### 1.1.3 システム化の範囲
${this.basicInfo.scope.map(item => `- ${item}`).join('\n')}

### 1.2 課題

#### 1.2.1 現状の課題
${this.basicInfo.problems}

### 1.3 プロジェクトの目的

#### 1.3.1 目的
${this.basicInfo.about_project}

#### 1.3.2 期待される効果
- ${this.basicInfo.direction_of_solution}`;
  }

  generateToBeSection() {
    return `
## 2. To-Be要件

### 2.1 システム化の方針
${this.operations.map(op => `#### ${op.id}\n\`\`\`mermaid\n${op.value.mermaid}\n\`\`\``).join('\n\n')}

### 2.2 実現すべき要件
#### 2.2.1 機能要件
${this.requirements.map(req => `- ${req.requirement_name}：${req.description}`).join('\n')}

#### 2.2.2 非機能要件
${this.nonFunctions.map(nf => `- ${nf.non_function_name}：${nf.description}`).join('\n')}`;
  }

  generateFunctionList() {
    const functionRows = this.functions
      .sort((a, b) => a.id.localeCompare(b.id))
      .map(func => {
        return `| ${func.id} | ${func.function_name} | ${func.description} | [詳細](./functions/${func.id}.md) |`;
      })
      .join('\n');

    return `
## 3. 機能要件一覧
| 機能ID | 機能名 | 要約 | 詳細定義書リンク |
|--------|--------|------|------------------|
${functionRows}`;
  }

  generateFullMarkdown() {
    return [
      this.generateBasicSection(),
      this.generateToBeSection(),
      this.generateFunctionList()
    ].join('\n');
  }

  async generateFunctionRequirements(functionInfo) {
    // 入力項目のテーブル行を生成
    const inputRows = functionInfo.input
      ? functionInfo.input.split('、').map(input =>
          `| ${input.trim()} | TODO: 後工程で記載 | TODO: 後工程で記載 | TODO: 後工程で記載 |`
        ).join('\n')
      : '| TODO | TODO: 後工程で記載 | TODO: 後工程で記載 | TODO: 後工程で記載 |';

    // 出力項目のテーブル行を生成
    const outputRows = functionInfo.output
      ? functionInfo.output.split('、').map(output =>
          `| ${output.trim()} | TODO: 後工程で記載 |`
        ).join('\n')
      : '| TODO | TODO: 後工程で記載 |';

    return `# 機能要件定義書：${functionInfo.function_name}

## 0. ステータス
実装状況：未着手

## 1. 機能概要
### 1.1 機能ID
${functionInfo.id}

### 1.2 機能名
${functionInfo.function_name}

### 1.3 概要説明
${functionInfo.description}

### 1.4 機能の目的
TODO: 後工程で記載

## 2. 画面要件
### 2.1 入力項目
| 項目名 | 必須 | 形式制限 | 備考 |
|--------|------|----------|------|
${inputRows}

### 2.2 出力項目
| 項目名 | 備考 |
|--------|------|
${outputRows}

### 2.3 対象ユーザー
${functionInfo.user || 'TODO: 後工程で記載'}

## 3. 処理仕様
### 3.1 業務フロー
\`\`\`mermaid
TODO: 後工程でsequenceDiagramを記載
\`\`\`

### 3.2 処理詳細
TODO: 後工程で記載

### 3.3 エラー処理
TODO: 後工程で記載

## 4. 非機能要件
### 4.1 性能要件
TODO: 後工程で記載

### 4.2 セキュリティ要件
TODO: 後工程で記載
`;
  }

  async generateScreenRequirements(screenInfo) {
    // 入力項目のテーブル行を生成（getData配列から）
    const getDataRows = screenInfo.getData
      ? screenInfo.getData.map(data =>
          data.items.map(item =>
            `| ${data.table}.${item} | TODO: 後工程で記載 | TODO: 後工程で記載 | TODO: 後工程で記載 |`
          ).join('\n')
        ).join('\n')
      : '| TODO | TODO: 後工程で記載 | TODO: 後工程で記載 | TODO: 後工程で記載 |';

    // 出力項目のテーブル行を生成（postData配列から）
    const postDataRows = screenInfo.postData
      ? screenInfo.postData.map(data =>
          data.items.map(item =>
            `| ${data.table}.${item} | TODO: 後工程で記載 |`
          ).join('\n')
        ).join('\n')
      : '| TODO | TODO: 後工程で記載 |';

    return `# 画面要件定義書：${screenInfo.screenName}

## 0. ステータス
実装状況：未着手

## 1. 画面概要
### 1.1 画面ID
${screenInfo.id}

### 1.2 画面名
${screenInfo.screenName}

### 1.3 概要説明
${screenInfo.description}

### 1.4 画面の目的
TODO: 後工程で記載

## 2. 画面要件
### 2.1 画面項目
| 項目名 | 必須 | 形���制限 | 備考 |
|--------|------|----------|------|
${getDataRows}

### 2.2 画面アクション
| アクション | 備考 |
|------------|------|
${postDataRows}

### 2.3 対象ユーザー
${screenInfo.user}

### 2.4 アクセス権限
${screenInfo.accessRight}

## 3. 画面仕様
### 3.1 画面コンポーネント
${screenInfo['Screen components']}

### 3.2 操作手順
${screenInfo.operatingProcedure}

### 3.3 共通コンポーネント
${screenInfo.commonComponent ? screenInfo.commonComponent.join(', ') : 'なし'}

## 4. データ要件
### 4.1 取得データ
${screenInfo.getData ? screenInfo.getData.map(data =>
  `- ${data.table}テーブル\n  - ${data.items.join('\n  - ')}`
).join('\n') : 'なし'}

### 4.2 更新データ
${screenInfo.postData ? screenInfo.postData.map(data =>
  `- ${data.table}テーブル\n  - ${data.items.join('\n  - ')}`
).join('\n') : 'なし'}

## 5. 非機能要件
### 5.1 性能要件
TODO: 後工程で記載

### 5.2 セキュリティ要件
TODO: 後工程で記載
`;
  }

  async generateMarkdown(basicInfos, screensList) {
    // 全体要件定義書の生成
    const fullDoc = this.generateFullMarkdown();

    // output/screensディレクトリを作成（存在しない場合）
    try {
      await fs.mkdir('output/screens', { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }

    // 全体要件定義書を保存
    await fs.writeFile('output/requirements.md', fullDoc);

    // 各画面の要件定義書を生成
    for (const screen of screensList) {
      const screenDoc = await this.generateScreenRequirements(screen);
      await fs.writeFile(`output/screens/${screen.id}.md`, screenDoc);
    }
  }
}
