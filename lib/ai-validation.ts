import type { AiScenario } from '@/data/huxuebao-data';

export function detectInvalidClinicalInput(text: string, step: AiScenario['steps'][number]) {
  const raw = text.trim();
  const normalized = raw.toLowerCase();
  const compact = normalized.replace(/\s+/g, '');
  const hasChinese = /[\u4e00-\u9fff]/.test(raw);
  const lettersAndDigitsOnly = /^[a-z0-9._\-+]+$/i.test(compact);
  const matchedGroups = step.evaluationGroups.filter((group) =>
    group.keywords.some((keyword) => compact.includes(keyword.toLowerCase().replace(/\s+/g, '')))
  );

  if (!raw) {
    return '请先输入你的处置方案。';
  }

  if (lettersAndDigitsOnly && matchedGroups.length === 0) {
    return '你刚才这句看起来不是有效处置方案，请直接输入你准备怎么处理患者。';
  }

  if (!hasChinese && matchedGroups.length === 0 && raw.length < 12) {
    return '这句内容太像无效输入了，请直接描述你的处理动作，比如吸氧、监测、通知医生。';
  }

  return null;
}
