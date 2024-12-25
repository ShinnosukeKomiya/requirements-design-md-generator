import yaml from 'js-yaml';

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
}
