const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

/**
 * 학교알리미 사이트 스크래핑 (Playwright 사용)
 * 동적 웹사이트이므로 실제 브라우저를 사용하여 데이터 추출
 */

// 지역별 매핑
const REGION_MAPPING = {
  '서울특별시 강남구': { sido: '서울', gungu: '강남구' },
  '서울특별시 강동구': { sido: '서울', gungu: '강동구' },
  '서울특별시 강북구': { sido: '서울', gungu: '강북구' },
  '서울특별시 강서구': { sido: '서울', gungu: '강서구' },
  '서울특별시 관악구': { sido: '서울', gungu: '관악구' },
  '서울특별시 광진구': { sido: '서울', gungu: '광진구' },
  '서울특별시 구로구': { sido: '서울', gungu: '구로구' },
  '서울특별시 금천구': { sido: '서울', gungu: '금천구' },
  '서울특별시 노원구': { sido: '서울', gungu: '노원구' },
  '서울특별시 도봉구': { sido: '서울', gungu: '도봉구' },
  '서울특별시 동대문구': { sido: '서울', gungu: '동대문구' },
  '서울특별시 동작구': { sido: '서울', gungu: '동작구' },
  '서울특별시 마포구': { sido: '서울', gungu: '마포구' },
  '서울특별시 서대문구': { sido: '서울', gungu: '서대문구' },
  '서울특별시 서초구': { sido: '서울', gungu: '서초구' },
  '서울특별시 성동구': { sido: '서울', gungu: '성동구' },
  '서울특별시 성북구': { sido: '서울', gungu: '성북구' },
  '서울특별시 송파구': { sido: '서울', gungu: '송파구' },
  '서울특별시 양천구': { sido: '서울', gungu: '양천구' },
  '서울특별시 영등포구': { sido: '서울', gungu: '영등포구' },
  '서울특별시 용산구': { sido: '서울', gungu: '용산구' },
  '서울특별시 은평구': { sido: '서울', gungu: '은평구' },
  '서울특별시 종로구': { sido: '서울', gungu: '종로구' },
  '서울특별시 중구': { sido: '서울', gungu: '중구' },
  '서울특별시 중랑구': { sido: '서울', gungu: '중랑구' },
  '부산광역시 강서구': { sido: '부산', gungu: '강서구' },
  '부산광역시 금정구': { sido: '부산', gungu: '금정구' },
  '부산광역시 남구': { sido: '부산', gungu: '남구' },
  '부산광역시 동구': { sido: '부산', gungu: '동구' },
  '부산광역시 동래구': { sido: '부산', gungu: '동래구' },
  '부산광역시 부산진구': { sido: '부산', gungu: '부산진구' },
  '부산광역시 북구': { sido: '부산', gungu: '북구' },
  '부산광역시 사상구': { sido: '부산', gungu: '사상구' },
  '부산광역시 사하구': { sido: '부산', gungu: '사하구' },
  '부산광역시 서구': { sido: '부산', gungu: '서구' },
  '부산광역시 수영구': { sido: '부산', gungu: '수영구' },
  '부산광역시 연제구': { sido: '부산', gungu: '연제구' },
  '부산광역시 영도구': { sido: '부산', gungu: '영도구' },
  '부산광역시 중구': { sido: '부산', gungu: '중구' },
  '부산광역시 해운대구': { sido: '부산', gungu: '해운대구' },
  '대구광역시 남구': { sido: '대구', gungu: '남구' },
  '대구광역시 달서구': { sido: '대구', gungu: '달서구' },
  '대구광역시 동구': { sido: '대구', gungu: '동구' },
  '대구광역시 북구': { sido: '대구', gungu: '북구' },
  '대구광역시 서구': { sido: '대구', gungu: '서구' },
  '대구광역시 수성구': { sido: '대구', gungu: '수성구' },
  '대구광역시 중구': { sido: '대구', gungu: '중구' },
  '인천광역시 강화군': { sido: '인천', gungu: '강화군' },
  '인천광역시 계양구': { sido: '인천', gungu: '계양구' },
  '인천광역시 남동구': { sido: '인천', gungu: '남동구' },
  '인천광역시 동구': { sido: '인천', gungu: '동구' },
  '인천광역시 미추홀구': { sido: '인천', gungu: '미추홀구' },
  '인천광역시 부평구': { sido: '인천', gungu: '부평구' },
  '인천광역시 서구': { sido: '인천', gungu: '서구' },
  '인천광역시 연수구': { sido: '인천', gungu: '연수구' },
  '인천광역시 옹진군': { sido: '인천', gungu: '옹진군' },
  '인천광역시 중구': { sido: '인천', gungu: '중구' },
  '광주광역시 광산구': { sido: '광주', gungu: '광산구' },
  '광주광역시 남구': { sido: '광주', gungu: '남구' },
  '광주광역시 동구': { sido: '광주', gungu: '동구' },
  '광주광역시 북구': { sido: '광주', gungu: '북구' },
  '광주광역시 서구': { sido: '광주', gungu: '서구' },
  '대전광역시 대덕구': { sido: '대전', gungu: '대덕구' },
  '대전광역시 동구': { sido: '대전', gungu: '동구' },
  '대전광역시 서구': { sido: '대전', gungu: '서구' },
  '대전광역시 유성구': { sido: '대전', gungu: '유성구' },
  '대전광역시 중구': { sido: '대전', gungu: '중구' },
  '울산광역시 남구': { sido: '울산', gungu: '남구' },
  '울산광역시 동구': { sido: '울산', gungu: '동구' },
  '울산광역시 북구': { sido: '울산', gungu: '북구' },
  '울산광역시 울주군': { sido: '울산', gungu: '울주군' },
  '울산광역시 중구': { sido: '울산', gungu: '중구' },
  '세종특별자치시 세종특별자치시': { sido: '세종', gungu: '세종' },
  '경기도 가평군': { sido: '경기', gungu: '가평군' },
  '경기도 고양시': { sido: '경기', gungu: '고양시' },
  '경기도 과천시': { sido: '경기', gungu: '과천시' },
  '경기도 광명시': { sido: '경기', gungu: '광명시' },
  '경기도 광주시': { sido: '경기', gungu: '광주시' },
  '경기도 구리시': { sido: '경기', gungu: '구리시' },
  '경기도 군포시': { sido: '경기', gungu: '군포시' },
  '경기도 김포시': { sido: '경기', gungu: '김포시' },
  '경기도 남양주시': { sido: '경기', gungu: '남양주시' },
  '경기도 동두천시': { sido: '경기', gungu: '동두천시' },
  '경기도 부천시': { sido: '경기', gungu: '부천시' },
  '경기도 성남시': { sido: '경기', gungu: '성남시' },
  '경기도 수원시': { sido: '경기', gungu: '수원시' },
  '경기도 시흥시': { sido: '경기', gungu: '시흥시' },
  '경기도 안산시': { sido: '경기', gungu: '안산시' },
  '경기도 안성시': { sido: '경기', gungu: '안성시' },
  '경기도 안양시': { sido: '경기', gungu: '안양시' },
  '경기도 양주시': { sido: '경기', gungu: '양주시' },
  '경기도 양평군': { sido: '경기', gungu: '양평군' },
  '경기도 여주시': { sido: '경기', gungu: '여주시' },
  '경기도 연천군': { sido: '경기', gungu: '연천군' },
  '경기도 오산시': { sido: '경기', gungu: '오산시' },
  '경기도 용인시': { sido: '경기', gungu: '용인시' },
  '경기도 의왕시': { sido: '경기', gungu: '의왕시' },
  '경기도 의정부시': { sido: '경기', gungu: '의정부시' },
  '경기도 이천시': { sido: '경기', gungu: '이천시' },
  '경기도 파주시': { sido: '경기', gungu: '파주시' },
  '경기도 평택시': { sido: '경기', gungu: '평택시' },
  '경기도 포천시': { sido: '경기', gungu: '포천시' },
  '경기도 하남시': { sido: '경기', gungu: '하남시' },
  '경기도 화성시': { sido: '경기', gungu: '화성시' },
  '강원도 강릉시': { sido: '강원', gungu: '강릉시' },
  '강원도 고성군': { sido: '강원', gungu: '고성군' },
  '강원도 동해시': { sido: '강원', gungu: '동해시' },
  '강원도 삼척시': { sido: '강원', gungu: '삼척시' },
  '강원도 속초시': { sido: '강원', gungu: '속초시' },
  '강원도 양구군': { sido: '강원', gungu: '양구군' },
  '강원도 양양군': { sido: '강원', gungu: '양양군' },
  '강원도 영월군': { sido: '강원', gungu: '영월군' },
  '강원도 원주시': { sido: '강원', gungu: '원주시' },
  '강원도 인제군': { sido: '강원', gungu: '인제군' },
  '강원도 정선군': { sido: '강원', gungu: '정선군' },
  '강원도 철원군': { sido: '강원', gungu: '철원군' },
  '강원도 춘천시': { sido: '강원', gungu: '춘천시' },
  '강원도 태백시': { sido: '강원', gungu: '태백시' },
  '강원도 평창군': { sido: '강원', gungu: '평창군' },
  '강원도 홍천군': { sido: '강원', gungu: '홍천군' },
  '강원도 화천군': { sido: '강원', gungu: '화천군' },
  '강원도 횡성군': { sido: '강원', gungu: '횡성군' },
  '충청북도 괴산군': { sido: '충북', gungu: '괴산군' },
  '충청북도 단양군': { sido: '충북', gungu: '단양군' },
  '충청북도 보은군': { sido: '충북', gungu: '보은군' },
  '충청북도 영동군': { sido: '충북', gungu: '영동군' },
  '충청북도 옥천군': { sido: '충북', gungu: '옥천군' },
  '충청북도 음성군': { sido: '충북', gungu: '음성군' },
  '충청북도 제천시': { sido: '충북', gungu: '제천시' },
  '충청북도 증평군': { sido: '충북', gungu: '증평군' },
  '충청북도 진천군': { sido: '충북', gungu: '진천군' },
  '충청북도 청주시': { sido: '충북', gungu: '청주시' },
  '충청북도 충주시': { sido: '충북', gungu: '충주시' },
  '충청남도 계룡시': { sido: '충남', gungu: '계룡시' },
  '충청남도 공주시': { sido: '충남', gungu: '공주시' },
  '충청남도 금산군': { sido: '충남', gungu: '금산군' },
  '충청남도 논산시': { sido: '충남', gungu: '논산시' },
  '충청남도 당진시': { sido: '충남', gungu: '당진시' },
  '충청남도 보령시': { sido: '충남', gungu: '보령시' },
  '충청남도 부여군': { sido: '충남', gungu: '부여군' },
  '충청남도 서산시': { sido: '충남', gungu: '서산시' },
  '충청남도 서천군': { sido: '충남', gungu: '서천군' },
  '충청남도 아산시': { sido: '충남', gungu: '아산시' },
  '충청남도 예산군': { sido: '충남', gungu: '예산군' },
  '충청남도 천안시': { sido: '충남', gungu: '천안시' },
  '충청남도 청양군': { sido: '충남', gungu: '청양군' },
  '충청남도 태안군': { sido: '충남', gungu: '태안군' },
  '충청남도 홍성군': { sido: '충남', gungu: '홍성군' },
  '전라북도 고창군': { sido: '전북', gungu: '고창군' },
  '전라북도 군산시': { sido: '전북', gungu: '군산시' },
  '전라북도 김제시': { sido: '전북', gungu: '김제시' },
  '전라북도 남원시': { sido: '전북', gungu: '남원시' },
  '전라북도 무주군': { sido: '전북', gungu: '무주군' },
  '전라북도 부안군': { sido: '전북', gungu: '부안군' },
  '전라북도 순창군': { sido: '전북', gungu: '순창군' },
  '전라북도 완주군': { sido: '전북', gungu: '완주군' },
  '전라북도 익산시': { sido: '전북', gungu: '익산시' },
  '전라북도 임실군': { sido: '전북', gungu: '임실군' },
  '전라북도 장수군': { sido: '전북', gungu: '장수군' },
  '전라북도 전주시': { sido: '전북', gungu: '전주시' },
  '전라북도 정읍시': { sido: '전북', gungu: '정읍시' },
  '전라북도 진안군': { sido: '전북', gungu: '진안군' },
  '전라남도 강진군': { sido: '전남', gungu: '강진군' },
  '전라남도 고흥군': { sido: '전남', gungu: '고흥군' },
  '전라남도 곡성군': { sido: '전남', gungu: '곡성군' },
  '전라남도 광양시': { sido: '전남', gungu: '광양시' },
  '전라남도 구례군': { sido: '전남', gungu: '구례군' },
  '전라남도 나주시': { sido: '전남', gungu: '나주시' },
  '전라남도 담양군': { sido: '전남', gungu: '담양군' },
  '전라남도 목포시': { sido: '전남', gungu: '목포시' },
  '전라남도 무안군': { sido: '전남', gungu: '무안군' },
  '전라남도 보성군': { sido: '전남', gungu: '보성군' },
  '전라남도 순천시': { sido: '전남', gungu: '순천시' },
  '전라남도 신안군': { sido: '전남', gungu: '신안군' },
  '전라남도 여수시': { sido: '전남', gungu: '여수시' },
  '전라남도 영광군': { sido: '전남', gungu: '영광군' },
  '전라남도 영암군': { sido: '전남', gungu: '영암군' },
  '전라남도 완도군': { sido: '전남', gungu: '완도군' },
  '전라남도 장성군': { sido: '전남', gungu: '장성군' },
  '전라남도 장흥군': { sido: '전남', gungu: '장흥군' },
  '전라남도 진도군': { sido: '전남', gungu: '진도군' },
  '전라남도 함평군': { sido: '전남', gungu: '함평군' },
  '전라남도 해남군': { sido: '전남', gungu: '해남군' },
  '전라남도 화순군': { sido: '전남', gungu: '화순군' },
  '경상북도 경산시': { sido: '경북', gungu: '경산시' },
  '경상북도 경주시': { sido: '경북', gungu: '경주시' },
  '경상북도 고령군': { sido: '경북', gungu: '고령군' },
  '경상북도 구미시': { sido: '경북', gungu: '구미시' },
  '경상북도 군위군': { sido: '경북', gungu: '군위군' },
  '경상북도 김천시': { sido: '경북', gungu: '김천시' },
  '경상북도 문경시': { sido: '경북', gungu: '문경시' },
  '경상북도 봉화군': { sido: '경북', gungu: '봉화군' },
  '경상북도 상주시': { sido: '경북', gungu: '상주시' },
  '경상북도 성주군': { sido: '경북', gungu: '성주군' },
  '경상북도 안동시': { sido: '경북', gungu: '안동시' },
  '경상북도 영덕군': { sido: '경북', gungu: '영덕군' },
  '경상북도 영양군': { sido: '경북', gungu: '영양군' },
  '경상북도 영주시': { sido: '경북', gungu: '영주시' },
  '경상북도 영천시': { sido: '경북', gungu: '영천시' },
  '경상북도 예천군': { sido: '경북', gungu: '예천군' },
  '경상북도 울릉군': { sido: '경북', gungu: '울릉군' },
  '경상북도 울진군': { sido: '경북', gungu: '울진군' },
  '경상북도 의성군': { sido: '경북', gungu: '의성군' },
  '경상북도 청도군': { sido: '경북', gungu: '청도군' },
  '경상북도 청송군': { sido: '경북', gungu: '청송군' },
  '경상북도 칠곡군': { sido: '경북', gungu: '칠곡군' },
  '경상북도 포항시': { sido: '경북', gungu: '포항시' },
  '경상남도 거제시': { sido: '경남', gungu: '거제시' },
  '경상남도 거창군': { sido: '경남', gungu: '거창군' },
  '경상남도 고성군': { sido: '경남', gungu: '고성군' },
  '경상남도 김해시': { sido: '경남', gungu: '김해시' },
  '경상남도 남해군': { sido: '경남', gungu: '남해군' },
  '경상남도 밀양시': { sido: '경남', gungu: '밀양시' },
  '경상남도 사천시': { sido: '경남', gungu: '사천시' },
  '경상남도 산청군': { sido: '경남', gungu: '산청군' },
  '경상남도 양산시': { sido: '경남', gungu: '양산시' },
  '경상남도 의령군': { sido: '경남', gungu: '의령군' },
  '경상남도 진주시': { sido: '경남', gungu: '진주시' },
  '경상남도 창녕군': { sido: '경남', gungu: '창녕군' },
  '경상남도 창원시': { sido: '경남', gungu: '창원시' },
  '경상남도 통영시': { sido: '경남', gungu: '통영시' },
  '경상남도 하동군': { sido: '경남', gungu: '하동군' },
  '경상남도 함안군': { sido: '경남', gungu: '함안군' },
  '경상남도 함양군': { sido: '경남', gungu: '함양군' },
  '경상남도 합천군': { sido: '경남', gungu: '합천군' },
  '제주특별자치도 서귀포시': { sido: '제주', gungu: '서귀포시' },
  '제주특별자치도 제주시': { sido: '제주', gungu: '제주시' },
};

