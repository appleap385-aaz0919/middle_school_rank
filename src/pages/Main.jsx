import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProvinces, getDistricts, getAllDistricts } from '../data/regionData';
import { getSchoolsByRegion } from '../data/schoolData';
import './Main.css';

const Main = () => {
  const { currentUser, logout, getUserInfo } = useAuth();
  const navigate = useNavigate();

  const [searchMode, setSearchMode] = useState('step'); // 'step' or 'search'
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [schools, setSchools] = useState([]);

  const years = ['2025', '2024', '2023'];

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login');
    }
  };

  const handleSearch = () => {
    if (searchMode === 'step') {
      if (!selectedProvince || !selectedDistrict) {
        alert('시/도와 지역구를 모두 선택해주세요.');
        return;
      }
      const region = `${selectedProvince} ${selectedDistrict}`;
      const schoolList = getSchoolsByRegion(region, selectedYear);
      setSchools(schoolList);
      setShowResults(true);
    } else {
      if (searchQuery.length < 2) {
        alert('최소 2글자 이상 입력해주세요.');
        return;
      }
      const allDistricts = getAllDistricts();
      const filteredDistricts = allDistricts.filter(district =>
        district.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (filteredDistricts.length === 0) {
        alert('검색 결과가 없습니다.');
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setSearchResults(filteredDistricts);
      setShowResults(true);
    }
  };

  const handleSelectDistrict = (district) => {
    const schoolList = getSchoolsByRegion(district, selectedYear);
    setSchools(schoolList);
    setSearchResults([]);
  };

  const handleReset = () => {
    setSelectedProvince('');
    setSelectedDistrict('');
    setSearchQuery('');
    setSearchResults([]);
    setSchools([]);
    setShowResults(false);
  };

  const userInfo = getUserInfo();

  return (
    <div className="main-container">
      <header className="main-header">
        <div className="header-content">
          <h1>지역별 중학교 순위 서비스</h1>
          <div className="user-info">
            <span>{userInfo?.schoolLevel} {userInfo?.grade}</span>
            <button onClick={handleLogout} className="logout-button">로그아웃</button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="year-selector">
          <label htmlFor="year">연도 선택:</label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="year-select"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}년</option>
            ))}
          </select>
        </div>

        <div className="search-section">
          <div className="search-mode-toggle">
            <button
              className={`mode-button ${searchMode === 'step' ? 'active' : ''}`}
              onClick={() => {
                setSearchMode('step');
                handleReset();
              }}
            >
              단계별 선택
            </button>
            <button
              className={`mode-button ${searchMode === 'search' ? 'active' : ''}`}
              onClick={() => {
                setSearchMode('search');
                handleReset();
              }}
            >
              직접 검색
            </button>
          </div>

          {searchMode === 'step' ? (
            <div className="step-search">
              <div className="form-group">
                <label htmlFor="province">시/도 선택</label>
                <select
                  id="province"
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    setSelectedDistrict('');
                  }}
                  className="province-select"
                >
                  <option value="">선택해주세요</option>
                  {getProvinces().map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="district">지역구 선택</label>
                <select
                  id="district"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={!selectedProvince}
                  className="district-select"
                >
                  <option value="">선택해주세요</option>
                  {selectedProvince && getDistricts(selectedProvince).map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSearch}
                className="search-button"
                disabled={!selectedProvince || !selectedDistrict}
              >
                검색
              </button>
            </div>
          ) : (
            <div className="direct-search">
              <div className="form-group">
                <label htmlFor="search">지역구 검색</label>
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="예: 강남구, 서초구, 성남시..."
                  className="search-input"
                />
              </div>

              <button
                onClick={handleSearch}
                className="search-button"
                disabled={searchQuery.length < 2}
              >
                검색
              </button>
            </div>
          )}
        </div>

        {showResults && searchResults.length > 0 && (
          <div className="search-results">
            <h3>검색 결과</h3>
            <ul>
              {searchResults.map((result, index) => (
                <li key={index} onClick={() => handleSelectDistrict(result)}>
                  {result}
                </li>
              ))}
            </ul>
          </div>
        )}

        {showResults && schools.length > 0 && (
          <div className="results-section">
            <div className="results-header">
              <h2>학교 순위</h2>
              <p className="query-time">조회 시점: {new Date().toLocaleString('ko-KR')}</p>
            </div>

            <div className="table-container">
              <table className="school-table">
                <thead>
                  <tr>
                    <th>순위</th>
                    <th>학교 이름</th>
                    <th>설립 구분</th>
                    <th>남녀 공학</th>
                    <th>학업성취도 평균</th>
                    <th>특목고/자사고 진학률</th>
                  </tr>
                </thead>
                <tbody>
                  {schools.map((school, index) => (
                    <tr key={index} className={index < 3 ? `rank-${index + 1}` : ''}>
                      <td className="rank-cell">
                        {index === 0 && <span className="rank-badge gold">1</span>}
                        {index === 1 && <span className="rank-badge silver">2</span>}
                        {index === 2 && <span className="rank-badge bronze">3</span>}
                        {index > 2 && <span className="rank-number">{school.rank}</span>}
                      </td>
                      <td className="school-name">{school.name}</td>
                      <td>{school.type}</td>
                      <td>{school.gender}</td>
                      <td className="achievement-cell">{school.achievement}%</td>
                      <td className="admission-cell">{school.admission}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showResults && schools.length === 0 && (
          <div className="no-results">
            <p>해당 지역의 학교 데이터가 없습니다.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Main;
