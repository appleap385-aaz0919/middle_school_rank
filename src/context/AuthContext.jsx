import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // 사용자 정보 가져오기 함수
  const fetchUserInfo = async (user) => {
    if (!user) {
      setUserInfo(null);
      return null;
    }

    try {
      // Firestore에서 사용자 정보 가져오기
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (userDoc.exists()) {
        const info = userDoc.data();
        setUserInfo(info);
        return info;
      }

      // Firestore에 없으면 localStorage에서 가져오기 (기존 데이터 호환성)
      const localInfo = localStorage.getItem(`user_${user.uid}`);
      if (localInfo) {
        const info = JSON.parse(localInfo);
        setUserInfo(info);
        // localStorage에 있는데 Firestore에 없으면 Firestore로 복사
        await setDoc(doc(db, 'users', user.uid), info);
        return info;
      }

      setUserInfo(null);
      return null;
    } catch (error) {
      console.error('사용자 정보 가져오기 오류:', error);
      // 오류 발생 시 localStorage 시도
      const localInfo = localStorage.getItem(`user_${user.uid}`);
      if (localInfo) {
        const info = JSON.parse(localInfo);
        setUserInfo(info);
        return info;
      }
      setUserInfo(null);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        await fetchUserInfo(user);
      } else {
        setUserInfo(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      let errorMessage = '로그인에 실패했습니다.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        errorMessage = '등록되지 않은 계정이거나 비밀번호가 올바르지 않습니다.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = '이메일 형식이 올바르지 않습니다.';
      }
      return { success: false, error: errorMessage };
    }
  };

  const register = async (email, password, schoolLevel, grade) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // 사용자 정보 생성
      const info = {
        uid: userCredential.user.uid,
        email: email,
        schoolLevel: schoolLevel,
        grade: grade,
        createdAt: new Date().toISOString()
      };

      // Firestore에 사용자 정보 저장
      await setDoc(doc(db, 'users', userCredential.user.uid), info);

      // localStorage에도 저장 (기존 호환성 유지)
      localStorage.setItem(`user_${userCredential.user.uid}`, JSON.stringify(info));

      setUserInfo(info);
      return { success: true };
    } catch (error) {
      let errorMessage = '회원가입에 실패했습니다.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = '이미 사용 중인 이메일입니다.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = '이메일 형식이 올바르지 않습니다.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = '비밀번호는 최소 6자 이상이어야 합니다.';
      }
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserInfo(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getUserInfo = () => {
    return userInfo;
  };

  const value = {
    currentUser,
    userInfo,
    login,
    register,
    logout,
    getUserInfo,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
