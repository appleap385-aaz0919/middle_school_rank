import schoolDataBase from './schoolDataBase.json';

// 기존 순위 데이터 보존 (11개 지역의 순위 정보)
const existingRankingData = {
  2025: {
    '서울특별시 강남구': [
      { rank: 1, name: '청담중학교', type: '사립', gender: '남녀공학', achievement: 92.5, admission: 68.3 },
      { rank: 2, name: '압구정중학교', type: '공립', gender: '남녀공학', achievement: 90.8, admission: 65.2 },
      { rank: 3, name: '단국대사대부속중학교', type: '사립', gender: '남녀공학', achievement: 89.4, admission: 72.1 },
      { rank: 4, name: '수서중학교', type: '공립', gender: '남녀공학', achievement: 88.7, admission: 58.9 },
      { rank: 5, name: '대청중학교', type: '공립', gender: '남녀공학', achievement: 87.2, admission: 55.4 },
      { rank: 6, name: '일원중학교', type: '공립', gender: '남녀공학', achievement: 86.5, admission: 52.1 },
      { rank: 7, name: '개포중학교', type: '공립', gender: '남녀공학', achievement: 85.8, admission: 48.7 },
      { rank: 8, name: '도곡중학교', type: '공립', gender: '남녀공학', achievement: 84.9, admission: 45.3 },
      { rank: 9, name: '세곡중학교', type: '공립', gender: '남녀공학', achievement: 83.2, admission: 42.8 },
      { rank: 10, name: '삼성중학교', type: '사립', gender: '남녀공학', achievement: 82.5, admission: 39.6 },
    ],
    '서울특별시 서초구': [
      { rank: 11, name: '서초중학교', type: '공립', gender: '남녀공학', achievement: 88.3, admission: 62.4 },
      { rank: 12, name: '반포중학교', type: '공립', gender: '남녀공학', achievement: 86.9, admission: 58.1 },
      { rank: 13, name: '방배중학교', type: '공립', gender: '남녀공학', achievement: 85.2, admission: 54.7 },
      { rank: 14, name: '양재중학교', type: '공립', gender: '남녀공학', achievement: 84.1, admission: 51.3 },
      { rank: 15, name: '우면중학교', type: '공립', gender: '남녀공학', achievement: 82.8, admission: 48.9 },
    ],
    '서울특별시 송파구': [
      { rank: 16, name: '송파중학교', type: '공립', gender: '남녀공학', achievement: 86.4, admission: 56.2 },
      { rank: 17, name: '삼전중학교', type: '공립', gender: '남녀공학', achievement: 85.1, admission: 53.8 },
      { rank: 18, name: '가동중학교', type: '공립', gender: '남녀공학', achievement: 83.9, admission: 50.4 },
      { rank: 19, name: '문정중학교', type: '공립', gender: '남녀공학', achievement: 82.6, admission: 47.1 },
      { rank: 20, name: '잠실중학교', type: '공립', gender: '남녀공학', achievement: 81.3, admission: 44.8 },
    ],
    '경기도 성남시': [
      { rank: 21, name: '분당중학교', type: '공립', gender: '남녀공학', achievement: 85.7, admission: 59.3 },
      { rank: 22, name: '수내중학교', type: '공립', gender: '남녀공학', achievement: 84.5, admission: 55.9 },
      { rank: 23, name: '야탑중학교', type: '공립', gender: '남녀공학', achievement: 83.2, admission: 52.6 },
      { rank: 24, name: '이매중학교', type: '공립', gender: '남녀공학', achievement: 82.1, admission: 49.2 },
      { rank: 25, name: '태원중학교', type: '공립', gender: '남녀공학', achievement: 80.9, admission: 46.8 },
    ],
    '경기도 수원시': [
      { rank: 26, name: '수원중학교', type: '공립', gender: '남녀공학', achievement: 84.8, admission: 57.4 },
      { rank: 27, name: '장안중학교', type: '공립', gender: '남녀공학', achievement: 83.6, admission: 54.1 },
      { rank: 28, name: '권선중학교', type: '공립', gender: '남녀공학', achievement: 82.3, admission: 50.8 },
      { rank: 29, name: '팔달중학교', type: '공립', gender: '남녀공학', achievement: 81.2, admission: 47.5 },
      { rank: 30, name: '영통중학교', type: '공립', gender: '남녀공학', achievement: 79.8, admission: 44.2 },
    ],
    '부산광역시 해운대구': [
      { rank: 31, name: '해운대중학교', type: '공립', gender: '남녀공학', achievement: 83.4, admission: 52.3 },
      { rank: 32, name: '반송중학교', type: '공립', gender: '남녀공학', achievement: 82.1, admission: 48.9 },
      { rank: 33, name: '좌천중학교', type: '공립', gender: '남녀공학', achievement: 80.8, admission: 45.6 },
    ],
    '대구광역시 수성구': [
      { rank: 34, name: '수성중학교', type: '공립', gender: '남녀공학', achievement: 84.2, admission: 54.7 },
      { rank: 35, name: '범어중학교', type: '공립', gender: '남녀공학', achievement: 82.9, admission: 51.4 },
      { rank: 36, name: '지산중학교', type: '공립', gender: '남녀공학', achievement: 81.6, admission: 48.1 },
    ],
    '인천광역시 남동구': [
      { rank: 37, name: '남동중학교', type: '공립', gender: '남녀공학', achievement: 82.7, admission: 50.2 },
      { rank: 38, name: '구월중학교', type: '공립', gender: '남녀공학', achievement: 81.4, admission: 46.9 },
      { rank: 39, name: '만수중학교', type: '공립', gender: '남녀공학', achievement: 80.1, admission: 43.6 },
    ],
    '광주광역시 북구': [
      { rank: 40, name: '북중학교', type: '공립', gender: '남녀공학', achievement: 81.8, admission: 48.5 },
      { rank: 41, name: '운암중학교', type: '공립', gender: '남녀공학', achievement: 80.5, admission: 45.2 },
    ],
    '대전광역시 유성구': [
      { rank: 42, name: '유성중학교', type: '공립', gender: '남녀공학', achievement: 83.1, admission: 51.8 },
      { rank: 43, name: '둔산중학교', type: '공립', gender: '남녀공학', achievement: 81.8, admission: 48.5 },
      { rank: 44, name: '탄방중학교', type: '공립', gender: '남녀공학', achievement: 80.5, admission: 45.2 },
    ],
  },
  2024: {
    '서울특별시 강남구': [
      { rank: 1, name: '청담중학교', type: '사립', gender: '남녀공학', achievement: 91.8, admission: 66.9 },
      { rank: 2, name: '압구정중학교', type: '공립', gender: '남녀공학', achievement: 90.2, admission: 64.1 },
      { rank: 3, name: '단국대사대부속중학교', type: '사립', gender: '남녀공학', achievement: 88.9, admission: 70.8 },
      { rank: 4, name: '수서중학교', type: '공립', gender: '남녀공학', achievement: 88.1, admission: 57.4 },
      { rank: 5, name: '대청중학교', type: '공립', gender: '남녀공학', achievement: 86.7, admission: 54.1 },
      { rank: 6, name: '일원중학교', type: '공립', gender: '남녀공학', achievement: 85.9, admission: 50.8 },
      { rank: 7, name: '개포중학교', type: '공립', gender: '남녀공학', achievement: 85.2, admission: 47.5 },
      { rank: 8, name: '도곡중학교', type: '공립', gender: '남녀공학', achievement: 84.3, admission: 44.2 },
      { rank: 9, name: '세곡중학교', type: '공립', gender: '남녀공학', achievement: 82.6, admission: 41.8 },
      { rank: 10, name: '삼성중학교', type: '사립', gender: '남녀공학', achievement: 81.9, admission: 38.6 },
    ],
    '서울특별시 서초구': [
      { rank: 11, name: '서초중학교', type: '공립', gender: '남녀공학', achievement: 87.6, admission: 61.2 },
      { rank: 12, name: '반포중학교', type: '공립', gender: '남녀공학', achievement: 86.2, admission: 57.1 },
      { rank: 13, name: '방배중학교', type: '공립', gender: '남녀공학', achievement: 84.6, admission: 53.8 },
      { rank: 14, name: '양재중학교', type: '공립', gender: '남녀공학', achievement: 83.5, admission: 50.4 },
      { rank: 15, name: '우면중학교', type: '공립', gender: '남녀공학', achievement: 82.2, admission: 47.9 },
    ],
    '서울특별시 송파구': [
      { rank: 16, name: '송파중학교', type: '공립', gender: '남녀공학', achievement: 85.7, admission: 55.1 },
      { rank: 17, name: '삼전중학교', type: '공립', gender: '남녀공학', achievement: 84.5, admission: 52.7 },
      { rank: 18, name: '가동중학교', type: '공립', gender: '남녀공학', achievement: 83.3, admission: 49.4 },
      { rank: 19, name: '문정중학교', type: '공립', gender: '남녀공학', achievement: 82.1, admission: 46.1 },
      { rank: 20, name: '잠실중학교', type: '공립', gender: '남녀공학', achievement: 80.8, admission: 43.8 },
    ],
    '경기도 성남시': [
      { rank: 21, name: '분당중학교', type: '공립', gender: '남녀공학', achievement: 85.0, admission: 58.2 },
      { rank: 22, name: '수내중학교', type: '공립', gender: '남녀공학', achievement: 83.9, admission: 54.9 },
      { rank: 23, name: '야탑중학교', type: '공립', gender: '남녀공학', achievement: 82.6, admission: 51.6 },
      { rank: 24, name: '이매중학교', type: '공립', gender: '남녀공학', achievement: 81.5, admission: 48.3 },
      { rank: 25, name: '태원중학교', type: '공립', gender: '남녀공학', achievement: 80.2, admission: 45.9 },
    ],
    '경기도 수원시': [
      { rank: 26, name: '수원중학교', type: '공립', gender: '남녀공학', achievement: 84.1, admission: 56.3 },
      { rank: 27, name: '장안중학교', type: '공립', gender: '남녀공학', achievement: 82.9, admission: 53.1 },
      { rank: 28, name: '권선중학교', type: '공립', gender: '남녀공학', achievement: 81.7, admission: 49.8 },
      { rank: 29, name: '팔달중학교', type: '공립', gender: '남녀공학', achievement: 80.6, admission: 46.5 },
      { rank: 30, name: '영통중학교', type: '공립', gender: '남녀공학', achievement: 79.2, admission: 43.2 },
    ],
    '부산광역시 해운대구': [
      { rank: 31, name: '해운대중학교', type: '공립', gender: '남녀공학', achievement: 82.7, admission: 51.3 },
      { rank: 32, name: '반송중학교', type: '공립', gender: '남녀공학', achievement: 81.4, admission: 47.9 },
      { rank: 33, name: '좌천중학교', type: '공립', gender: '남녀공학', achievement: 80.1, admission: 44.6 },
    ],
    '대구광역시 수성구': [
      { rank: 34, name: '수성중학교', type: '공립', gender: '남녀공학', achievement: 83.5, admission: 53.7 },
      { rank: 35, name: '범어중학교', type: '공립', gender: '남녀공학', achievement: 82.2, admission: 50.4 },
      { rank: 36, name: '지산중학교', type: '공립', gender: '남녀공학', achievement: 80.9, admission: 47.1 },
    ],
    '인천광역시 남동구': [
      { rank: 37, name: '남동중학교', type: '공립', gender: '남녀공학', achievement: 82.0, admission: 49.2 },
      { rank: 38, name: '구월중학교', type: '공립', gender: '남녀공학', achievement: 80.7, admission: 45.9 },
      { rank: 39, name: '만수중학교', type: '공립', gender: '남녀공학', achievement: 79.4, admission: 42.6 },
    ],
    '광주광역시 북구': [
      { rank: 40, name: '북중학교', type: '공립', gender: '남녀공학', achievement: 81.1, admission: 47.5 },
      { rank: 41, name: '운암중학교', type: '공립', gender: '남녀공학', achievement: 79.8, admission: 44.2 },
    ],
    '대전광역시 유성구': [
      { rank: 42, name: '유성중학교', type: '공립', gender: '남녀공학', achievement: 82.4, admission: 50.8 },
      { rank: 43, name: '둔산중학교', type: '공립', gender: '남녀공학', achievement: 81.1, admission: 47.5 },
      { rank: 44, name: '탄방중학교', type: '공립', gender: '남녀공학', achievement: 79.8, admission: 44.2 },
    ],
  },
  2023: {
    '서울특별시 강남구': [
      { rank: 1, name: '청담중학교', type: '사립', gender: '남녀공학', achievement: 91.2, admission: 65.5 },
      { rank: 2, name: '압구정중학교', type: '공립', gender: '남녀공학', achievement: 89.6, admission: 63.0 },
      { rank: 3, name: '단국대사대부속중학교', type: '사립', gender: '남녀공학', achievement: 88.4, admission: 69.5 },
      { rank: 4, name: '수서중학교', type: '공립', gender: '남녀공학', achievement: 87.5, admission: 55.9 },
      { rank: 5, name: '대청중학교', type: '공립', gender: '남녀공학', achievement: 86.2, admission: 52.8 },
      { rank: 6, name: '일원중학교', type: '공립', gender: '남녀공학', achievement: 85.3, admission: 49.5 },
      { rank: 7, name: '개포중학교', type: '공립', gender: '남녀공학', achievement: 84.6, admission: 46.3 },
      { rank: 8, name: '도곡중학교', type: '공립', gender: '남녀공학', achievement: 83.7, admission: 43.1 },
      { rank: 9, name: '세곡중학교', type: '공립', gender: '남녀공학', achievement: 82.0, admission: 40.8 },
      { rank: 10, name: '삼성중학교', type: '사립', gender: '남녀공학', achievement: 81.3, admission: 37.6 },
    ],
    '서울특별시 서초구': [
      { rank: 11, name: '서초중학교', type: '공립', gender: '남녀공학', achievement: 86.9, admission: 60.0 },
      { rank: 12, name: '반포중학교', type: '공립', gender: '남녀공학', achievement: 85.5, admission: 56.0 },
      { rank: 13, name: '방배중학교', type: '공립', gender: '남녀공학', achievement: 84.0, admission: 52.9 },
      { rank: 14, name: '양재중학교', type: '공립', gender: '남녀공학', achievement: 82.9, admission: 49.5 },
      { rank: 15, name: '우면중학교', type: '공립', gender: '남녀공학', achievement: 81.6, admission: 46.9 },
    ],
    '서울특별시 송파구': [
      { rank: 16, name: '송파중학교', type: '공립', gender: '남녀공학', achievement: 85.0, admission: 54.0 },
      { rank: 17, name: '삼전중학교', type: '공립', gender: '남녀공학', achievement: 83.9, admission: 51.6 },
      { rank: 18, name: '가동중학교', type: '공립', gender: '남녀공학', achievement: 82.7, admission: 48.4 },
      { rank: 19, name: '문정중학교', type: '공립', gender: '남녀공학', achievement: 81.6, admission: 45.1 },
      { rank: 20, name: '잠실중학교', type: '공립', gender: '남녀공학', achievement: 80.3, admission: 42.8 },
    ],
    '경기도 성남시': [
      { rank: 21, name: '분당중학교', type: '공립', gender: '남녀공학', achievement: 84.3, admission: 57.1 },
      { rank: 22, name: '수내중학교', type: '공립', gender: '남녀공학', achievement: 83.2, admission: 53.9 },
      { rank: 23, name: '야탑중학교', type: '공립', gender: '남녀공학', achievement: 82.0, admission: 50.6 },
      { rank: 24, name: '이매중학교', type: '공립', gender: '남녀공학', achievement: 80.9, admission: 47.4 },
      { rank: 25, name: '태원중학교', type: '공립', gender: '남녀공학', achievement: 79.6, admission: 45.0 },
    ],
    '경기도 수원시': [
      { rank: 26, name: '수원중학교', type: '공립', gender: '남녀공학', achievement: 83.4, admission: 55.2 },
      { rank: 27, name: '장안중학교', type: '공립', gender: '남녀공학', achievement: 82.2, admission: 52.1 },
      { rank: 28, name: '권선중학교', type: '공립', gender: '남녀공학', achievement: 81.1, admission: 48.9 },
      { rank: 29, name: '팔달중학교', type: '공립', gender: '남녀공학', achievement: 80.0, admission: 45.7 },
      { rank: 30, name: '영통중학교', type: '공립', gender: '남녀공학', achievement: 78.6, admission: 42.4 },
    ],
    '부산광역시 해운대구': [
      { rank: 31, name: '해운대중학교', type: '공립', gender: '남녀공학', achievement: 82.0, admission: 50.3 },
      { rank: 32, name: '반송중학교', type: '공립', gender: '남녀공학', achievement: 80.7, admission: 46.9 },
      { rank: 33, name: '좌천중학교', type: '공립', gender: '남녀공학', achievement: 79.4, admission: 43.6 },
    ],
    '대구광역시 수성구': [
      { rank: 34, name: '수성중학교', type: '공립', gender: '남녀공학', achievement: 82.8, admission: 52.7 },
      { rank: 35, name: '범어중학교', type: '공립', gender: '남녀공학', achievement: 81.5, admission: 49.4 },
      { rank: 36, name: '지산중학교', type: '공립', gender: '남녀공학', achievement: 80.2, admission: 46.1 },
    ],
    '인천광역시 남동구': [
      { rank: 37, name: '남동중학교', type: '공립', gender: '남녀공학', achievement: 81.3, admission: 48.2 },
      { rank: 38, name: '구월중학교', type: '공립', gender: '남녀공학', achievement: 80.0, admission: 44.9 },
      { rank: 39, name: '만수중학교', type: '공립', gender: '남녀공학', achievement: 78.7, admission: 41.6 },
    ],
    '광주광역시 북구': [
      { rank: 40, name: '북중학교', type: '공립', gender: '남녀공학', achievement: 80.4, admission: 46.5 },
      { rank: 41, name: '운암중학교', type: '공립', gender: '남녀공학', achievement: 79.1, admission: 43.2 },
    ],
    '대전광역시 유성구': [
      { rank: 42, name: '유성중학교', type: '공립', gender: '남녀공학', achievement: 81.7, admission: 49.8 },
      { rank: 43, name: '둔산중학교', type: '공립', gender: '남녀공학', achievement: 80.4, admission: 46.5 },
      { rank: 44, name: '탄방중학교', type: '공립', gender: '남녀공학', achievement: 79.1, admission: 43.2 },
    ],
  }
};

