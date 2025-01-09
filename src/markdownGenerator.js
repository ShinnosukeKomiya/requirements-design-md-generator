import yaml from 'js-yaml';
import fs from 'fs/promises';

export class MarkdownGenerator {
  // 再帰的にJSONパースを試みる関数を修正
  parseNestedJson(value) {
    if (typeof value === 'string') {
      try {
        const unescaped = value.replace(/\\"/g, '"');
        return this.parseNestedJson(JSON.parse(unescaped));
      } catch (e) {
        return value;
      }
    } else if (Array.isArray(value)) {
      return value.map(item => this.parseNestedJson(item));
    } else if (value && typeof value === 'object') {
      const result = {};
      for (const [key, val] of Object.entries(value)) {
        result[key] = this.parseNestedJson(val);
      }
      return result;
    }
    return value;
  }

  constructor(yamlContents) {
    this.basicInfo = yaml.load(yamlContents.basicInfos);
    this.requirements = yaml.load(yamlContents.requirementsList);
    this.nonFunctions = yaml.load(yamlContents.nonFunctionsList);
    this.functions = yaml.load(yamlContents.functionsList);
    this.operations = yaml.load(yamlContents.tobeOperationFlow);

    // screensListに対して再帰的なパースを適用
    const rawScreens = yaml.load(yamlContents.screensList);
    this.screens = this.parseNestedJson(rawScreens);
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

  generateScreenList() {
    const screenRows = this.screens
      .sort((a, b) => a.id.localeCompare(b.id))
      .map(screen => {
        return `| ${screen.id} | ${screen.screenName} | ${screen.description} | [詳細](./screens/${screen.id}.md) |`;
      })
      .join('\n');

    return `
## 3. 画面要件一覧
| 画面ID | 画面名 | 要約 | 詳細定義書リンク |
|--------|--------|------|------------------|
${screenRows}`;
  }

  generateFullMarkdown() {
    return [
      this.generateBasicSection(),
      this.generateToBeSection(),
      this.generateScreenList()
    ].join('\n');
  }

  async generateScreenRequirements(screenInfo) {
    // getDataの処理
    let getDataRows = '';
    if (screenInfo.getData) {
      const getDataArray = this.parseNestedJson(screenInfo.getData);
      if (Array.isArray(getDataArray)) {
        getDataRows = getDataArray.map(data =>
          data.items.map(item =>
            `| ${data.table}.${item} | TODO: 後工程で記載 | TODO: 後工程で記載 | TODO: 後工程で記載 |`
          ).join('\n')
        ).join('\n');
      }
    }

    // postDataの処理
    let postDataRows = '';
    if (screenInfo.postData) {
      const postDataArray = this.parseNestedJson(screenInfo.postData);
      if (Array.isArray(postDataArray)) {
        postDataRows = postDataArray.map(data =>
          data.items.map(item =>
            `| ${data.table}.${item} | TODO: 後工程で記載 | TODO: 後工程で記載 | TODO: 後工程で記載 |`
          ).join('\n')
        ).join('\n');
      }
    }

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
### 2.1 Get Data
| 項目名 | 必須 | 形式制限 | 備考 |
|--------|------|----------|------|
${getDataRows}

### 2.2 Post Data
| 項目名 | 必須 | 形式制限 | 備考 |
|--------|------|----------|------|
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

## 4. 非機能要件
### 4.1 性能要件
TODO: 後工程で記載

### 4.2 セキュリティ要件
TODO: 後工程で記載
`;
  }

  async generateMarkdown() {
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
    for (const screen of this.screens) {
      const screenDoc = await this.generateScreenRequirements(screen);
      await fs.writeFile(`output/screens/${screen.id}.md`, screenDoc);
    }
  }
}
