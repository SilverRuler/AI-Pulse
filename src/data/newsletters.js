export const categories = [
  { id: 'all', name: '전체 이슈', icon: 'Sparkles' },
  { id: 'llm', name: 'LLM & 모델', icon: 'Bot' },
  { id: 'opensource', name: '오픈소스 & 툴', icon: 'Terminal' },
  { id: 'business', name: '테크 & 비즈니스', icon: 'TrendingUp' },
  { id: 'research', name: '논문 & 리서치', icon: 'BookOpen' },
];

export const newsletters = [
  {
    id: 'issue-42',
    issueNumber: 42,
    date: '2026-08-18',
    title: 'GPT-5 아키텍처 루머 정리와 Llama 3.3의 획기적인 온디바이스 경량화',
    category: 'llm',
    categoryName: 'LLM & 모델',
    readTime: '4분 요약',
    featured: true,
    views: '2,410',
    likes: 184,
    summary: '차세대 대규모 파운데이션 모델의 추론 효율화 트렌드와 온디바이스 AI 혁신, 엔터프라이즈 환경에서의 에이전트 도입 사례를 핵심만 요약합니다.',
    bullets: [
      'OpenAI 차세대 추론 엔진 o3의 멀티스텝 추론 벤치마크 95% 돌파 소식',
      'Meta, 파라미터당 효율 30% 개선한 양자화 기술 공개 (모바일 구동 가능)',
      '실무 개발자를 위한 프롬프트 캐싱 비용 80% 절감 패턴 분석'
    ],
    content: {
      tldr: '오늘의 핵심 요약: 대형 언어 모델(LLM) 시장이 단순한 파라미터 크기 경쟁에서 "추론 시간 컴퓨팅(Inference-time Compute)"과 "온디바이스 경량화"의 2트랙 경쟁으로 재편되고 있습니다.',
      sections: [
        {
          heading: '1. 차세대 추론 모델 o3와 에이전틱 워크플로우',
          text: 'OpenAI의 최신 추론 체계는 기존 단순 텍스트 생성을 넘어, 스스로 생각하고 반성(Self-Reflection)하는 단계를 거칩니다. 코딩 및 복잡한 수학 문제 해결에서 기존 GPT-4o 대비 최대 40% 높은 성공률을 기록했으며, 소프트웨어 엔지니어링 벤치마크(SWE-bench)에서도 사람 수준의 자동 버그 픽스를 시연했습니다.'
        },
        {
          heading: '2. 오픈소스 진영: 양자화와 온디바이스 AI의 약진',
          text: 'Meta와 오픈소스 커뮤니티는 4비트/2비트 초경량 양자화 기법을 통해 스마트폰과 맥북에서 초당 60토큰 이상의 고속 추론을 달성했습니다. 이는 데이터 프라이버시가 중요한 사내 문서 검색(RAG) 및 개인 비서 앱 개발에 거대한 전환점이 될 것으로 전망됩니다.'
        },
        {
          heading: '3. 실무 팁: API 비용 80% 아끼는 프롬프트 캐싱 기법',
          text: '최근 주요 LLM API들이 일제히 프롬프트 캐싱(Prompt Caching) 기능을 기본 지원하기 시작했습니다. 시스템 프롬프트와 참조 문서를 고정하고 질문만 변경할 경우, 입력 토큰 비용이 75~85% 절감되며 응답 속도는 2배 이상 빨라집니다.'
        }
      ],
      sources: [
        { name: 'Arxiv Research Paper', url: 'https://arxiv.org' },
        { name: 'Meta AI Blog', url: 'https://ai.meta.com' },
        { name: 'OpenAI Developer Docs', url: 'https://platform.openai.com' }
      ]
    }
  },
  {
    id: 'issue-41',
    issueNumber: 41,
    date: '2026-08-16',
    title: '바이브 코딩(Vibe Coding) 시대: AI 에이전트 IDE 비교 및 실전 생산성 가이드',
    category: 'opensource',
    categoryName: '오픈소스 & 툴',
    readTime: '3분 요약',
    featured: false,
    views: '1,890',
    likes: 142,
    summary: 'Cursor, Windsurf, Claude Code 등 자율 코딩 에이전트의 차이점과 개발자가 생산성을 5배 끌어올리는 실전 팁을 정리했습니다.',
    bullets: [
      'Cursor vs Windsurf vs Claude Code 실제 프로젝트 빌드 벤치마크',
      '컨텍스트 윈도우 관리와 멀티 파일 리팩토링 최적화 팁',
      '오픈소스 대안: Ollama 기반 로컬 AI 코딩 환경 세팅법'
    ],
    content: {
      tldr: '개발자의 역할이 "코드 작성자"에서 "코드 디렉터 및 아키텍트"로 진화하고 있습니다.',
      sections: [
        {
          heading: '차세대 코딩 에이전트의 부상',
          text: '단순 코드 자동완성을 넘어 전체 프로젝트 레포지토리를 인덱싱하고 빌드 에러를 스스로 수정하는 에이전틱 IDE가 대세가 되었습니다. 특히 터미널 명령까지 자율 실행하는 환경이 정착되고 있습니다.'
        }
      ],
      sources: [
        { name: 'GitHub Trends', url: 'https://github.com' }
      ]
    }
  },
  {
    id: 'issue-40',
    issueNumber: 40,
    date: '2026-08-14',
    title: 'AI 반도체 전쟁: 엔비디아 블랙웰 양산 돌입과 커스텀 ASIC 칩의 부상',
    category: 'business',
    categoryName: '테크 & 비즈니스',
    readTime: '5분 요약',
    featured: false,
    views: '1,450',
    likes: 98,
    summary: '빅테크 기업들의 자체 실리콘 칩 개발 현황과 데이터센터 전력 소비 효율화 기술을 종합 분석합니다.',
    bullets: [
      '엔비디아 B200 풀 가동 및 차세대 HBM4 공급망 분석',
      '빅테크 4사의 자체 AI 가속기(TPU, Trainium) 도입 비율 40% 돌파',
      '액침 냉각(Immersion Cooling) 기술의 데이터센터 표준화'
    ],
    content: {
      tldr: '하드웨어 병목이 연산 성능에서 데이터센터 전력과 쿨링 인프라로 이동하고 있습니다.',
      sections: [
        {
          heading: '반도체 공급망과 전력 인프라의 격변',
          text: 'AI 모델의 추론 수요가 급증함에 따라 데이터센터의 전력 소모와 열 관리가 핵심 기술 과제로 부상했습니다.'
        }
      ],
      sources: [
        { name: 'TechCrunch Semiconductor Review', url: 'https://techcrunch.com' }
      ]
    }
  },
  {
    id: 'issue-39',
    issueNumber: 39,
    date: '2026-08-12',
    title: '심층 추론(Deep Reasoning) 메커니즘을 규명한 최신 MIT 리서치 리뷰',
    category: 'research',
    categoryName: '논문 & 리서치',
    readTime: '4분 요약',
    featured: false,
    views: '1,120',
    likes: 87,
    summary: 'LLM이 CoT(Chain-of-Thought) 과정에서 어떻게 논리적 비약을 방지하는지에 대한 기계적 해석 가능성(Interpretability) 분석.',
    bullets: [
      '트랜스포머 레이어 내부의 추론 헤드(Reasoning Head) 활성화 패턴 시각화',
      '환각(Hallucination) 현상을 사전에 85% 감지하는 임베딩 엔트로피 기법',
      '경량 모델에서도 심층 추론을 가능케 하는 지식 증류(Distillation) 방법론'
    ],
    content: {
      tldr: '블랙박스로 여겨지던 LLM 내부의 추론 회로가 점차 밝혀지고 있습니다.',
      sections: [
        {
          heading: '해석 가능성 연구의 획기적 진전',
          text: '신경망 내부의 특징 맵(Feature Map)을 분해하여 특정 거짓 답변이 생성되는 경로를 사전에 차단하는 연구가 활발합니다.'
        }
      ],
      sources: [
        { name: 'MIT CSAIL Archive', url: 'https://csail.mit.edu' }
      ]
    }
  }
];
