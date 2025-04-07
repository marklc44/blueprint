/**
 * @jest-environment jsdom
*/
import { calculateAssessments, calculateScores } from "@/utils/results"

const response = {
  "screenerSectionId": "14081ca9-2ff3-461b-bcf1-7a83cca5c752",
  "answers": [
      {
          "questionId": "a979cdc7-a443-4e97-853c-550de46e9d9e",
          "value": 1
      },
      {
          "questionId": "7cb6f837-febd-4896-beda-382fdec2e3b9",
          "value": 1
      },
      {
          "questionId": "a07ee454-4702-415f-bc8f-b1df1fc3f781",
          "value": 1
      },
      {
          "questionId": "d3214f0c-2352-4469-9e95-412481c999bf",
          "value": 1
      },
      {
          "questionId": "c49190a6-de9b-4885-b0d9-0e74ef7c3ba6",
          "value": 1
      },
      {
          "questionId": "5d80bd02-d769-4531-8ae7-1c14f5e33c2c",
          "value": 1
      },
      {
          "questionId": "854b4414-e169-4fd4-9090-e4dbe45c0e19",
          "value": 1
      },
      {
          "questionId": "8df0c906-a07b-4bd0-beb3-bb0c626e6df9",
          "value": 1
      }
  ]
}
const domains = [
  {
      "id": "ed65fd9b-19ce-42b2-a549-22a0885f922b",
      "createdAt": "2025-04-06T21:59:42.207Z",
      "updatedAt": "2025-04-06T21:58:04.668Z",
      "name": "Depression",
      "scoringThreshold": 2,
      "scoringOperator": ">=",
      "level2Assessment": "PHQ-9"
  },
  {
      "id": "2a0c4199-d49b-4de5-ae34-f7337f6cb288",
      "createdAt": "2025-04-06T22:00:25.199Z",
      "updatedAt": "2025-04-06T21:59:49.989Z",
      "name": "Mania",
      "scoringThreshold": 2,
      "scoringOperator": ">=",
      "level2Assessment": "ASRM"
  },
  {
      "id": "0fb9c573-7c9a-4707-9de5-e2f1a0fd9f16",
      "createdAt": "2025-04-06T22:00:56.676Z",
      "updatedAt": "2025-04-06T22:00:27.770Z",
      "name": "Anxiety",
      "scoringThreshold": 2,
      "scoringOperator": ">=",
      "level2Assessment": "PHQ-9"
  },
  {
      "id": "67fb9aaf-1fd9-4425-88d1-d5f13afa771c",
      "createdAt": "2025-04-06T22:01:35.687Z",
      "updatedAt": "2025-04-06T22:02:49.842Z",
      "name": "Substance Use",
      "scoringThreshold": 1,
      "scoringOperator": ">=",
      "level2Assessment": "ASSIST"
  }
]
const questionMapping = [
  {
      "questionId": "a979cdc7-a443-4e97-853c-550de46e9d9e",
      "title": "Little interest or pleasure in doing things?",
      "domain": "depression"
  },
  {
      "questionId": "7cb6f837-febd-4896-beda-382fdec2e3b9",
      "title": "Feeling down, depressed, or hopeless?",
      "domain": "depression"
  },
  {
      "questionId": "a07ee454-4702-415f-bc8f-b1df1fc3f781",
      "title": "Sleeping less than usual, but still have a lot of energy?",
      "domain": "mania"
  },
  {
      "questionId": "d3214f0c-2352-4469-9e95-412481c999bf",
      "title": "Starting lots more projects than usual or doing more risky things than usual?",
      "domain": "mania"
  },
  {
      "questionId": "c49190a6-de9b-4885-b0d9-0e74ef7c3ba6",
      "title": "Feeling nervous, anxious, frightened, worried, or on edge?",
      "domain": "anxiety"
  },
  {
      "questionId": "5d80bd02-d769-4531-8ae7-1c14f5e33c2c",
      "title": "Feeling panic or being frightened?",
      "domain": "anxiety"
  },
  {
      "questionId": "854b4414-e169-4fd4-9090-e4dbe45c0e19",
      "title": "Avoiding situations that make you feel anxious?",
      "domain": "anxiety"
  },
  {
      "questionId": "8df0c906-a07b-4bd0-beb3-bb0c626e6df9",
      "title": "Drinking at least 4 drinks of any kind of alcohol in a single day?",
      "domain": "substance_use"
  }
]
const scores = {
  "depression": 2,
  "mania": 2,
  "anxiety": 3,
  "substance_use": 1
}

describe('calculateAssessments: generates an array of assessment strings', () => {
  test('calculates scores by domain', () => {
    const calcScores = calculateScores(response, domains, questionMapping)
    expect(calcScores).toEqual(scores)
  })
  test('calculates assessment array', () => {
    const results = calculateAssessments(response, domains, questionMapping)
    expect(results).toEqual(['PHQ-9', 'ASRM', 'ASSIST'])
  })
})