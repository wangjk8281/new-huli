export type Direction = {
  id: string;
  name: string;
  subtitle: string;
  target: string;
  tags: string[];
};

export type LessonType = 'video' | 'article' | 'animation';

export type Lesson = {
  id: string;
  title: string;
  type: LessonType;
  duration: string;
  summary: string;
  highlights: string[];
  articleSections?: { heading: string; body: string }[];
  animationSteps?: { title: string; detail: string; risk: string }[];
};

export type Course = {
  id: string;
  directionId: string;
  title: string;
  subtitle: string;
  description: string;
  knowledgePoints: string[];
  completionHint: string;
  lessons: Lesson[];
};

export type PracticeMode = 'chapter' | 'special' | 'random' | 'exam';

export type QuestionOption = {
  id: string;
  text: string;
};

export type Question = {
  id: string;
  courseId: string;
  knowledgePoint: string;
  type: 'single' | 'multiple' | 'judgement';
  stem: string;
  options: QuestionOption[];
  answerIds: string[];
  explanation: string;
  recommendation: string;
  modes: PracticeMode[];
};

export type ExamTemplate = {
  id: string;
  title: string;
  duration: string;
  questionIds: string[];
  targetCertificate: string;
};

export type AiScenario = {
  id: string;
  title: string;
  department: string;
  level: string;
  patient: string;
  vitals: string[];
  focus: string[];
  scoreRule: string;
};

export const directions: Direction[] = [
  {
    id: 'icu',
    name: 'ICU 专科',
    subtitle: '重症监护核心路径',
    target: '适合 ICU 值班护士和准备专科认证的学员',
    tags: ['呼吸机', '压疮', '液体管理'],
  },
  {
    id: 'emergency',
    name: '急诊急救',
    subtitle: '高频急救场景路径',
    target: '适合急诊、抢救室和轮转护士',
    tags: ['胸痛', '过敏性休克', '分诊'],
  },
  {
    id: 'internal',
    name: '内外科通用',
    subtitle: '住院部通用备考路径',
    target: '适合内外科日常护理和阶段考试复习',
    tags: ['低血糖', '引流管', '伤口观察'],
  },
  {
    id: 'pediatrics',
    name: '儿科护理',
    subtitle: '儿科重点操作路径',
    target: '适合儿科护士和规培学员',
    tags: ['高热惊厥', '静脉留置针', '家属沟通'],
  },
];

