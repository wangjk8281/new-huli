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
  patientName: string;
  patientMeta: string;
  chiefComplaint: string;
  vitals: string[];
  vitalCards: {
    label: string;
    value: string;
    unit: string;
    tone?: 'danger' | 'warning' | 'normal';
  }[];
  focus: string[];
  scoreRule: string;
  intro: string;
  objective: string;
  timeHint: string;
  passingScore: number;
  steps: {
    id: string;
    title: string;
    promptLabel: 'AI患者' | 'AI考官';
    prompt: string;
    responseLabel: 'AI患者' | 'AI考官';
    successReply: string;
    partialReply: string;
    failReply: string;
    successNote: string;
    partialNote: string;
    failNote: string;
    maxScore: number;
    evaluationGroups: {
      label: string;
      keywords: string[];
    }[];
  }[];
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
    title: '胸痛急救评估',
    department: '急诊',
    level: '中级',
    patient: '患者：张某，男，55 岁',
    patientName: '张某',
    patientMeta: '男，55 岁',
    chiefComplaint: '胸痛 2 小时，向左肩放射',
    vitals: ['血压 158/95 mmHg', '心率 102 次/分', 'SpO2 93%', '体温 36.8℃'],
    vitalCards: [
      { label: '血压', value: '158/95', unit: 'mmHg', tone: 'danger' },
      { label: '心率', value: '102', unit: 'bpm', tone: 'warning' },
      { label: '血氧', value: '93%', unit: 'SpO₂', tone: 'warning' },
      { label: '体温', value: '36.8°', unit: 'C', tone: 'normal' },
    ],
    focus: ['氧合支持', '心电监测', '胸痛评估'],
    scoreRule: '系统会根据你发给 AI 的处理方案识别关键动作，命中越完整，得分越高。',
    intro: '患者清醒，胸前区持续压榨样疼痛，情绪紧张，已经开始担心是不是心脏问题。',
    objective: '先稳定患者，再完成胸痛初步评估、监测和上报。',
    timeHint: '急诊科 · 中级难度',
    passingScore: 75,
    steps: [
      {
        id: 'chest-step-1',
        title: '初步评估',
        promptLabel: 'AI患者',
        prompt: '护士，我胸口这里好痛，从两个小时前开始，一直痛到左边肩膀，我现在有点喘不上气。',
        responseLabel: 'AI患者',
        successReply: '好的……感觉稍微好了一点点，但胸口还是很痛，我是不是心脏出问题了？',
        partialReply: '我还是有点喘，胸口痛也没缓下来，你接下来还会帮我做什么？',
        failReply: '我越来越紧张了，胸口还是很闷，你先别走，我现在到底怎么样？',
        successNote: '+15分 给氧和首轮安抚处理正确',
        partialNote: '+8分 只做对了一部分，缺少首轮关键动作',
        failNote: '+0分 首轮处理太慢，患者没有得到及时支持',
        maxScore: 15,
        evaluationGroups: [
          { label: '氧合支持', keywords: ['吸氧', '给氧', '氧气', '4l', '4l/min', '鼻导管'] },
          { label: '初步安抚', keywords: ['安抚', '别紧张', '放松', '先别慌'] },
        ],
      },
      {
        id: 'chest-step-2',
        title: '监测上报',
        promptLabel: 'AI考官',
        prompt: '请继续对患者进行初步评估和处置。你下一步怎么做？',
        responseLabel: 'AI患者',
        successReply: '好的，现在有人在给我接监护，我安心一点了，不过胸口还是发紧。',
        partialReply: '你是在看我情况，但我不太确定现在是不是很严重。',
        failReply: '护士，我胸口还是这么痛，你是不是还没叫医生来看我？',
        successNote: '+15分 心电监测和呼叫上报到位',
        partialNote: '+8分 监测或上报只覆盖了一部分',
        failNote: '+0分 缺少关键监测和上报动作',
        maxScore: 15,
        evaluationGroups: [
          { label: '心电监测', keywords: ['心电图', '心电监护', '监护', '监测'] },
          { label: '通知医生', keywords: ['通知医生', '呼叫医生', '上报医生', '叫医生'] },
        ],
      },
      {
        id: 'chest-step-3',
        title: '病史追问',
        promptLabel: 'AI患者',
        prompt: '我会不会是心梗啊？这种痛一直压着，左肩也在痛。',
        responseLabel: 'AI考官',
        successReply: '继续。现在请补充胸痛相关病情信息，并判断是否需要重点关注急性心血管风险。',
        partialReply: '你有在问病情，但还不够聚焦。请继续补充关键胸痛信息。',
        failReply: '你现在还没有抓到重点。胸痛病人的核心病史需要马上补充。',
        successNote: '+10分 胸痛重点病史追问准确',
        partialNote: '+5分 追问方向部分正确',
        failNote: '+0分 没有抓到胸痛风险重点',
        maxScore: 10,
        evaluationGroups: [
          { label: '疼痛评估', keywords: ['疼痛', '几分', '性质', '压榨', '持续'] },
          { label: '高危识别', keywords: ['心梗', '冠心病', '急性冠脉', '风险'] },
        ],
      },
      {
        id: 'chest-step-4',
        title: '继续处置',
        promptLabel: 'AI考官',
        prompt: '医生还在赶来途中。此时你准备继续怎么做，才能保证患者安全？',
        responseLabel: 'AI患者',
        successReply: '好，我现在能感觉到你们在持续看着我。虽然还痛，但没有刚才那么慌了。',
        partialReply: '你在处理，但我还是不太确定接下来会不会突然加重。',
        failReply: '我还是很不舒服，感觉没有人持续盯着我。',
        successNote: '+15分 持续观察和安全处置完整',
        partialNote: '+8分 后续处置不够完整',
        failNote: '+0分 缺少持续观察和安全保障',
        maxScore: 15,
        evaluationGroups: [
          { label: '持续观察', keywords: ['复查', '继续观察', '持续监测', '观察生命体征'] },
          { label: '建立通路', keywords: ['静脉通路', '开通静脉', '留置针', '建立通路'] },
        ],
      },
    ],
  },
  {
    id: 'scenario-vent',
    title: '呼吸机报警处理',
    department: 'ICU',
    level: '初级',
    patient: '男性，67 岁，机械通气中突发高压报警',
    patientName: '王某',
    patientMeta: '男，67 岁',
    chiefComplaint: '机械通气中突发高压报警',
    vitals: ['SpO2 88%', '呼吸频率 28 次/分', '躁动增加'],
    vitalCards: [
      { label: '血氧', value: '88%', unit: 'SpO₂', tone: 'danger' },
      { label: '呼吸', value: '28', unit: '次/分', tone: 'warning' },
      { label: '报警', value: '高压', unit: '提示', tone: 'warning' },
      { label: '意识', value: '躁动', unit: '状态', tone: 'warning' },
    ],
    focus: ['先患者后设备', '吸痰准备', '复查生命体征'],
    scoreRule: '你发给 AI 的每一句处理方案，系统都会按关键动作识别并即时评分。',
    intro: '床旁持续高压报警，患者胸廓起伏变差，呼吸机回路暂未见明显脱落。',
    objective: '判断患者风险，排查高压报警原因，并完成安全处置与复查。',
    timeHint: 'ICU · 初级难度',
    passingScore: 75,
    steps: [
      {
        id: 'vent-step-1',
        title: '先看患者',
        promptLabel: 'AI考官',
        prompt: '呼吸机高压报警响起，患者血氧下降到 88%。你第一步打算怎么处理？',
        responseLabel: 'AI考官',
        successReply: '可以。你先看患者再看设备，顺序是对的。继续往下处理。',
        partialReply: '你提到了一部分，但还没把患者风险放在最前面。',
        failReply: '这一步顺序不对。高压报警时不能先动参数，应该先看患者状态。',
        successNote: '+15分 先患者后设备的顺序正确',
        partialNote: '+8分 只覆盖了一部分首轮判断',
        failNote: '+0分 顺序错误，先看患者这一步缺失',
        maxScore: 15,
        evaluationGroups: [
          { label: '评估患者', keywords: ['看患者', '观察患者', '血氧', '呼吸', '胸廓'] },
          { label: '暂不改参数', keywords: ['先不调参数', '再看机器', '检查报警原因'] },
        ],
      },
      {
        id: 'vent-step-2',
        title: '判断原因',
        promptLabel: 'AI患者',
        prompt: '我现在喘得更厉害了，喉咙像堵住一样，机器一直响。',
        responseLabel: 'AI考官',
        successReply: '判断方向对。高压报警合并痰鸣音时，要优先考虑分泌物堵塞并准备吸痰。',
        partialReply: '你开始考虑原因了，但还不够聚焦在最常见的高压风险上。',
        failReply: '这一步没有抓到关键。现在最需要先考虑气道阻力增高和分泌物问题。',
        successNote: '+15分 高压报警原因判断准确',
        partialNote: '+8分 只判断到部分原因',
        failNote: '+0分 没有抓到高压报警重点',
        maxScore: 15,
        evaluationGroups: [
          { label: '分泌物堵塞', keywords: ['痰', '分泌物', '堵塞', '痰鸣音'] },
          { label: '吸痰准备', keywords: ['吸痰', '负压', '吸痰管', '无菌'] },
        ],
      },
      {
        id: 'vent-step-3',
        title: '执行处理',
        promptLabel: 'AI考官',
        prompt: '吸痰准备已经到位。现在你准备怎样实施，才能尽量避免新的风险？',
        responseLabel: 'AI考官',
        successReply: '操作思路稳。吸痰时要控制时间和刺激强度，同时盯着血氧变化。',
        partialReply: '你说到了处理动作，但过程中的安全控制还不够完整。',
        failReply: '这一步风险很大。吸痰不能只顾动作本身，还要控制时长并持续观察。',
        successNote: '+10分 操作过程和安全控制正确',
        partialNote: '+5分 处理动作对了一半',
        failNote: '+0分 操作过程存在明显风险',
        maxScore: 10,
        evaluationGroups: [
          { label: '控制时长', keywords: ['时间', '控制时长', '轻柔', '避免反复'] },
          { label: '过程监测', keywords: ['观察血氧', '看血氧', '患者反应', '监测'] },
        ],
      },
      {
        id: 'vent-step-4',
        title: '处理后复查',
        promptLabel: 'AI患者',
        prompt: '现在机器不怎么响了，我呼吸也顺一点了。是不是已经没事了？',
        responseLabel: 'AI考官',
        successReply: '很好。报警解除后继续复查血氧、呼吸音和报警状态，这一步不能省。',
        partialReply: '你知道要收尾，但复查和记录还不够完整。',
        failReply: '不能直接结束。报警停了不代表患者已经稳定，复查仍然是必须动作。',
        successNote: '+10分 复查和记录动作完整',
        partialNote: '+5分 收尾动作不够完整',
        failNote: '+0分 漏掉了复查收口',
        maxScore: 10,
        evaluationGroups: [
          { label: '复查状态', keywords: ['复查', '血氧', '呼吸音', '报警状态'] },
          { label: '补记录', keywords: ['记录', '观察', '继续观察', '交接'] },
        ],
      },
    ],
  },
];

export const seedAttempts = [
  { questionId: 'q-vent-1', selectedIds: ['a'], source: 'chapter' as PracticeMode, correct: false },
  { questionId: 'q-vent-2', selectedIds: ['b'], source: 'chapter' as PracticeMode, correct: false },
  { questionId: 'q-shock-1', selectedIds: ['b'], source: 'special' as PracticeMode, correct: true },
  { questionId: 'q-wound-1', selectedIds: ['b'], source: 'chapter' as PracticeMode, correct: true },
  { questionId: 'q-vent-3', selectedIds: ['true'], source: 'random' as PracticeMode, correct: false },
];
