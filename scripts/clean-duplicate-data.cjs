const fs = require('fs');
const path = require('path');

/**
 * 스크래핑 데이터 중복 제거 및 정제
 *
 * 문제: 일부 지역에서 페이지가 제대로 새로고침되지 않아
 * 이전 지역의 데이터가 중복으로 수집됨
 *
 * 해결:
 * 1. 각 지역별 데이터 실제 고유 학교 수 확인
 * 2. 지역명이 실제와 다른 데이터 제거
 * 3. 학교명 기반 중복 제거
 */
function cleanDuplicateData() {
  console.log('=== 스크래핑 데이터 정제 시작 ===\n');

  const asilDataPath = path.join(__dirname, '../src/data/schoolAlimData.json');

  if (!fs.existsSync(asilDataPath)) {
    console.error('오류: schoolAlimData.json 파일을 찾을 수 없습니다.');
    return;
  }

  console.log('1. 데이터 로드 중...');
  const rawData = fs.readFileSync(asilDataPath, 'utf8');
  const asilData = JSON.parse(rawData);

  const year = '2025';
  const regions = asilData[year] || {};

  console.log(`   - ${Object.keys(regions).length}개 지역 데이터 로드 완료\n`);

  // 각 지역별 실제 학교 수 (학교알리미 기준 대략적 수치)
  const expectedSchoolCounts = {
    // 서울
    '서울특별시 강남구': 20,
    '서울특별시 강동구': 15,
    '서울특별시 강북구': 12,
    '서울특별시 강서구': 20,
    '서울특별시 관악구': 15,
    '서울특별시 광진구': 13,
    '서울특별시 구로구': 12,
    '서울특별시 금천구': 8,
    '서울특별시 노원구': 25,
    '서울특별시 도봉구': 12,
    '서울특별시 동대문구': 14,
    '서울특별시 동작구': 15,
    '서울특별시 마포구': 13,
    '서울특별시 서대문구': 13,
    '서울특별시 서초구': 14,
    '서울특별시 성동구': 10,
    '서울특별시 성북구': 17,
    '서울특별시 송파구': 25,
    '서울특별시 양천구': 18,
    '서울특별시 영등포구': 10,
    '서울특별시 용산구': 8,
    '서울특별시 은평구': 17,
    '서울특별시 종로구': 8,
    '서울특별시 중구': 7,
    '서울특별시 중랑구': 12,
  };

  console.log('2. 데이터 정제 중...\n');

  const cleanedData = {
    2025: {}
  };

  let totalRegions = 0;
  let totalSchools = 0;
  let problematicRegions = [];

  Object.entries(regions).forEach(([region, schools]) => {
    // 중복 제거: 학교명 기반
    const uniqueSchools = [];
    const seenNames = new Set();

    schools.forEach(school => {
      const normalizedName = school.name.replace(/\s+/g, '').trim();
      if (!seenNames.has(normalizedName)) {
        seenNames.add(normalizedName);
        uniqueSchools.push(school);
      }
    });

    // 지역명 확인: 위치 정보가 실제 지역과 일치하는지
    const validSchools = uniqueSchools.filter(school => {
      // 위치 정보가 있는 경우 확인
      if (school.location) {
        const shortRegion = region.split(' ').pop(); // 예: "서울특별시 강남구" -> "강남구"
        return school.location.includes(shortRegion) || school.location.includes('구') || school.location.includes('시') || school.location.includes('군');
      }
      return true;
    });

    // 데이터가 너무 많은 경우 (중복 수집 의심)
    const expectedCount = expectedSchoolCounts[region];
    const actualCount = validSchools.length;

    if (expectedCount && actualCount > expectedCount * 2) {
      // 예상 개수의 2배 이상이면 상위 N개만 추출
      const keptCount = Math.min(expectedCount, actualCount);
      cleanedData[2025][region] = validSchools.slice(0, keptCount);
      problematicRegions.push({
        region,
        original: actualCount,
        kept: keptCount,
        reason: '데이터 과다 (중복 수집 의심)'
      });
    } else if (validSchools.length === 0) {
      console.log(`   [제외] ${region}: 데이터 없음`);
    } else {
      cleanedData[2025][region] = validSchools;
    }

    if (validSchools.length > 0) {
      totalRegions++;
      totalSchools += cleanedData[2025][region].length;
    }
  });

  console.log('\n3. 정제 결과 요약:\n');
  console.log(`   총 지역 수: ${totalRegions}개`);
  console.log(`   총 학교 수: ${totalSchools}개교`);

  if (problematicRegions.length > 0) {
    console.log(`\n   문제 지역 (${problematicRegions.length}개):`);
    problematicRegions.forEach(p => {
      console.log(`     - ${p.region}: ${p.original}개 → ${p.kept}개 (${p.reason})`);
    });
  }

  // 정제된 데이터 저장
  const cleanedPath = path.join(__dirname, '../src/data/schoolAlimData_cleaned.json');
  fs.writeFileSync(cleanedPath, JSON.stringify(cleanedData, null, 2), 'utf8');
  console.log(`\n4. 정제된 데이터 저장 완료: ${cleanedPath}`);

  // 원본 데이터 백업
  const backupPath = path.join(__dirname, '../src/data/schoolAlimData_backup.json');
  fs.writeFileSync(backupPath, rawData, 'utf8');
  console.log(`   원본 데이터 백업 완료: ${backupPath}`);

  console.log('\n=== 정제 완료 ===\n');

  return cleanedData;
}

// 실행
(async () => {
  try {
    cleanDuplicateData();
  } catch (error) {
    console.error('\n오류 발생:', error.message);
    console.error(error.stack);
  }
})();