export const courses: Course[] = [
  {
    id: 'ventilator-alerts',
    directionId: 'icu',
    title: '呼吸机报警分型',
    subtitle: '本周重点',
    description: '从高压、低压到窒息报警，建立 ICU 高频报警的判断顺序和处置路径。',
    knowledgePoints: ['气道评估', '报警分型', '呼吸循环观察'],
    completionHint: '建议先完成视频，再做章节练习 8 题。',
    lessons: [
      {
        id: 'ventilator-video',
        title: '视频学习：高压与低压报警速记',
        type: 'video',
        duration: '12 分钟',
        summary: '用两条判断线快速区分管路阻塞、分泌物堆积和漏气脱落。',
        highlights: ['先看患者再看机器', '高压优先排查痰液和管路折叠', '低压优先排查脱管和漏气'],
      },
      {
        id: 'ventilator-article',
        title: '图文学习：报警排查流程',
        type: 'article',
        duration: '8 分钟',
        summary: '把报警处理拆成可复用的检查清单，适合交班前快速复盘。',
        highlights: ['先排患者危险，再排设备原因', '记录处置后的生命体征变化'],
        articleSections: [
          {
            heading: '先患者后设备',
            body: '报警出现后先看意识、呼吸、胸廓起伏和血氧，再决定是否需要立即人工通气。',
          },
          {
            heading: '高压报警思路',
            body: '重点排查分泌物堵塞、气道痉挛、管路打折和患者躁动等原因。',
          },
          {
            heading: '低压报警思路',
            body: '优先检查脱管、漏气、湿化器松脱和呼吸回路连接是否完整。',
          },
        ],
      },
      {
        id: 'ventilator-animation',
        title: '操作动画：痰液堵塞处理',
        type: 'animation',
        duration: '6 步',
        summary: '按标准步骤完成评估、吸痰准备、操作和复查。',
        highlights: ['操作前确认吸痰指征', '操作后复看血氧和报警是否解除'],
        animationSteps: [
          {
            title: '评估患者',
            detail: '判断有无呼吸窘迫、胸廓起伏减弱、血氧下降。',
            risk: '只看机器不看患者，容易遗漏紧急风险。',
          },
          {
            title: '准备吸痰',
            detail: '核对吸痰管型号、负压范围和无菌物品。',
            risk: '准备不完整会延长缺氧时间。',
          },
          {
            title: '实施吸痰',
            detail: '按规范时间控制吸痰过程，动作轻柔，避免反复刺激。',
            risk: '吸痰时间过长会加重低氧。',
          },
          {
            title: '复查效果',
            detail: '观察血氧、报警状态和患者呼吸音变化。',
            risk: '未复查容易遗漏仍未解除的气道问题。',
          },
        ],
      },
    ],
  },
  {
    id: 'shock-response',
    directionId: 'emergency',
    title: '过敏性休克处理',
    subtitle: 'AI 演练联动',
    description: '围绕急诊抢救链路，学习首轮评估、用药前准备和沟通顺序。',
    knowledgePoints: ['循环支持', '急救分诊', '沟通协作'],
    completionHint: '学完后进入 AI 情景演练巩固流程。',
    lessons: [
      {
        id: 'shock-video',
        title: '视频学习：首轮评估 4 步',
        type: 'video',
        duration: '10 分钟',
        summary: '重点训练 ABC 判断、吸氧、建立静脉通路和呼叫协作。',
        highlights: ['优先识别喉头水肿', '同步准备抢救车和静脉通路'],
      },
      {
        id: 'shock-article',
        title: '图文学习：处置顺序拆解',
        type: 'article',
        duration: '6 分钟',
        summary: '把高频扣分点整理成急诊值班可直接复用的检查表。',
        highlights: ['评估与呼叫医生同步进行', '及时记录血压和皮肤变化'],
        articleSections: [
          {
            heading: '快速评估',
            body: '先识别皮疹、喘鸣、气促、血压下降，再决定抢救级别。',
          },
          {
            heading: '协作分工',
            body: '明确谁负责建立通路、谁负责监测生命体征、谁负责记录。',
          },
        ],
      },
    ],
  },
  {
    id: 'wound-care',
    directionId: 'internal',
    title: '术后伤口与引流管护理',
    subtitle: '章节练习重点',
    description: '聚焦常见术后观察指标、引流液判断和交接要点。',
    knowledgePoints: ['伤口观察', '引流护理', '交接记录'],
    completionHint: '适合夜班前快速复盘。',
    lessons: [
      {
        id: 'wound-article',
        title: '图文学习：伤口观察重点',
        type: 'article',
        duration: '9 分钟',
        summary: '把红肿、渗血、疼痛和引流变化按风险等级分类。',
        highlights: ['关注渗血量变化', '异常引流颜色需要及时上报'],
        articleSections: [
          {
            heading: '观察频次',
            body: '术后早期需按医嘱和病情变化增加查看频次，不能只依赖固定时间点。',
          },
          {
            heading: '记录重点',
            body: '记录伤口状态、引流液性状、总量和患者主诉，方便交接。',
          },
        ],
      },
      {
        id: 'wound-animation',
        title: '操作动画：引流袋更换流程',
        type: 'animation',
        duration: '5 步',
        summary: '演示更换过程中的无菌要点和固定要求。',
        highlights: ['更换前后都要核对引流通畅度'],
        animationSteps: [
          {
            title: '评估与解释',
            detail: '确认更换指征，并向患者说明目的和配合点。',
            risk: '未解释容易导致患者紧张和配合不足。',
          },
          {
            title: '无菌更换',
            detail: '按顺序夹闭、拆卸、连接新装置并固定。',
            risk: '无菌环节不到位会增加感染风险。',
          },
        ],
      },
    ],
  },
];