/**
 * 테이블 데이터 파싱
 */
function parseTableData(page) {
  return page.evaluate(() => {
    const schools = [];
    const tables = document.querySelectorAll('table');

    tables.forEach(table => {
      const rows = table.querySelectorAll('tr');

      rows.forEach((row, index) => {
        if (index === 0) return; // 헤더 건너뛰기

        const cells = row.querySelectorAll('td');
        if (cells.length >= 5) {
          const rankText = cells[0]?.textContent?.trim() || '';
          const location = cells[1]?.textContent?.trim() || '';
          const name = cells[2]?.textContent?.trim() || '';
          const achievementText = cells[3]?.textContent?.trim() || '';
          const admissionText = cells[4]?.textContent?.trim() || '';

          // 순위 파싱
          const rank = parseInt(rankText) || 0;

          // 성취도 파싱 (평균 컬럼)
          const achievementMatch = achievementText.match(/([\d.]+)%/);
          const achievement = achievementMatch ? parseFloat(achievementMatch[1]) : 0;

          // 진학률 파싱
          const admissionMatch = admissionText.match(/([\d.]+)%/);
          const admission = admissionMatch ? parseFloat(admissionMatch[1]) : 0;

          if (name && rank > 0) {
            schools.push({
              rank,
              name,
              type: '공립',
              gender: '남녀공학',
              achievement,
              admission,
              hasRanking: true,
            });
          }
        }
      });
    });

    return schools;
  });
}

