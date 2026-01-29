import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
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
      // 사용자 정보를 localStorage에 저장
      const userInfo = {
        uid: userCredential.user.uid,
        email: email,
        schoolLevel: schoolLevel,
        grade: grade,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem(`user_${userCredential.user.uid}`, JSON.stringify(userInfo));
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
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getUserInfo = () => {
    if (!currentUser) return null;
    const userInfo = localStorage.getItem(`user_${currentUser.uid}`);
    return userInfo ? JSON.parse(userInfo) : null;
  };

  const value = {
    currentUser,
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