export const questions: Question[] = [
  {
    id: 'q-vent-1',
    courseId: 'ventilator-alerts',
    knowledgePoint: '气道评估',
    type: 'single',
    stem: '呼吸机高压报警时，护士的首要动作是什么？',
    options: [
      { id: 'a', text: '直接调低报警阈值' },
      { id: 'b', text: '先观察患者呼吸状态和血氧' },
      { id: 'c', text: '先关闭呼吸机重新启动' },
      { id: 'd', text: '立即记录报警时间' },
    ],
    answerIds: ['b'],
    explanation: '报警处理必须先看患者，再排查设备，避免漏掉真正的紧急风险。',
    recommendation: '回看《呼吸机报警分型》视频第 1 节。',
    modes: ['chapter', 'random', 'exam'],
  },
  {
    id: 'q-vent-2',
    courseId: 'ventilator-alerts',
    knowledgePoint: '报警分型',
    type: 'multiple',
    stem: '以下哪些情况更可能触发低压报警？',
    options: [
      { id: 'a', text: '患者躁动咬管' },
      { id: 'b', text: '呼吸回路连接松脱' },
      { id: 'c', text: '气囊漏气' },
      { id: 'd', text: '痰液堵塞' },
    ],
    answerIds: ['b', 'c'],
    explanation: '低压报警通常与漏气和连接不完整有关，痰液堵塞更常见于高压报警。',
    recommendation: '回看《报警排查流程》里的低压报警章节。',
    modes: ['chapter', 'special', 'random', 'exam'],
  },
  {
    id: 'q-shock-1',
    courseId: 'shock-response',
    knowledgePoint: '循环支持',
    type: 'single',
    stem: '怀疑过敏性休克时，下列哪项更符合首轮处置顺序？',
    options: [
      { id: 'a', text: '先让患者休息，等待医生到场再处理' },
      { id: 'b', text: '先建立静脉通路并监测生命体征' },
      { id: 'c', text: '先完成完整病史采集' },
      { id: 'd', text: '先转入普通病房观察' },
    ],
    answerIds: ['b'],
    explanation: '首轮重点是识别危险、吸氧、建立通路和监测，不应延误抢救准备。',
    recommendation: '复习《过敏性休克处理》图文页的协作分工部分。',
    modes: ['chapter', 'special', 'random', 'exam'],
  },
  {
    id: 'q-shock-2',
    courseId: 'shock-response',
    knowledgePoint: '沟通协作',
    type: 'judgement',
    stem: '过敏性休克场景中，等待医生到场后再呼叫协作人员更稳妥。',
    options: [
      { id: 'true', text: '正确' },
      { id: 'false', text: '错误' },
    ],
    answerIds: ['false'],
    explanation: '协作呼叫应尽早发起，评估、监测和抢救准备通常需要同步进行。',
    recommendation: '回看视频中的抢救分工清单。',
    modes: ['special', 'random'],
  },
  {
    id: 'q-wound-1',
    courseId: 'wound-care',
    knowledgePoint: '伤口观察',
    type: 'single',
    stem: '术后早期发现伤口敷料渗血量明显增加，最合适的做法是？',
    options: [
      { id: 'a', text: '等下一轮查房统一处理' },
      { id: 'b', text: '立即记录并上报，同时观察生命体征变化' },
      { id: 'c', text: '自行更换敷料后不记录' },
      { id: 'd', text: '直接拔除引流管' },
    ],
    answerIds: ['b'],
    explanation: '渗血量明显增加提示风险变化，需及时记录、上报并持续观察。',
    recommendation: '查看《伤口观察重点》的记录重点部分。',
    modes: ['chapter', 'special', 'random', 'exam'],
  },
  {
    id: 'q-wound-2',
    courseId: 'wound-care',
    knowledgePoint: '引流护理',
    type: 'multiple',
    stem: '引流袋更换时，需要特别核对哪些内容？',
    options: [
      { id: 'a', text: '引流是否通畅' },
      { id: 'b', text: '新装置连接是否牢固' },
      { id: 'c', text: '患者当天早餐内容' },
      { id: 'd', text: '更换后的固定情况' },
    ],
    answerIds: ['a', 'b', 'd'],
    explanation: '通畅度、连接牢固度和固定情况都会直接影响后续引流安全。',
    recommendation: '回看引流袋更换动画的无菌更换步骤。',
    modes: ['chapter', 'random'],
  },
  {
    id: 'q-vent-3',
    courseId: 'ventilator-alerts',
    knowledgePoint: '呼吸循环观察',
    type: 'judgement',
    stem: '报警解除后无需再次查看血氧，只要机器不响即可。',
    options: [
      { id: 'true', text: '正确' },
      { id: 'false', text: '错误' },
    ],
    answerIds: ['false'],
    explanation: '报警解除不代表患者状态已经稳定，仍需复查生命体征和呼吸表现。',
    recommendation: '复习《痰液堵塞处理》动画最后一步。',
    modes: ['chapter', 'random', 'exam'],
  },
  {
    id: 'q-shock-3',
    courseId: 'shock-response',
    knowledgePoint: '急救分诊',
    type: 'single',
    stem: '患者出现皮疹、喘鸣和血压下降时，最需要优先识别的是？',
    options: [
      { id: 'a', text: '是否需要安排家属签字' },
      { id: 'b', text: '是否存在气道受累和循环不稳定' },
      { id: 'c', text: '既往住院次数' },
      { id: 'd', text: '饮食偏好' },
    ],
    answerIds: ['b'],
    explanation: '这类组合症状提示急性危重风险，首要是判断气道和循环是否稳定。',
    recommendation: '进入 AI 演练再练一次首轮评估场景。',
    modes: ['special', 'random', 'exam'],
  },
];