// 통합된 학교 데이터 생성
// 기존 순위 데이터가 있는 지역은 순위 데이터 사용
// 없는 지역은 schoolDataBase의 기본 학교 정보 사용
const schoolData = {};

['2025', '2024', '2023'].forEach(year => {
  schoolData[year] = {};

  // 기존 순위 데이터가 있는 지역은 순위 데이터 사용
  if (existingRankingData[year]) {
    Object.entries(existingRankingData[year]).forEach(([region, schools]) => {
      schoolData[year][region] = schools.map(s => ({ ...s, hasRanking: true }));
    });
  }

  // schoolDataBase의 모든 지역 데이터 추가
  if (schoolDataBase[year]) {
    Object.entries(schoolDataBase[year]).forEach(([region, schools]) => {
      // 기존 순위 데이터가 없는 지역만 추가
      if (!schoolData[year][region]) {
        schoolData[year][region] = schools;
      }
    });
  }
});

export const getSchoolsByRegion = (region, year) => {
  return schoolData[year]?.[region] || [];
};

export const getAllRegions = () => {
  const allRegions = new Set();
  Object.values(schoolData).forEach(yearData => {
    Object.keys(yearData).forEach(region => {
      allRegions.add(region);
    });
  });
  return Array.from(allRegions);
};

/**
 * 학교 이름으로 검색
 * @param {string} query - 검색어 (최소 2글자)
 * @param {string} year - 연도 (기본값: '2025')
 * @returns {Array} 검색 결과 학교 배열 [{ school, region }, ...]
 */
export const searchSchoolsByName = (query, year = '2025') => {
  if (!query || query.length < 2) {
    return [];
  }

  const results = [];
  const searchLower = query.toLowerCase();

  // 해당 연도의 모든 지역 순회
  if (schoolData[year]) {
    Object.entries(schoolData[year]).forEach(([region, schools]) => {
      schools.forEach(school => {
        const schoolNameLower = school.name?.toLowerCase() || '';
        if (schoolNameLower.includes(searchLower)) {
          results.push({
            ...school,
            region, // 검색 결과에 지역 정보 포함
          });
        }
      });
    });
  }

  // 순위 기준 정렬 (순위 있는 것 우선)
  results.sort((a, b) => {
    if (a.hasRanking && !b.hasRanking) return -1;
    if (!a.hasRanking && b.hasRanking) return 1;
    if (a.hasRanking && b.hasRanking) return a.rank - b.rank;
    return 0;
  });

  return results;
};

export default schoolData;
