export const formSections = [
  {
    id: 'introImage',
    title: '[ 1도GYM 소개 ]',
    type: 'image',
    imageUrl: '/img/form1.jpg'
  },
  {
    id: 'exerciseFrequency',
    title: '1. 주 몇 회 운동 하시나요?',
    type: 'radio',
    options: [
      { value: 'weekly1', label: '주1회' },
      { value: 'weekly3', label: '주3회' },
      { value: 'daily', label: '매일' },
      { value: 'none', label: '안함' }
    ]
  },
  {
    id: 'exercisePurpose',
    title: '2. 운동이 필요한 이유는 무엇이라고 생각하나요?',
    type: 'radio',
    options: [
      { value: 'appearance', label: '외모 레벨업' },
      { value: 'health', label: '건강 증진' },
      { value: 'hobby', label: '재미/취미' },
      { value: 'show', label: '과시' },
      { value: 'other', label: '기타' }
    ],
    hasOther: true
  },
  {
    id: 'postureType',
    title: '3. 평상시 나의 자세는 어디에 해당되나요?',
    type: 'radio',
    imageUrl: '/img/form3.jpg',
    options: [
      { value: 'ideal', label: '이상적 자세' },
      { value: 'typeA', label: 'A타입' },
      { value: 'typeB', label: 'B타입' },
      { value: 'typeC', label: 'C타입' },
      { value: 'typeD', label: 'D타입' },
      { value: 'typeE', label: 'E타입' },
      { value: 'other', label: '기타' }
    ],
    hasOther: true
  },
  {
    id: 'nerveResponse',
    title: '[ 미주신경 운동 PT 관련 응답 ]',
    type: 'textarea',
    imageUrl: '/img/form4.jpg',
    placeholder: '미주신경 운동 PT에 대한 의견을 자유롭게 작성해주세요'
  },
  {
    id: 'participationIntent',
    title: '4. 삶의질을 높여주는 수준높은 동호회에 참여하시겠습니까?',
    type: 'radio',
    options: [
      { value: 'yes', label: 'O' },
      { value: 'no', label: 'X' }
    ]
  }
]

export const personalInfoSection = {
  title: '개인정보',
  fields: [
    {
      id: 'name',
      label: '이름',
      type: 'text',
      validation: {
        pattern: /^[가-힣]+$/,
        message: '이름은 한글만 입력 가능합니다.'
      }
    },
    {
      id: 'phone',
      label: '전화번호',
      type: 'tel',
      validation: {
        pattern: /^010-\d{4}-\d{4}$/,
        message: '올바른 전화번호 형식이 아닙니다.'
      }
    }
  ]
}