export const examTemplates: ExamTemplate[] = [
  {
    id: 'exam-icu-basic',
    title: 'ICU 阶段模拟考试',
    duration: '20 分钟',
    questionIds: ['q-vent-1', 'q-vent-2', 'q-vent-3', 'q-wound-1', 'q-shock-1'],
    targetCertificate: 'ICU 基础护理阶段证书',
  },
];

export const aiScenarios: AiScenario[] = [
  {
    id: 'scenario-shock',
    title: '过敏性休克处理',
    department: '急诊',
    level: '中级',
    patient: '女性，56 岁，输液后出现皮疹、气促、血压下降',
    vitals: ['血压 82/54 mmHg', 'SpO2 90%', '心率 118 次/分'],
    focus: ['首轮评估', '协作呼叫', '循环支持'],
    scoreRule: '关键步骤缺失重点扣分，追问响应计入流程得分。',
  },
  {
    id: 'scenario-vent',
    title: '呼吸机报警处理',
    department: 'ICU',
    level: '初级',
    patient: '男性，67 岁，机械通气中突发高压报警',
    vitals: ['SpO2 88%', '呼吸频率 28 次/分', '躁动增加'],
    focus: ['先患者后设备', '吸痰准备', '复查生命体征'],
    scoreRule: '按标准步骤逐项评分，顺序错误会扣减流程分。',
  },
];

export const seedAttempts = [
  { questionId: 'q-vent-1', selectedIds: ['a'], source: 'chapter' as PracticeMode, correct: false },
  { questionId: 'q-vent-2', selectedIds: ['b'], source: 'chapter' as PracticeMode, correct: false },
  { questionId: 'q-shock-1', selectedIds: ['b'], source: 'special' as PracticeMode, correct: true },
  { questionId: 'q-wound-1', selectedIds: ['b'], source: 'chapter' as PracticeMode, correct: true },
  { questionId: 'q-vent-3', selectedIds: ['true'], source: 'random' as PracticeMode, correct: false },
];
