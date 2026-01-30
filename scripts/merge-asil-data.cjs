const fs = require('fs');
const path = require('path');

/**
 * 학교명 정규화
 * 공백 제거 및 일반적인 이름 변환
 */
function normalizeSchoolName(name) {
  return name
    .replace(/\s+/g, '')
    .replace('단국대학교사범대학부속중학교', '단국대사대부속중학교')
    .replace('대학교부속중학교', '대부속중학교')
    .replace('대학교부속', '대부속')
    .trim();
}

/**
 * 지역명 정규화
 */
function normalizeRegionName(region) {
  // 이미 올바른 형식인 경우 그대로 반환
  if (/^[서울부산대구인천광주대전울산세종경기강원충북충남전북전남경북경남제주]/.test(region)) {
    return region;
  }
  return region;
}

/**
 * 스크래핑한 데이터를 schoolDataBase.json에 병합
 */
function mergeAsilDataToSchoolDB() {
  console.log('=== asil.kr 데이터 병합 시작 ===\n');

  // 파일 경로
  const schoolDbPath = path.join(__dirname, '../src/data/schoolDataBase.json');
  const asilDataPath = path.join(__dirname, '../src/data/schoolAlimData.json');

  // 파일 존재 확인
  if (!fs.existsSync(asilDataPath)) {
    console.error(`오류: ${asilDataPath} 파일을 찾을 수 없습니다.`);
    console.error('먼저 scrapeAsilFinal.cjs를 실행하여 데이터를 수집해주세요.');
    return;
  }

  // 데이터 로드
  console.log('1. 파일 로드 중...');
  const schoolDB = JSON.parse(fs.readFileSync(schoolDbPath, 'utf8'));
  const asilData = JSON.parse(fs.readFileSync(asilDataPath, 'utf8'));

  console.log(`   - schoolDataBase.json: ${Object.keys(schoolDB).length}개 연도`);
  console.log(`   - schoolAlimData.json: ${Object.keys(asilData).length}개 연도`);

  // 2025년 데이터 초기화
  if (!schoolDB['2025']) {
    schoolDB['2025'] = {};
    console.log('\n2. 2025년 데이터 섹션 생성');
  } else {
    console.log('\n2. 기존 2025년 데이터 확인');
  }

  // 스크래핑한 데이터 병합
  console.log('\n3. 스크래핑 데이터 병합 중...');
  let mergedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  const year = '2025';
  const scrapedRegions = asilData[year] || {};

  Object.entries(scrapedRegions).forEach(([region, schools]) => {
    const normalizedRegion = normalizeRegionName(region);

    if (!schoolDB[year][normalizedRegion]) {
      // schoolDataBase에 해당 지역이 없는 경우 새로 추가
      schoolDB[year][normalizedRegion] = schools;
      mergedCount++;
      console.log(`   [추가] ${normalizedRegion}: ${schools.length}개교`);
    } else {
      // schoolDataBase에 해당 지역이 있는 경우 achievement, admission 값 업데이트
      const existingSchools = schoolDB[year][normalizedRegion];
      const schoolNameMap = new Map();

      // 기존 학교명 매핑 생성
      existingSchools.forEach(school => {
        const normalizedName = normalizeSchoolName(school.name);
        schoolNameMap.set(normalizedName, school);
      });

      // 스크래핑한 학교 데이터 병합
      schools.forEach(scrapedSchool => {
        const normalizedName = normalizeSchoolName(scrapedSchool.name);
        const existingSchool = schoolNameMap.get(normalizedName);

        if (existingSchool) {
          // 기존 학교가 있으면 순위 데이터 업데이트
          existingSchool.rank = scrapedSchool.rank;
          existingSchool.achievement = scrapedSchool.achievement;
          existingSchool.admission = scrapedSchool.admission;
          existingSchool.hasRanking = true;
        } else {
          // 기존 학교가 없으면 추가
          existingSchools.push(scrapedSchool);
        }
      });

      // 순위별 정렬
      existingSchools.sort((a, b) => {
        if (a.hasRanking && b.hasRanking) {
          return a.rank - b.rank;
        } else if (a.hasRanking) {
          return -1;
        } else if (b.hasRanking) {
          return 1;
        }
        return 0;
      });

      mergedCount++;
      console.log(`   [병합] ${normalizedRegion}: ${schools.length}개교 (기존: ${existingSchools.length}개교)`);
    }
  });

  // 순위 데이터가 없는 지역 확인
  console.log('\n4. 순위 데이터 없는 지역 확인...');
  const regionsWithoutRanking = [];
  Object.entries(schoolDB[year]).forEach(([region, schools]) => {
    const schoolsWithRanking = schools.filter(s => s.hasRanking);
    if (schoolsWithRanking.length === 0) {
      regionsWithoutRanking.push(region);
    }
  });

  if (regionsWithoutRanking.length > 0) {
    console.log(`   순위 데이터 없는 지역: ${regionsWithoutRanking.length}개`);
    regionsWithoutRanking.slice(0, 10).forEach(r => console.log(`     - ${r}`));
    if (regionsWithoutRanking.length > 10) {
      console.log(`     ... 외 ${regionsWithoutRanking.length - 10}개`);
    }
  } else {
    console.log('   모든 지역에 순위 데이터가 있습니다.');
  }

  // 결과 저장
  console.log('\n5. schoolDataBase.json 저장 중...');
  fs.writeFileSync(schoolDbPath, JSON.stringify(schoolDB, null, 2), 'utf8');
  console.log(`   저장 완료: ${schoolDbPath}`);

  // 요약
  console.log('\n' + '='.repeat(50));
  console.log('병합 완료:');
  console.log(`  - 병합/추가된 지역: ${mergedCount}개`);
  console.log(`  - 순위 데이터 없는 지역: ${regionsWithoutRanking.length}개`);
  console.log(`  - 총 지역 수: ${Object.keys(schoolDB[year]).length}개`);
  console.log('='.repeat(50));

  return schoolDB;
}

// 실행
(async () => {
  try {
    mergeAsilDataToSchoolDB();
  } catch (error) {
    console.error('\n오류 발생:', error.message);
    console.error(error.stack);
  }
})();
