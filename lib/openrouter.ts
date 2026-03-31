import type { AiScenario } from '@/data/huxuebao-data';

type ChatRole = 'AI患者' | 'AI考官' | '你';

export type AiTurnResult = {
  replyLabel: 'AI患者' | 'AI考官';
  reply: string;
  scoreDelta: number;
  scoreNote: string;
  matched: string[];
  missed: string[];
};

type ConversationMessage = {
  speaker: ChatRole;
  text: string;
};

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function requestAiTurn(input: {
  scenario: AiScenario;
  step: AiScenario['steps'][number];
  history: ConversationMessage[];
  userInput: string;
}): Promise<AiTurnResult> {
  const apiKey = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY?.trim();
  const model = process.env.EXPO_PUBLIC_OPENROUTER_MODEL?.trim() || 'google/gemini-2.5-flash-lite';

  if (!apiKey) {
    throw new Error('未配置 AI key');
  }

  const prompt = buildPrompt(input);
  const promptPreview = prompt.slice(0, 240).replace(/\s+/g, ' ');

  console.log('[AI] request:start', {
    url: OPENROUTER_URL,
    model,
    scenarioId: input.scenario.id,
    stepId: input.step.id,
    replyLabel: input.step.responseLabel,
    historyCount: input.history.length,
    userInput: input.userInput,
    promptPreview,
  });

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://huliapp.local',
      'X-Title': 'Huli App',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content:
            '你是护士培训 App 的 AI 情景演练引擎。你必须只返回一个 JSON 对象，不能有 markdown，不能有解释，不能有代码块。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.log('[AI] request:error', {
      status: response.status,
      statusText: response.statusText,
      bodyPreview: errorText.slice(0, 400),
    });
    throw new Error(errorText || `AI 请求失败: ${response.status}`);
  }

  const data = await response.json();
  const rawContent = data?.choices?.[0]?.message?.content;

  console.log('[AI] request:response', {
    status: response.status,
    provider: data?.provider,
    model: data?.model,
    rawPreview: typeof rawContent === 'string' ? rawContent.slice(0, 400) : rawContent,
  });

  if (typeof rawContent !== 'string' || !rawContent.trim()) {
    throw new Error('AI 没有返回内容');
  }

  const parsed = parseJsonObject(rawContent);

  console.log('[AI] request:parsed', {
    replyLabel: parsed.replyLabel,
    scoreDelta: parsed.scoreDelta,
    scoreNote: parsed.scoreNote,
    matched: parsed.matched,
    missed: parsed.missed,
  });

  return {
    replyLabel: parsed.replyLabel === 'AI患者' || parsed.replyLabel === 'AI考官' ? parsed.replyLabel : input.step.responseLabel,
    reply: typeof parsed.reply === 'string' && parsed.reply.trim() ? parsed.reply.trim() : input.step.partialReply,
    scoreDelta: clampNumber(parsed.scoreDelta, 0, input.step.maxScore),
    scoreNote:
      typeof parsed.scoreNote === 'string' && parsed.scoreNote.trim()
        ? parsed.scoreNote.trim()
        : input.step.partialNote,
    matched: normalizeStringArray(parsed.matched),
    missed: normalizeStringArray(parsed.missed),
  };
}

function buildPrompt(input: {
  scenario: AiScenario;
  step: AiScenario['steps'][number];
  history: ConversationMessage[];
  userInput: string;
}) {
  const { scenario, step, history, userInput } = input;
  const transcript = history
    .map((message) => `${message.speaker}: ${message.text}`)
    .join('\n');

  return [
    `你正在模拟一个中文护理演练场景。`,
    `场景标题：${scenario.title}`,
    `科室：${scenario.department}`,
    `难度：${scenario.level}`,
    `患者信息：${scenario.patient}；主诉：${scenario.chiefComplaint}`,
    `生命体征：${scenario.vitals.join('；')}`,
    `当前阶段：${step.title}`,
    `当前阶段提示发言者：${step.promptLabel}`,
    `当前阶段提示内容：${step.prompt}`,
    `这一轮 AI 应该使用的身份：${step.responseLabel}`,
    `这一轮重点动作：${step.evaluationGroups.map((group) => `${group.label}(${group.keywords.join('、')})`).join('；')}`,
    `这一轮满分：${step.maxScore}`,
    `历史对话：\n${transcript || '暂无'}`,
    `用户刚输入的处置方案：${userInput}`,
    `请你先判断用户这句话有没有覆盖本轮重点，然后给出自然、简短、像真实患者或考官会说的话。`,
    `评分规则：覆盖越完整，分数越高；如果明显跑偏，可以给 0 分。`,
    `如果用户输入像“e3333”这种乱码、随便敲的字符、和护理处置无关的内容，你必须判定为无效输入：scoreDelta=0，matched=[]，missed写本轮重点，replyLabel固定为AI考官，并明确要求用户重新输入有效处置方案。`,
    `你必须只返回 JSON，格式如下：`,
    '{"replyLabel":"AI患者 或 AI考官","reply":"一句自然中文回复","scoreDelta":0,"scoreNote":"例如：+8分 已做对首轮评估的一部分","matched":["命中的重点"],"missed":["缺失的重点"]}',
  ].join('\n');
}

function parseJsonObject(raw: string) {
  const cleaned = raw.replace(/```json|```/g, '').trim();
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error('AI 返回格式不对');
  }

  return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
}

function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
}

function clampNumber(value: unknown, min: number, max: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return min;
  }

  return Math.max(min, Math.min(max, Math.round(value)));
}