/**
 * 전국 데이터 스크래핑
 */
async function scrapeAllRegions() {
  console.log('학교알리미 전국 데이터 스크래핑 시작...\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  });
  const page = await context.newPage();

  const results = {
    2025: {},
  };

  let successCount = 0;
  let failCount = 0;
  let totalSchools = 0;
  const totalRegions = Object.keys(REGION_MAPPING).length;

  // 지역 목록을 배열로 변환
  const regions = Object.entries(REGION_MAPPING);

  for (let i = 0; i < regions.length; i++) {
    const [regionKey, mapping] = regions[i];

    try {
      console.log(`[${i + 1}/${totalRegions}] ${regionKey} 처리 중...`);

      // 페이지 이동
      await page.goto('https://asil.kr/asil/sub/school_list.jsp', {
        waitUntil: 'networkidle',
        timeout: 30000,
      });

      // 대기: 페이지 로딩
      await page.waitForTimeout(2000);

      // 지역 선택 (셀렉트 박스)
      try {
        // 시도 선택
        await page.selectOption('select[name="sido"]', mapping.sido);
        await page.waitForTimeout(1000);

        // 시군구 선택
        await page.selectOption('select[name="gungu"]', mapping.gungu);
        await page.waitForTimeout(1000);

        // 중학교 선택
        await page.selectOption('select[name="schoolType"]', '중학교');
        await page.waitForTimeout(1000);

        // 검색 버튼 클릭 또는 데이터 자동 로딩 대기
        await page.waitForTimeout(3000);

        // 테이블 데이터 파싱
        const schools = await parseTableData(page);

        if (schools.length > 0) {
          results['2025'][regionKey] = schools;
          successCount++;
          totalSchools += schools.length;
          console.log(`  완료: ${schools.length}개교\n`);
        } else {
          failCount++;
          console.log(`  데이터 없음\n`);
        }
      } catch (selectError) {
        failCount++;
        console.log(`  선택 실패: ${selectError.message}\n`);
      }

      // 요청 간 대기
      await page.waitForTimeout(1000);
    } catch (error) {
      failCount++;
      console.error(`  오류: ${error.message}\n`);
    }
  }

  await browser.close();

  console.log('\n' + '='.repeat(50));
  console.log('스크래핑 완료:');
  console.log(`성공: ${successCount}개 지역`);
  console.log(`실패: ${failCount}개 지역`);
  console.log(`총 학교 수: ${totalSchools}개교\n`);

  // 결과 저장
  const outputPath = path.join(__dirname, '../src/data/schoolAlimData.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`데이터 저장 완료: ${outputPath}\n`);

  return results;
}

// 메인 실행
(async () => {
  await scrapeAllRegions();
})();
