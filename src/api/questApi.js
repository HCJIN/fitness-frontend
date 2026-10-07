// 우리 Spring 서버와 통신하므로 JWT가 자동 포함되는 axios 인스턴스를 씁니다
import api from './axios';

// 전체 퀘스트 목록 조회
// GET /api/quests
export const getAllQuests = () => {
  return api.get('/api/quests');
};

// 오늘 퀘스트 목록 조회 (메인 홈, 퀘스트 페이지용)
// 각 퀘스트에 completedToday(오늘 완료 여부)가 포함되어 있어서
// 완료 버튼 비활성화 처리에 사용할 수 있습니다
// GET /api/quests/today
export const getTodayQuests = () => {
  return api.get('/api/quests/today');
};

// 내 퀘스트 진행현황 조회 (진행도 바용)
// progress / requiredCount 로 진행률을 계산할 수 있습니다
// GET /api/quests/my
export const getMyQuests = () => {
  return api.get('/api/quests/my');
};

// 퀘스트 완료 처리 → 포인트 지급
// POST /api/quests/{id}/complete
// 응답: { questId, earnedPoint, totalPoint, progress, cleared }
// 같은 날 같은 퀘스트를 다시 완료하면 409 에러가 옵니다
export const completeQuest = (id) => {
  return api.post(`/api/quests/${id}/complete`);
};