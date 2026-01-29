import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    schoolLevel: '',
    grade: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const schoolLevels = ['초등', '중등', '고등'];

  const gradeOptions = {
    '초등': ['1학년', '2학년', '3학년', '4학년', '5학년', '6학년'],
    '중등': ['1학년', '2학년', '3학년'],
    '고등': ['1학년', '2학년', '3학년']
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'schoolLevel' ? { grade: '' } : {})
    }));
    setError('');
  };

  const isFormValid = () => {
    return formData.email &&
           formData.password &&
           formData.schoolLevel &&
           formData.grade &&
           validateEmail(formData.email) &&
           formData.password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isFormValid()) {
      setError('모든 필수 항목을 올바르게 입력해주세요.');
      return;
    }

    setLoading(true);
    const result = await register(
      formData.email,
      formData.password,
      formData.schoolLevel,
      formData.grade
    );
    setLoading(false);

    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>회원가입</h1>
          <p>서비스 이용을 위한 회원가입</p>
        </div>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="email">이메일 *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              required
            />
            {formData.email && !validateEmail(formData.email) && (
              <span className="validation-error">올바른 이메일 형식을 입력해주세요.</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호 *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="최소 6자 이상"
              required
            />
            {formData.password && formData.password.length < 6 && (
              <span className="validation-error">비밀번호는 최소 6자 이상이어야 합니다.</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="schoolLevel">학교급 *</label>
            <select
              id="schoolLevel"
              name="schoolLevel"
              value={formData.schoolLevel}
              onChange={handleChange}
              required
            >
              <option value="">선택해주세요</option>
              {schoolLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="grade">학년 *</label>
            <select
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              disabled={!formData.schoolLevel}
              required
            >
              <option value="">선택해주세요</option>
              {formData.schoolLevel && gradeOptions[formData.schoolLevel].map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="register-button"
            disabled={!isFormValid() || loading}
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>
        <div className="register-footer">
          <p>이미 계정이 있으신가요? <Link to="/login">로그인</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
