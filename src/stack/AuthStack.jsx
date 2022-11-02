import React, { useEffect, useState  } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

//    "proxy":"http://localhost:3000"

// Import pages
import Signin from '../pages/MainPages/Signin';
import Blank from '../pages//MainPages/Blank';
import Onboarding01 from '../pages/MainPages/Onboarding01';
import Onboarding02 from '../pages/MainPages/Onboarding02';
import Onboarding03 from '../pages/MainPages/Onboarding03';
import Onboarding04 from '../pages/MainPages/Onboarding04';
import Onboarding05 from '../pages/MainPages/Onboarding05';

function AuthStack() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto';
    window.scroll({ top: 0 });
    document.querySelector('html').style.scrollBehavior = '';
  }, [location.pathname]); // triggered on route change


  return (
    <>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        
        <Route path="/blank" element={<Blank />} />
        <Route path="/onboarding-01" element={<Onboarding01 />} />
        <Route path="/onboarding-02" element={<Onboarding02 />} />
        <Route path="/onboarding-03" element={<Onboarding03 />} />
        <Route path="/onboarding-04" element={<Onboarding04 />} />
        <Route path="/onboarding-05" element={<Onboarding05 />} />
      </Routes>
    </>
  );
}

export default AuthStack;
