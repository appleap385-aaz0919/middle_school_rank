const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// 시도 코드
const SIDO_CODES = {
  '서울': '11',
};

/**
 * 테이블 데이터 파싱
 */
function parseTableData(page) {
  return page.evaluate(() => {
    const schools = [];
    const tables = document.querySelectorAll('table');

    // 가장 많은 행을 가진 테이블 선택 (데이터 테이블)
    let dataTable = null;
    let maxRows = 0;

    for (const table of tables) {
      const rows = table.querySelectorAll('tr');
      if (rows.length > maxRows) {
        maxRows = rows.length;
        dataTable = table;
      }
    }

    if (!dataTable) {
      return schools;
    }

    const rows = dataTable.querySelectorAll('tr');

    rows.forEach((row, index) => {
      const cells = row.querySelectorAll('td');
      // 최소 11개 컬럼 필요
      if (cells.length >= 11) {
        const rankText = cells[0]?.textContent?.trim() || '';
        const location = cells[1]?.textContent?.trim() || '';
        const name = cells[2]?.textContent?.trim() || '';

        // 보통학력이상 평균은 5번째 컬럼 (인덱스 4)
        const achievementText = cells[4]?.textContent?.trim() || '';

        // 특목고 진학률은 9번째 컬럼 (인덱스 8)
        const admissionText = cells[8]?.textContent?.trim() || '';

        // 순위 파싱
        const rank = parseInt(rankText) || 0;

        // 성취도 파싱
        const achievementMatch = achievementText.match(/([\d.]+)%/);
        const achievement = achievementMatch ? parseFloat(achievementMatch[1]) : 0;

        // 진학률 파싱
        const admissionMatch = admissionText.match(/([\d.]+)%/);
        const admission = admissionMatch ? parseFloat(admissionMatch[1]) : 0;

        console.log(`Row ${index}: rank=${rankText}(${rank}), name=${name}, achievement=${achievementText}(${achievement}), admission=${admissionText}(${admission})`);

        // 유효한 데이터만 추가
        if (name && rank > 0 && achievement > 0) {
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

    return schools;
  });
}

/**
 * 단일 지역 테스트 스크래핑
 */
async function testSingleRegion() {
  console.log('서울 강남구 테스트 스크래핑 시작...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  });
  const page = await context.newPage();

  const regionKey = '서울특별시 강남구';
  const sidoCode = '11';
  const gunguCode = '11680';

  try {
    console.log(`${regionKey} (${sidoCode}, ${gunguCode}) 처리 중...`);

    // 페이지 이동
    await page.goto('https://asil.kr/asil/sub/school_list.jsp', {
      waitUntil: 'networkidle',
      timeout: 60000,
    });

    // 대기: 페이지 로딩
    await page.waitForTimeout(5000);

    // select 요소 확인
    const selects = await page.$$('select');
    console.log(`발견된 select 요소: ${selects.length}개`);

    if (selects.length >= 3) {
      // 시도 선택 (0번째 select)
      console.log('시도 선택 중...');
      await page.evaluate((code) => {
        const selects = document.querySelectorAll('select');
        if (selects.length >= 1) {
          selects[0].value = code;
          selects[0].dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, sidoCode);
      await page.waitForTimeout(3000);

      // 시군구 선택 (1번째 select)
      console.log('시군구 선택 중...');
      await page.evaluate((code) => {
        const selects = document.querySelectorAll('select');
        if (selects.length >= 2) {
          selects[1].value = code;
          selects[1].dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, gunguCode);
      await page.waitForTimeout(3000);

      // 중학교 선택 (2번째 select)
      console.log('중학교 선택 중...');
      await page.evaluate(() => {
        const selects = document.querySelectorAll('select');
        if (selects.length >= 3) {
          selects[2].value = '3';
          selects[2].dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
      await page.waitForTimeout(5000);

      // 테이블 데이터 파싱
      console.log('\n테이블 파싱 시작...');
      const schools = await parseTableData(page);

      console.log(`\n파싱 결과: ${schools.length}개교`);
      if (schools.length > 0) {
        console.log('\n상위 5개교:');
        schools.slice(0, 5).forEach(s => {
          console.log(`  ${s.rank}위: ${s.name} (성취도: ${s.achievement}%, 진학률: ${s.admission}%)`);
        });

        // 결과 저장
        const results = {
          2025: {
            [regionKey]: schools
          }
        };
        const outputPath = path.join(__dirname, '../src/data/test-gangnam.json');
        fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf8');
        console.log(`\n데이터 저장 완료: ${outputPath}`);
      } else {
        console.log('데이터를 찾을 수 없습니다.');
      }
    } else {
      console.log('select 요소를 찾을 수 없습니다.');
    }

  } catch (error) {
    console.error(`오류: ${error.message}`);
  }

  console.log('\n10초 후 브라우저 닫기...');
  await page.waitForTimeout(10000);
  await browser.close();
  console.log('테스트 완료!');
}

// 실행
(async () => {
  await testSingleRegion();
})();
